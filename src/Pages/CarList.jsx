
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
  Descriptions,
  message,
} from "antd";
import {
  TruckOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { banglaFontBase64 } from "../assets/font/banglaFont";
import { RiDeleteBinLine } from "react-icons/ri";
import api from "../utils/axiosConfig";
import moment from "moment";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;

const CarList = () => {
  const [vehicles, setVehicle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get(`/api/vehicle`);
      // if (response.data.status === "success") {
        setVehicle(response.data);
      // }
    } catch (error) {
      message.error("Failed to load vehicle data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/vehicle/${selectedDriverId}`);
      setVehicle((prev) => prev.filter((v) => v.id !== selectedDriverId));
      message.success("Vehicle deleted successfully.");
      setDeleteModalOpen(false);
      setSelectedDriverId(null);
    } catch {
      message.error("Failed to delete the vehicle.");
    }
  };

  const handleViewCar = async (id) => {
    try {
      const response = await api.get(`/api/vehicle/${id}`);
      // if (response.data.status === "success") {
        setSelectedCar(response.data);
        setViewModalOpen(true);
      // } else {
      //   message.error("Failed to load vehicle data.");
      // }
    } catch {
      message.error("Could not fetch vehicle details.");
    }
  };

  const headers = [
  { label: "#", key: "index" },
  { label: "Driver", key: "driver_name" },
  { label: "Category", key: "vehicle_category" },
  { label: "Size", key: "vehicle_size" },
  { label: "Zone", key: "reg_zone" },
  { label: "Reg No", key: "reg_no" },
  { label: "Fuel", key: "fuel_capcity" },
  { label: "Fitness", key: "fitness_date" },
  { label: "Tax", key: "tax_date" },
  { label: "Route", key: "route_per_date" },
];

  const csvData = vehicles.map((v, i) => ({
  index: i + 1,
  driver_name: v.driver_name,
  vehicle_category: v.vehicle_category,
  vehicle_size: v.vehicle_size,
  reg_zone: v.reg_zone,
  reg_no: v.reg_no,
  fuel_capcity: v.fuel_capcity,
  fitness_date: v.fitness_date,
  tax_date: v.tax_date,
  route_per_date: v.route_per_date,
}));

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "vehicles_data.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.addFileToVFS("SolaimanLipi.ttf", banglaFontBase64);
    doc.addFont("SolaimanLipi.ttf", "SolaimanLipi", "normal");
    doc.setFont("SolaimanLipi");
    autoTable(doc, {
      head: [[ "#", "Driver", "Category","Size","Zone","Reg No", "Fuel", "Fitness","Tax","Route"]],
      body: vehicles.map((v, i) => [
        i + 1,
        v.driver_name,
        v.vehicle_name,
        v.vehicle_category,
        v.vehicle_size,
        v.reg_zone,
        v.reg_no,
        v.fuel_capcity,
        v.fitness_date,
        v.tax_date,
        v.route_per_date,
        0,
        v.registration_number,
      ]),
      styles: { font: "SolaimanLipi", fontSize: 10 },
      headStyles: { fillColor: "#11375B" },
    });
    doc.save("vehicles_data.pdf");
  };

  const filteredVehicles = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.vehicle_name?.toLowerCase().includes(term) ||
      v.driver_name?.toLowerCase().includes(term) ||
      v.category?.toLowerCase().includes(term)
    );
  });

  // Print cart tablew info
  const printCarTable = () => {
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

  // প্রিন্ট শেষ হলে UI রিকভার করার জন্য
  window.onafterprint = () => {
    actionColumns.forEach((col) => {
      col.style.display = "";
    });
    window.onafterprint = null; // ইভেন্ট মুছে ফেলুন যাতে বারবার না হয়
  };

  // যদি ব্রাউজার onafterprint সাপোর্ট না করে, তাহলে কিছু সময় পর রিকভার করুন
  setTimeout(() => {
    actionColumns.forEach((col) => {
      col.style.display = "";
    });
  }, 1000);

  WinPrint.close();
};

  const columns = [
    { title: "SL", render: (_, __, i) => i + 1, width: 50 },
  { title: "Driver Name", dataIndex: "driver_name" },
  // { title: "Category", dataIndex: "vehicle_category" },
  // { title: "Size", dataIndex: "vehicle_size" },
  // { title: "Zone", dataIndex: "reg_zone" },
  { title: "Registration No", dataIndex: "reg_no" },
  { title: "Fuel Capacity", dataIndex: "fuel_capcity" },
  { title: "Fitness Expire", dataIndex: "fitness_date",
render: (fitness_date) => dayjs(fitness_date).format("DD-MM-YYYY"),
   },
  { title: "Route Permit", dataIndex: "route_per_date",
    render: (route_per_date) => dayjs(route_per_date).format("DD-MM-YYYY"),
   },
  { title: "Tax Token", dataIndex: "tax_date",
    render: (tax_date) => dayjs(tax_date).format("DD-MM-YYYY"),
   },
  { title: "Reg. Date", dataIndex: "reg_date",
    render: (reg_date) => dayjs(reg_date).format("DD-MM-YYYY"),
  },
  
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 120,
    //   align: "center",
    //   render: (status) => {
    //     let color = "success"
    //     let text = "Active"

    //     if (status === "inactive" || status === "Inactive") {
    //       color = "error"
    //       text = "Inactive"
    //     } else if (status === "maintenance" || status === "Maintenance") {
    //       color = "warning"
    //       text = "Maintenance"
    //     } else if (status === "pending" || status === "Pending") {
    //       color = "processing"
    //       text = "Pending"
    //     }

    //     return <Tag color={color}>{text}</Tag>
    //   },
    //   filters: [
    //     { text: "Active", value: "active" },
    //     { text: "Inactive", value: "inactive" },
    //     { text: "Maintenance", value: "maintenance" },
    //     { text: "Pending", value: "pending" },
    //   ],
    //   onFilter: (value, record) => {
    //     const recordStatus = record.status?.toLowerCase() || "active"
    //     return recordStatus === value
    //   },
    // },
    {
      title: "Action",
      className: "action_column",
      render: (_, record) => (
        <Space>
                   <Tooltip title="Update">
                    <Link to={`/tramessy/update-carForm/${record.id}`}>
                        <EditOutlined
                          className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary"
                        />
                        </Link>
                      </Tooltip>
        
                  <Tooltip title="View">
                        <EyeOutlined 
                          className="bg-white shadow-md rounded p-1 cursor-pointer text-lg hover:bg-primary hover:!text-white transition-all duration-300"
                       onClick={() => handleViewCar(record.id)}
                        />
                      </Tooltip>         
                  
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
 const formatDate = (dateString) => {
    return dateString ? moment(dateString).format("DD-MM-YYYY") : "N/A";
  };
  return (
    <div className="overflow-hidden  mx-auto -z-10">
    <div
      style={{ padding: "10px", minHeight: "100vh" }}
    >
    <Card className="rounded-lg">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ color: "#11375B" }}>
            <TruckOutlined style={{ marginRight: 8 }} /> Vehicle List
          </Title>
        </Col>
        <Col>
          <Link to="/tramessy/add-carForm">
            <Button icon={<PlusOutlined />} type="primary" className="!bg-primary">
               Add Vehicle
            </Button>
          </Link>
        </Col>
      </Row>

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }} gutter={[16, 16]}>
        <Col>
          <Space wrap>
            <CSVLink data={csvData} headers={headers} filename="vehicles_data.csv">
              <Button icon={<FileTextOutlined style={{ color: "#1890ff" }} />} className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary">
                CSV
              </Button>
            </CSVLink>
            <Button icon={<FileExcelOutlined style={{ color: "#52c41a" }} />} onClick={exportExcel} className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary">
              Excel
            </Button>
            <Button icon={<FilePdfOutlined style={{ color: "#f5222d" }} />} onClick={exportPDF} className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary">
              PDF
            </Button>
            <Button icon={<PrinterOutlined style={{ color: "#722ed1" }} />} onClick={printCarTable} className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary">
              Print
            </Button>
          </Space>
        </Col>
         <Col>
  <Search
    placeholder="Search Vehicle..."
    allowClear
    onChange={(e) => setSearchTerm(e.target.value)}
    enterButton={
      <Button
        style={{
          backgroundColor: "#11375B", 
          color: "#fff",              
          borderColor: "#11375B"
        }}
      >
        <SearchOutlined className="!text-white"/>
      </Button>
    }
    // style={{ width: 300 }}
  />
