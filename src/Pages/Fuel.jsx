
// import { useEffect, useState } from "react"
// import {
//   Table,
//   Button,
//   Input,
//   Modal,
//   Card,
//   Space,
//   Typography,
//   Tag,
//   Row,
//   Col,
//   Tooltip,
//   DatePicker,
//   message,
// } from "antd"
// import {
//   CarOutlined,
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   PrinterOutlined,
//   FilterOutlined,
//   SearchOutlined,
//   FileTextOutlined,
//   FileExcelOutlined,
//   FilePdfOutlined,
// } from "@ant-design/icons"
// import { useRef } from "react";
// import ReactToPrint from "react-to-print";
// import axios from "axios"
// import { Link } from "react-router-dom"
// import * as XLSX from "xlsx"
// import { saveAs } from "file-saver"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// import dayjs from "dayjs"
// import { RiDeleteBinLine } from "react-icons/ri";

// const { Title, Text } = Typography
// const { Search } = Input
// const { RangePicker } = DatePicker

// const Fuel = () => {
//   const [fuel, setFuel] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showFilter, setShowFilter] = useState(false)
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false)
//   const [selectedFuelId, setSelectedFuelId] = useState(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [dateRange, setDateRange] = useState([])
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   })

//   useEffect(() => {
//     fetchFuelData()
//   }, [])

//   const fetchFuelData = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/fuel`)
//       if (response.data.status === "success") {
//         setFuel(response.data.data)
//       }
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching fuel data:", error)
//       message.error("ফুয়েল ডেটা লোড করতে সমস্যা হয়েছে")
//       setLoading(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!selectedFuelId) return

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/fuel/${selectedFuelId}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete fuel")
//       }

//       setFuel((prev) => prev.filter((item) => item.id !== selectedFuelId))
//       message.success("ফুয়েল রেকর্ড সফলভাবে ডিলিট হয়েছে")
//       setDeleteModalOpen(false)
//       setSelectedFuelId(null)
//     } catch (error) {
//       console.error("Delete error:", error)
//       message.error("ডিলিট করতে সমস্যা হয়েছে!")
//     }
//   }

//   // Export functionality
//   const headers = [
//     { label: "#", key: "index" },
//     { label: "ড্রাইভারের নাম", key: "driver_name" },
//     { label: "গাড়ির নাম", key: "vehicle_name" },
//     { label: "ফুয়েলের ধরন", key: "type" },
//     { label: "ফুয়েলিং তারিখ", key: "date_time" },
//     { label: "গ্যালন/লিটার", key: "quantity" },
//     { label: "লিটার প্রতি খরচ", key: "price" },
//     { label: "সকল খরচ", key: "total" },
//   ]

//   const csvData = fuel.map((dt, index) => ({
//     index: index + 1,
//     driver_name: dt.driver_name,
//     vehicle_name: dt.vehicle_number,
//     type: dt.type,
//     date_time: dt.date_time,
//     quantity: dt.quantity,
//     price: dt.price,
//     total: dt.quantity * dt.price,
//   }))

//   const exportCSV = () => {
//     const csvContent = [
//       ["#", "ড্রাইভারের নাম", "গাড়ির নাম", "ফুয়েলের ধরন", "ফুয়েলিং তারিখ", "গ্যালন/লিটার", "লিটার প্রতি খরচ", "সকল খরচ"],
//       ...csvData.map((item) => [
//         item.index,
//         item.driver_name,
//         item.vehicle_name,
//         item.type,
//         item.date_time,
//         item.quantity,
//         item.price,
//         item.total,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n")

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     saveAs(blob, "fuel_data.csv")
//   }

//   const exportExcel = () => {
//     const headers = ["#", "ড্রাইভারের নাম", "গাড়ির নাম", "ফুয়েলের ধরন", "ফুয়েলিং তারিখ", "গ্যালন/লিটার", "লিটার প্রতি খরচ", "সকল খরচ"]

//     const formattedData = csvData.map((item) => ({
//       "#": item.index,
//       "ড্রাইভারের নাম": item.driver_name,
//       "গাড়ির নাম": item.vehicle_name,
//       "ফুয়েলের ধরন": item.type,
//       "ফুয়েলিং তারিখ": item.date_time,
//       "গ্যালন/লিটার": item.quantity,
//       "লিটার প্রতি খরচ": item.price,
//       "সকল খরচ": item.total,
//     }))

