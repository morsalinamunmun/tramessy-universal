
import { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Card,
  Space,
  Typography,
  Tag,
  Row,
  Col,
  Tooltip,
  DatePicker,
  message,
  Statistic,
} from "antd";
import {
  CarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  FilterOutlined,
  SearchOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import api from "../utils/axiosConfig";

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Fuel = () => {
  const [fuel, setFuel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFuelId, setSelectedFuelId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
const rangePickerRef = useRef(null);
  useEffect(() => {
    fetchFuelData();
  }, []);

  const fetchFuelData = async () => {
    try {
      const response = await api.get(`/api/fuel`);
      setFuel(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fuel data:", error);
      message.error("Failed to load fuel data");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFuelId) return;

    try {
      await api.delete(`/api/fuel/${selectedFuelId}`);
      setFuel((prev) => prev.filter((item) => item.id !== selectedFuelId));
      message.success("Fuel record deleted successfully");
      setDeleteModalOpen(false);
      setSelectedFuelId(null);
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete fuel record!");
    }
  };

  // Export functionality
  const headers = [
    { label: "#", key: "index" },
    { label: "Date", key: "date" },
    { label: "Vehicle No", key: "vehicle_no" },
    { label: "Fuel Type", key: "fuel_type" },
    { label: "Unit Price", key: "unit_price" },
    { label: "Total Cost", key: "total_cost" },
    { label: "Pump Name", key: "pump_name" },
  ];

  const csvData = fuel.map((item, index) => ({
    index: index + 1,
    date: item.date,
    vehicle_no: item.vehicle_no,
    fuel_type: item.fuel_type,
    unit_price: item.unit_price,
    total_cost: item.total_cost,
    pump_name: item.pump_name,
  }));

  const exportCSV = () => {
    const csvContent = [
      headers.map(h => h.label),
      ...csvData.map(item => [
        item.index,
        item.date,
        item.vehicle_no,
        item.fuel_type,
        item.unit_price,
        item.total_cost,
        item.pump_name,
      ]),
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "fuel_data.csv");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fuel Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "fuel_data.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers.map(h => h.label)],
      body: fuel.map((item, index) => [
        index + 1,
        item.date,
        item.vehicle_no,
        item.fuel_type,
        item.unit_price,
        item.total_cost,
        item.pump_name,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: "#11375B" },
    });
    doc.save("fuel_data.pdf");
  };

  const printFuelTable = () => {
    const actionColumns = document.querySelectorAll(".action_column");
  const summaryCells = document.querySelectorAll(".ant-table-summary .ant-table-cell:last-child");
  
  actionColumns.forEach((col) => {
    col.style.display = "none";
  });
  
  summaryCells.forEach((cell) => {
    cell.style.display = "none";
  });

    const printContent = document.querySelector("table").outerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print Fuel Data</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();

    setTimeout(() => {
    actionColumns.forEach((col) => {
      col.style.display = "";
    });
    summaryCells.forEach((cell) => {
      cell.style.display = "";
    });
  }, 1000);
  };

  // Filter fuel data
  const filteredFuel = fuel.filter((item) => {
    const term = searchTerm.toLowerCase();
    const fuelDate = dayjs(item.date);

    const matchesSearch =
      item.date?.toLowerCase().includes(term) ||
      item.vehicle_no?.toLowerCase().includes(term) ||
      item.fuel_type?.toLowerCase().includes(term) ||
      item.unit_price?.toString().includes(term) ||
      item.total_cost?.toString().includes(term) ||
      item.pump_name?.toLowerCase().includes(term);

        const matchesDateRange =
      dateRange.length === 0 ||
      (fuelDate.isAfter(dayjs(dateRange[0]).subtract(1, "day")) && fuelDate.isBefore(dayjs(dateRange[1]).add(1, "day")))

    return matchesSearch && matchesDateRange
  })

  // Calculate totals
  const totalCost = filteredFuel.reduce(
    (sum, item) => sum + parseFloat(item.total_cost || 0),
    0
  );
  const totalRecords = filteredFuel.length;

  // Table columns
  const columns = [
    {
      title: "SL",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <Text strong style={{ color: "#11375b" }}>
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicle_no",
      key: "vehicle_no",
      width: 120,
    },
    {
      title: "Fuel Type",
      dataIndex: "fuel_type",
      key: "fuel_type",
      width: 100,
      render: (type) => (
        <p >
          {type}
        </p>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      width: 100,
      render: (price) => `৳${parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      width: 120,
      render: (cost) => `৳${parseFloat(cost).toFixed(2)}`,
    },
    {
      title: "Pump Name",
      dataIndex: "pump_name",
      key: "pump_name",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      className: "action_column",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Link to={`/tramessy/update-fuel/${record.id}`}>
              <EditOutlined className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBinLine
              className="!text-red-500 p-1 cursor-pointer text-2xl rounded"
              onClick={() => {
                setSelectedFuelId(record.id);
                setDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "10px" }}>
      <Card style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={4} style={{ margin: 0, color: "#11375B" }}>
              <CarOutlined style={{ marginRight: 12, color: "#11375B" }} />
              Fuel Records
            </Title>
          </Col>
          <Col>
            <Space>
              <Link to="/tramessy/add-fuel">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="!bg-primary"
                >
                  Add Fuel
                </Button>
              </Link>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(!showFilter)}
                className={`border border-[#11375b] px-4 py-1 rounded 
                  ${showFilter ? "bg-[#11375b] text-white" : "bg-transparent text-[#11375b]"}`}
              >
                Filter
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filter Section */}
        {showFilter && (
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={18}>
                <RangePicker
                  ref={rangePickerRef}
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates || [])}
                  placeholder={["Start Date", "End Date"]}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  style={{ background: "#11375B", borderColor: "#11375B" }}
                  onClick={() => {
    setDateRange([]);
    rangePickerRef.current?.picker?.setValue?.([]);
  }}
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        {/* Export and Search */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space wrap>
              <Button
                icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
                onClick={exportCSV}
              >
                CSV
              </Button>
              <Button
                icon={<FileExcelOutlined style={{ color: "#52c41a" }} />}
                onClick={exportExcel}
                className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary"
              >
                Excel
              </Button>
              <Button
                icon={<FilePdfOutlined style={{ color: "#f5222d" }} />}
                onClick={exportPDF}
                className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary"
              >
                PDF
              </Button>
              <Button
                icon={<PrinterOutlined style={{ color: "#722ed1" }} />}
                onClick={printFuelTable}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
              >
                Print
              </Button>
            </Space>
          </Col>
          <Col>
            <Search
              placeholder="Search fuel..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              enterButton={
                <Button
                  style={{
                    backgroundColor: "#11375B",
                    color: "#fff",
                    borderColor: "#11375B",
                  }}
                >
                  <SearchOutlined className="!text-white" />
                </Button>
              }
            />
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredFuel}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          size="middle"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
            onShowSizeChange: (current, size) => {
              setPagination({ current: 1, pageSize: size });
            },
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row className="!bg-blue-50">
                <Table.Summary.Cell index={0} colSpan={5}>
                  <Text strong className="!text-primary">
                    Total Records: {totalRecords}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong className="!text-primary">
                    Total Cost: ৳{totalCost.toFixed(2)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />

        {/* Delete Modal */}
        <Modal
          title={
            <Space>
              <DeleteOutlined style={{ color: "#ff4d4f" }} />
              Delete Fuel Record
            </Space>
          }
          open={deleteModalOpen}
          onOk={handleDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedFuelId(null);
          }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this fuel record?</p>
        </Modal>
      </Card>
    </div>
  );
};

export default Fuel;