</Col>
      </Row>

      <Table
  columns={columns}
  dataSource={filteredVehicles}
  rowKey="id"
  size="middle"
  loading={loading}
  pagination={pagination}
  onChange={(pg) => setPagination(pg)}
  scroll={{ x: 'max-content' }}
  summary={(pageData) => {
    let totalTrip = 0;
    pageData.forEach(({ trip_count }) => {
      totalTrip += Number(trip_count) || 0;
    });
    return (
      <Table.Summary fixed>
        <Table.Summary.Row className="bg-blue-50">
          <Table.Summary.Cell strong index={0} colSpan={6}>
            <Text className="!text-primary">
              {/* মোট ট্রিপ */}
              Total
            </Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <Text strong className="!text-primary">{totalTrip}</Text>
          </Table.Summary.Cell>
          {/* Remaining columns blank */}
          <Table.Summary.Cell />
          <Table.Summary.Cell />
          <Table.Summary.Cell />
        </Table.Summary.Row>
      </Table.Summary>
    );
  }}
/>


       <Modal
            title="Delete Vehicle"
            open={deleteModalOpen}
            onOk={handleDelete}
            onCancel={() => setDeleteModalOpen(false)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            Are you sure you want to delete this vehicle?
          </Modal>
       <Modal
            title="Vehicle Details"
            open={viewModalOpen}
            onCancel={() => setViewModalOpen(false)}
            footer={false}
            width={800}
          >
            {selectedCar && (
              <Descriptions bordered column={2} size="small" layout="vertical">
                <Descriptions.Item label="Driver Name">{selectedCar.driver_name || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Vehicle Name">{selectedCar.vehicle_name || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Vehicle Type">{selectedCar.vehicle_category || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Vehicle Size">{selectedCar.vehicle_size || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Registration Number">{selectedCar.reg_no || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Registration Serial">{selectedCar.reg_serial || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Registration Zone">{selectedCar.reg_zone || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Registration Date">{formatDate(selectedCar.reg_date)}</Descriptions.Item>
                <Descriptions.Item label="Tax Expiry Date">{formatDate(selectedCar.tax_date)}</Descriptions.Item>
                <Descriptions.Item label="Road Permit Date">{formatDate(selectedCar.route_per_date)}</Descriptions.Item>
                <Descriptions.Item label="Fitness Date">{formatDate(selectedCar.fitness_date)}</Descriptions.Item>
                <Descriptions.Item label="Fuel Capacity">{selectedCar.fuel_capcity || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={selectedCar.status === "active" ? "green" : "red"}>
                    {selectedCar.status || "N/A"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
    </Card>
    </div>
    </div>
  );
};

export default CarList;