//     const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers })
//     const workbook = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Fuel Data")
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" })
//     saveAs(data, "fuel_data.xlsx")
//   }

//   const exportPDF = () => {
//     const doc = new jsPDF()
//     const tableColumn = [
//       "#",
//       "Driver Name",
//       "Car Name",
//       "Fuel Type",
//       "Fueling Date",
//       "Gallon/Liter",
//       "Liter per cost",
//       "Total cost",
//     ]

//     const tableRows = csvData.map((item) => [
//       item.index,
//       item.driver_name,
//       item.vehicle_name,
//       item.type,
//       item.date_time,
//       item.quantity,
//       item.price,
//       item.total,
//     ])

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       styles: { font: "helvetica", fontSize: 8 },
//     })

//     doc.save("fuel_data.pdf")
//   }


//   const printFuelTable = () => {
//   const actionColumns = document.querySelectorAll(".action_column");
//   actionColumns.forEach((col) => {
//     col.style.display = "none";
//   });

//   const printContent = document.querySelector("table").outerHTML;
//   const WinPrint = window.open("", "", "width=900,height=650");
//   WinPrint.document.write(`
//     <html>
//       <head>
//         <title>Print</title>
//         <style>
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid #000; padding: 8px; text-align: left; }
//         </style>
//       </head>
//       <body>${printContent}</body>
//     </html>
//   `);
//   WinPrint.document.close();
//   WinPrint.focus();
//   WinPrint.print();

//   // প্রিন্ট শেষ হলে UI রিকভার করার জন্য
//   window.onafterprint = () => {
//     actionColumns.forEach((col) => {
//       col.style.display = "";
//     });
//     window.onafterprint = null; // ইভেন্ট মুছে ফেলুন যাতে বারবার না হয়
//   };

//   // যদি ব্রাউজার onafterprint সাপোর্ট না করে, তাহলে কিছু সময় পর রিকভার করুন
//   setTimeout(() => {
//     actionColumns.forEach((col) => {
//       col.style.display = "";
//     });
//   }, 1000);

//   WinPrint.close();
// };


//   // Filter fuel data
//   const filteredFuel = fuel.filter((dt) => {
//     const term = searchTerm.toLowerCase()
//     const fuelDate = dayjs(dt.date_time)

//     const matchesSearch =
//       dt.date_time?.toLowerCase().includes(term) ||
//       dt.vehicle_number?.toLowerCase().includes(term) ||
//       dt.driver_name?.toLowerCase().includes(term) ||
//       dt.trip_id_invoice_no?.toLowerCase().includes(term) ||
//       dt.pump_name_address?.toLowerCase().includes(term) ||
//       String(dt.capacity).includes(term) ||
//       dt.type?.toLowerCase().includes(term) ||
//       String(dt.quantity).includes(term) ||
//       dt.price?.toLowerCase().includes(term) ||
//       dt.total_price?.toLowerCase().includes(term)

//     const matchesDateRange =
//       dateRange.length === 0 ||
//       (fuelDate.isAfter(dayjs(dateRange[0]).subtract(1, "day")) && fuelDate.isBefore(dayjs(dateRange[1]).add(1, "day")))

//     return matchesSearch && matchesDateRange
//   })

//   // Calculate totals
//   const totalQuantity = filteredFuel.reduce((sum, item) => sum + Number.parseFloat(item.quantity || 0), 0)
//   const totalCost = filteredFuel.reduce(
//     (sum, item) => sum + Number.parseFloat(item.quantity || 0) * Number.parseFloat(item.price || 0),
//     0,
//   )
//   const totalRecords = filteredFuel.length
//   const averagePricePerLiter = totalQuantity > 0 ? totalCost / totalQuantity : 0

