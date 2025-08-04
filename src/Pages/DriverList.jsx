
import { useEffect, useState } from "react";
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
  Dropdown,
  Descriptions,
  message,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExportOutlined,
  PrinterOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import api from "../utils/axiosConfig";

const { Title, Text } = Typography;
const { Search } = Input;

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
  try {
    const response = await api.get("/api/driver"); 
     setDrivers(response.data); 
    setLoading(false);
  } catch (error) {
    console.error("Error fetching driver data:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized (token expired)
      window.location.href = "/tramessy/Login";
    }
    setLoading(false);
  }
};

console.log("Drivers:", drivers);
  const handleDelete = async () => {
  if (!selectedDriverId) return;

  try {
    const response = await api.delete(`/api/driver/${selectedDriverId}`); // Use axios.delete
    setDrivers((prev) => prev.filter((driver) => driver.id !== selectedDriverId));
    message.success("Driver deleted successfully");
    setDeleteModalOpen(false);
    setSelectedDriverId(null);
  } catch (error) {
    console.error("Delete error:", error);
    message.error("Failed to delete driver!");
  }
};
  const handleView = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/driver/${id}`);
      if (response.data.status === "success") {
        setSelectedDriver(response.data.data);
        setViewModalOpen(true);
      } else {
        message.error("Failed to load driver details");
      }
    } catch (error) {
      console.error("View error:", error);
    }
  };

  // Export functionality
  const driverHeaders = [
    { label: "#", key: "index" },
    { label: "Name", key: "name" },
    { label: "Mobile", key: "contact" },
    { label: "Address", key: "address" },
    { label: "Emergency Contact", key: "emergency_contact" },
    { label: "License", key: "license" },
    { label: "License Expiry", key: "expire_date" },
    { label: "Status", key: "status" },
  ];

  const driverCsvData = drivers?.map((driver, index) => ({
    index: index + 1,
    name: driver.driver_name,
    contact: driver.driver_mobile,
    address: driver.address,
    license: driver.lincense,
    expire_date: driver.expire_date,
  }));

  const exportCSV = () => {
    const csvContent = [
      ["#", "Name", "Mobile", "Address", "License", "License Expiry"],
      ...driverCsvData.map((item) => [
        item.index,
        item.name,
        item.contact,
        item.address,
        item.emergency_contact,
        item.license,
        item.expire_date,
        item.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "drivers_data.csv");
  };

  const exportDriversToExcel = () => {
    const headers = ["#", "Name", "Mobile", "Address",  "License", "License Expiry", "Status"];

    const formattedData = drivers.map((driver, index) => ({
      "#": index + 1,
      Name: driver.driver_name,
      Mobile: driver.driver_mobile,
      Address: driver.address,
      License: driver.lincense,
      "License Expiry": driver.expire_date,
      Status: driver.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "drivers.xlsx");
  };

  const exportDriversToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["#", "Name", "Mobile", "Address", "License", "License Expiry"];

    const tableRows = driverCsvData.map((driver, index) => [
      index + 1,
      driver.name,
      driver.contact,
      driver.address,
      driver.license,
      driver.expire_date,
      driver.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { font: "helvetica", fontSize: 8 },
    });

    doc.save("drivers.pdf");
  };

  const printDriversTable = () => {
    const actionColumns = document.querySelectorAll(".action_column");
    actionColumns.forEach((col) => {
      col.style.display = "none";
    });

    const printContent = document.querySelector("table").outerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print</title>
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

    // Restore UI after printing
    window.onafterprint = () => {
      actionColumns.forEach((col) => {
        col.style.display = "";
      });
      window.onafterprint = null;
    };

    setTimeout(() => {
      actionColumns.forEach((col) => {
        col.style.display = "";
      });
    }, 1000);

    WinPrint.close();
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers?.filter((driver) => {
    const term = searchTerm.toLowerCase();
    return (
      driver.driver_name?.toLowerCase().includes(term) ||
      driver.driver_mobile?.toLowerCase().includes(term) ||
      driver.nid?.toLowerCase().includes(term) ||
      driver.address?.toLowerCase().includes(term) ||
      driver.expire_date?.toLowerCase().includes(term) ||
      driver.note?.toLowerCase().includes(term) ||
      driver.lincense?.toLowerCase().includes(term) ||
      driver.status?.toLowerCase().includes(term)
    );
  });

  // Check if license is expired
  const isLicenseExpired = (expireDate) => {
    if (!expireDate) return false;
    const today = new Date();
    const expire = new Date(expireDate);
    return expire < today;
  };

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
      title: "Name",
      dataIndex: "driver_name",
      key: "driver_name",
      width: 150,
      render: (driver_name) => (
        <Space>
          <Text strong>{driver_name}</Text>
        </Space>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "driver_mobile",
      key: "driver_mobile",
      width: 130,
      render: (driver_mobile) => (
        <Space>
          <Text>{driver_mobile}</Text>
        </Space>
      ),
    },
    {
      title: "NID",
      dataIndex: "nid",
      key: "nid",
      width: 130,
      render: (nid) => (
        <Space>
          <Text>{nid}</Text>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "License",
      dataIndex: "lincense",
      key: "lincense",
      width: 120,
      render: (license) => (
        <Space>
          <Text>{license}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        let color = "success";
        let text = "Active";

        if (status === "inactive" || status === "Inactive") {
          color = "error";
          text = "Inactive";
        } else if (status === "suspended" || status === "Suspended") {
          color = "warning";
          text = "Suspended";
        } else if (status === "pending" || status === "Pending") {
          color = "processing";
          text = "Pending";
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Suspended", value: "suspended" },
        { text: "Pending", value: "pending" },
      ],
      onFilter: (value, record) => {
        const recordStatus = record.status?.toLowerCase() || "active";
        return recordStatus === value;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      className: "action_column",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Link to={`/tramessy/update-driverForm/${record.id}`}>
              <EditOutlined
                className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary"
                onClick={() => (window.location.href = `/tramessy/update-driverForm/${record.id}`)}
              />
            </Link>
          </Tooltip>

          {/* <Tooltip title="View">
            <EyeOutlined
              className="bg-white rounded shadow-md p-1 cursor-pointer text-lg hover:bg-primary hover:!text-white transition-all duration-300"
              onClick={() => handleView(record.id)}
            />
          </Tooltip> */}

          <Tooltip title="Delete">
            <RiDeleteBinLine
              className="!text-red-500 p-1 cursor-pointer text-2xl rounded"
              onClick={() => {
                setSelectedDriverId(record.id);
                setDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        // padding: "10px",
      }}
    >
      <Card
        className="rounded-lg"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }} gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: 0, color: "#11375B" }}>
              <UserOutlined style={{ marginRight: "12px", color: "#11375B" }} />
              Drivers List
            </Title>
          </Col>
          <Col>
            <Link to="/tramessy/add-driverForm">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="medium"
                className="!bg-primary"
              >
                Add Driver
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Export and Search */}
        <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }} gutter={[16, 16]}>
          <Col>
            <Space wrap>
              {/* CSV */}
              <Button
                icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
                onClick={exportCSV}
              >
                CSV
              </Button>

              {/* Excel */}
              <Button
                icon={<FileExcelOutlined style={{ color: "#52c41a" }} />}
                onClick={exportDriversToExcel}
                className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary"
              >
                Excel
              </Button>

              {/* PDF */}
              <Button
                icon={<FilePdfOutlined style={{ color: "#f5222d" }} />}
                onClick={exportDriversToPDF}
                className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary"
              >
                PDF
              </Button>

              {/* Print */}
              <Button
                icon={<PrinterOutlined style={{ color: "#722ed1" }} />}
                onClick={printDriversTable}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
              >
                Print
              </Button>
            </Space>
          </Col>
          <Col>
            <Search
              placeholder="Search driver..."
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
          dataSource={filteredDrivers}
          loading={loading}
          rowKey="id"
          size="middle"
          scroll={{ x: "max-content" }}
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
        />

        {/* Delete Modal */}
        <Modal
          title={
            <Space>
              <DeleteOutlined style={{ color: "#ff4d4f" }} />
              Delete Driver
            </Space>
          }
          open={deleteModalOpen}
          onOk={handleDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setSelectedDriverId(null);
          }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this driver?</p>
        </Modal>

        {/* View Modal */}
        <Modal
          title={
            <Space>
              <EyeOutlined style={{ color: "#1890ff" }} />
              Driver Details
            </Space>
          }
          open={viewModalOpen}
          onCancel={() => {
            setViewModalOpen(false);
            setSelectedDriver(null);
          }}
          footer={[
            <Button key="close" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedDriver && (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Name">{selectedDriver.name}</Descriptions.Item>
              <Descriptions.Item label="Mobile">{selectedDriver.contact}</Descriptions.Item>
              <Descriptions.Item label="Emergency Contact">{selectedDriver.emergency_contact}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedDriver.address}</Descriptions.Item>
              <Descriptions.Item label="NID">{selectedDriver.nid}</Descriptions.Item>
              <Descriptions.Item label="License">{selectedDriver.license}</Descriptions.Item>
              <Descriptions.Item label="License Expiry">
                <Text style={{ color: isLicenseExpired(selectedDriver.expire_date) ? "#ff4d4f" : "inherit" }}>
                  {selectedDriver.expire_date}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedDriver.status === "active" || !selectedDriver.status
                      ? "success"
                      : selectedDriver.status === "inactive"
                        ? "error"
                        : selectedDriver.status === "suspended"
                          ? "warning"
                          : "processing"
                  }
                >
                  {selectedDriver.status || "Active"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Note" span={2}>
                {selectedDriver.note || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default DriverList;