//   // Table columns
//   const columns = [
//     {
//       title: "SL",
//       key: "index",
//       width: 40,
//       render: (_, __, index) => (
//         <Text strong style={{ color: "#11375b" }}>
//           {(pagination.current - 1) * pagination.pageSize + index + 1}
//         </Text>
//       ),
//     },
//     {
//       title: "ড্রাইভারের নাম",
//       dataIndex: "driver_name",
//       key: "driver_name",
//       width: 150,
//       render: (name) => (
//         <Space>
//           <Text strong>{name}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "গাড়ির নাম",
//       dataIndex: "vehicle_number",
//       key: "vehicle_number",
//       width: 100,
//       render: (vehicle) => (
//         <Space>
//           <Text>{vehicle}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "ফুয়েলের ধরন",
//       dataIndex: "type",
//       key: "type",
//       width: 100,
//       render: (type) => <Tag color={type === "Petrol" ? "blue" : type === "Diesel" ? "green" : "orange"}>{type}</Tag>,
//     },
//     {
//       title: "ফুয়েলিং তারিখ",
//       dataIndex: "date_time",
//       key: "date_time",
//       width: 130,
//       render: (date) => (
//         <Space>
//           <Text>{date}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "গ্যালন/লিটার",
//       dataIndex: "quantity",
//       key: "quantity",
//       width: 100,
//       render: (quantity) => (
//         <Space>
//           <Text strong>{quantity}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "লিটার প্রতি খরচ",
//       dataIndex: "price",
//       key: "price",
//       width: 130,
//       render: (price) => (
//         <Space>
//           <Text>{price}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "সকল খরচ",
//       key: "total",
//       width: 120,
//       render: (_, record) => (
//         <Text  >
//           {(Number.parseFloat(record.quantity || 0) * Number.parseFloat(record.price || 0)).toFixed(2)}
//         </Text>
//       ),
//     },
//     {
//       title: "অ্যাকশন",
//       key: "actions",
//       width: 100,
//        className: "action_column",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="সম্পাদনা">
//                      <Link to={`/tramessy/update-FuelForm/${record.id}`}>
//                         <EditOutlined
//                           className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary"
//                         />
//                         </Link>
//                       </Tooltip>
//           <Tooltip title="ডিলিট">
//                                   <RiDeleteBinLine
//                                     className="!text-red-500 p-1 text-white cursor-pointer text-2xl rounded"
//                                    onClick={() => {
//                 setSelectedFuelId(record.id)
//                 setDeleteModalOpen(true)
//               }}
//                                   />
//                                 </Tooltip> 
//         </Space>
//       ),
//     },
//   ]

//   // print
//   const printRef = useRef();

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         padding: "10px",
//       }}
//     >
//       <Card
//         className=""
//         style={{
//           boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//           background: "rgba(255,255,255,0.9)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         {/* Header */}
//         <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }} gutter={[16, 16]}>
//           <Col>
//             <Title level={4} style={{ margin: 0, color: "#11375B" }}>
//               <CarOutlined style={{ marginRight: "12px", color: "#11375B" }} />
//               ফুয়েল হিসাব
//             </Title>
//           </Col>
//           <Col>
//             <Space>
//               <Link to="/tramessy/fuel-form">
//                 <Button
//                   type="primary"
//                   icon={<PlusOutlined />}
//                   size="medium"
//                   style={{
//                     boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
//                   }}
//                   className="!bg-primary"
//                 >
//                   ফুয়েল
//                 </Button>
//               </Link>
//               <Button
//   icon={<FilterOutlined />}
//   onClick={() => setShowFilter(!showFilter)}
//   className={`border border-[#11375b] px-4 py-1 rounded 
//     ${showFilter ? "bg-[#11375b] text-white" : "bg-transparent text-[#11375b]"}`}
// >
//   ফিল্টার
//               </Button>
//             </Space>
//           </Col>
//         </Row>

//         {/* Filter Section */}
//         {showFilter && (
//           <Card style={{ marginBottom: "16px" }}>
//             <Row gutter={16} align="middle">
//               <Col sm={10} lg={20}>
//                 <RangePicker
//                   style={{ width: "100%" }}
//                   onChange={(dates) => setDateRange( dates ?? [])}
//                   placeholder={["শুরুর তারিখ", "শেষের তারিখ"]}
//                 />
//               </Col>
//               <Col span={4}>
//                 <Button
//                   type="primary"
//                   icon={<FilterOutlined />}
//                   style={{ background: "#11375B", borderColor: "#11375B" }}
//                 >
//                   ফিল্টার
//                 </Button>
//               </Col>
//             </Row>
//           </Card>
//         )}

//         {/* Export and Search */}
//         <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }} gutter={[16, 16]}>
//           <Col>
//             {/* <Space>
//               <Dropdown menu={{ items: exportMenuItems }} placement="bottomLeft">
//                 <Button icon={<ExportOutlined />}>Export</Button>
//               </Dropdown>
//               <Button icon={<PrinterOutlined />} onClick={printTable}>
//                 Print
//               </Button>
//             </Space> */}
//             <Space wrap>
//     {/* CSV */}
//     <Button
//       icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
//       className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
//       onClick={exportCSV}
//     >
//       CSV
//     </Button>

//     {/* Excel */}
//     <Button
//       icon={<FileExcelOutlined style={{ color: "#52c41a" }} />} 
//       onClick={exportExcel}
//       className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary"
//     >
//       Excel
//     </Button>

//     {/* PDF */}
//     <Button
//       icon={<FilePdfOutlined style={{ color: "#f5222d" }} />}
//       onClick={exportPDF}
//       className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary"
//     >
//       PDF
//     </Button>

//     {/* Print */}
//     <Button
//       icon={<PrinterOutlined style={{ color: "#722ed1" }} />} 
//       onClick={printFuelTable}
//       className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
//     >
//       Print
//     </Button>

//   </Space>
//           </Col>  
//                {/* Search  fuel */}
//           <Col>
//   <Search
//     placeholder="ফুয়েল খুঁজুন...."
//     allowClear
//     onChange={(e) => setSearchTerm(e.target.value)}
//     enterButton={
//       <Button
//         style={{
//           backgroundColor: "#11375B", 
//           color: "#fff",              
//           borderColor: "#11375B"
//         }}
//       >
//         <SearchOutlined className="!text-white"/>
//       </Button>
//     }
//   />
// </Col>
//         </Row>

//         {/* Table */}
//         <div ref={printRef}>
//         <Table
//           columns={columns}
//           dataSource={filteredFuel}
//           loading={loading}
//           rowKey="id"
//           scroll={{ x: "max-content" }}
//           size="middle"
//           pagination={{
//             current: pagination.current,
//             pageSize: pagination.pageSize,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50", "100"],
//             onChange: (page, pageSize) => {
//               setPagination({ current: page, pageSize })
//             },
//             onShowSizeChange: (current, size) => {
//               setPagination({ current: 1, pageSize: size })
//             },
//             // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
//           }}
//          summary={(pageData) => {
//         let totalQuantity = 0;
//         let totalPrice = 0;
//         let totalCost = 0;

//         pageData.forEach(({ quantity, price }) => {
//           const q = Number(quantity) || 0;
//           const p = Number(price) || 0;
//           totalQuantity += q;
//           totalPrice += p;
//           totalCost += q * p;
//         });

//         return (
//           <Table.Summary fixed>
//             <Table.Summary.Row className="!bg-blue-50">
//               <Table.Summary.Cell index={0} colSpan={5}>
//                 <Text strong className="!text-primary">Total</Text>
//               </Table.Summary.Cell>
//               <Table.Summary.Cell index={1}>
//                 <Text strong className="!text-primary">৳ {totalQuantity.toFixed(2)}</Text>
//               </Table.Summary.Cell>
//               <Table.Summary.Cell index={2}>
//                 <Text strong className="!text-primary">৳ {totalPrice.toFixed(2)}</Text>
//               </Table.Summary.Cell>
//               <Table.Summary.Cell index={3}>
//                 <Text strong className="!text-primary">৳ {totalCost.toFixed(2)}</Text>
//               </Table.Summary.Cell>
//               <Table.Summary.Cell />
//             </Table.Summary.Row>
//           </Table.Summary>
//         );
//       }}
//         />
//         </div>

//         {/* Delete Modal */}
//         <Modal
//           title={
//             <Space>
//               <DeleteOutlined style={{ color: "#ff4d4f" }} />
//               ফুয়েল রেকর্ড ডিলিট করুন
//             </Space>
//           }
//           open={deleteModalOpen}
//           onOk={handleDelete}
//           onCancel={() => {
//             setDeleteModalOpen(false)
//             setSelectedFuelId(null)
//           }}
//           okText="হ্যাঁ"
//           cancelText="না"
//           okButtonProps={{ danger: true }}
//         >
//           <p>আপনি কি নিশ্চিত যে এই ফুয়েল রেকর্ডটি ডিলিট করতে চান?</p>
//         </Modal>

//         <style jsx>{`
//           :global(.ant-table-thead > tr > th) {
//             padding: 8px 12px !important;
//             font-weight: 500 !important;
//             font-size: 14px !important;
//             background-color: #f8f9fa !important;
//             color: #495057 !important;
//             height: auto !important;
//           }
          
//           :global(.ant-table-tbody > tr > td) {
//             padding: 10px 12px !important;
//           }
//         `}</style>
//       </Card>
//     </div>
//   )
// }

// export default Fuel

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
    actionColumns.forEach((col) => {
      col.style.display = "none";
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