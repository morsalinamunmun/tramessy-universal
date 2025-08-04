
// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Input,
//   DatePicker,
//   Modal,
//   Card,
//   Space,
//   Typography,
//   Tooltip,
//   Row,
//   Col,
//   Statistic,
//   Divider,
//   message,
// } from "antd";
// import {
//   TruckOutlined,
//   PlusOutlined,
//   FilterOutlined,
//   EditOutlined,
//   EyeOutlined,
//   DeleteOutlined,
//   PrinterOutlined,
//   SearchOutlined,
//   FileTextOutlined,
//   FileExcelOutlined,
//   FilePdfOutlined,
// } from "@ant-design/icons";
// import { RiDeleteBinLine } from "react-icons/ri";
// import dayjs from "dayjs";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { saveAs } from "file-saver";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import { Link } from "react-router-dom";
// import api from "../utils/axiosConfig";

// dayjs.extend(isSameOrAfter);
// dayjs.extend(isSameOrBefore);

// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;
// const { Search } = Input;

// const TripList = () => {
//   const [trip, setTrip] = useState([]);
//   const [filteredTrip, setFilteredTrip] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFilter, setShowFilter] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateRange, setDateRange] = useState(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedTripId, setSelectedTripId] = useState(null);
//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });

//   const printTripTable = () => {
//     const actionColumns = document.querySelectorAll(".action_column");
//     actionColumns.forEach((col) => {
//       col.style.display = "none";
//     });

//     const printContent = document.querySelector("table").outerHTML;
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(`
//       <html>
//         <head>
//           <title>Print</title>
//           <style>
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #000; padding: 8px; text-align: left; }
//           </style>
//         </head>
//         <body>${printContent}</body>
//       </html>
//     `);
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();

//     window.onafterprint = () => {
//       actionColumns.forEach((col) => {
//         col.style.display = "";
//       });
//       window.onafterprint = null;
//     };

//     setTimeout(() => {
//       actionColumns.forEach((col) => {
//         col.style.display = "";
//       });
//     }, 1000);

//     WinPrint.close();
//   };

//   useEffect(() => {
//     fetchTrips();
//   }, []);

//   const fetchTrips = async () => {
//     try {
//       const response = await api.get(`/api/trip`);
//       const data = response.data;

//       // if (data.status === "success") {
//         const sortedData = data.sort((a, b) => {
//           return new Date(b.trip_date).getTime() - new Date(a.trip_date).getTime();
//         });
//         setTrip(sortedData);
//         setFilteredTrip(sortedData);
//       // }
//     } catch (error) {
//       console.error("Error fetching trip data:", error);
//       message.error("Failed to load trip data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const filtered = trip.filter((dt) => {
//       const term = searchTerm.toLowerCase();
//       const tripDate = dayjs(dt.trip_date);

//       const matchesSearch =
//         dt.trip_date?.toLowerCase().includes(term) ||
//         dt.trip_time?.toLowerCase().includes(term) ||
//         dt.load_point?.toLowerCase().includes(term) ||
//         dt.unload_point?.toLowerCase().includes(term) ||
//         dt.driver_name?.toLowerCase().includes(term) ||
//         dt.customer?.toLowerCase().includes(term) ||
//         dt.driver_contact?.toLowerCase().includes(term) ||
//         String(dt.driver_percentage).includes(term) ||
//         String(dt.fuel_price).includes(term) ||
//         String(dt.gas_price).includes(term) ||
//         dt.vehicle_number?.toLowerCase().includes(term) ||
//         String(dt.other_expenses).includes(term) ||
//         String(dt.trip_price).includes(term);

//       const matchesDateRange =
//         !dateRange ||
//         (tripDate.isSameOrAfter(dayjs(dateRange[0]).startOf("day")) &&
//           tripDate.isSameOrBefore(dayjs(dateRange[1]).endOf("day")));

//       return matchesSearch && matchesDateRange;
//     });

//     setFilteredTrip(filtered);
//   }, [trip, searchTerm, dateRange]);

//   const handleDelete = async () => {
//     if (!selectedTripId) return;

//     try {
//       const response = await api.delete(`/api/trip/${selectedTripId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete trip");
//       }

//       setTrip((prev) => prev.filter((trip) => trip.id !== selectedTripId));
//       message.success("Trip deleted successfully");
//       setDeleteModalOpen(false);
//       setSelectedTripId(null);
//     } catch (error) {
//       console.error("Delete error:", error);
//       message.error("Failed to delete trip!");
//     }
//   };

//   const handleView = async (id) => {
//     try {
//       const response = await api.get(`/api/trip/${id}`);

//       // if (data.status === "success") {
//         setSelectedTrip(response.data);
//         setViewModalOpen(true);
//       // }
//     } catch (error) {
//       console.error("View error:", error);
//       message.error("Failed to load trip details");
//     }
//   };

//   const calculateTotals = () => {
//     const totalTrips = filteredTrip.length;
//     const totalCost = filteredTrip.reduce((sum, trip) => {
//       const fuel = Number.parseFloat(trip.fuel_price) || 0;
//       const gas = Number.parseFloat(trip.gas_price) || 0;
//       const others = Number.parseFloat(trip.other_expenses) || 0;
//       const demarage = Number.parseFloat(trip.demarage) || 0;
//       const commission = Number.parseFloat(trip.driver_percentage) || 0;
//       return sum + fuel + gas + others + demarage + commission;
//     }, 0);

//     const totalRevenue = filteredTrip.reduce((sum, trip) => sum + (trip.trip_price || 0), 0);
//     const totalProfit = totalRevenue - totalCost;

//     return { totalTrips, totalCost, totalRevenue, totalProfit };
//   };

//   const { totalTrips, totalCost, totalRevenue, totalProfit } = calculateTotals();

//   const exportData = filteredTrip.map((dt, index) => {
//     const fuel = Number.parseFloat(dt.fuel_price) || 0;
//     const gas = Number.parseFloat(dt.gas_price) || 0;
//     const others = Number.parseFloat(dt.other_expenses) || 0;
//     const demarage = Number.parseFloat(dt.demarage) || 0;
//     const commission = Number.parseFloat(dt.driver_percentage) || 0;
//     const totalCost = fuel + gas + others + demarage + commission;
//     const profit = (dt.trip_price || 0) - totalCost;

//     return {
//       index: index + 1,
//       trip_date: dt.trip_date,
//       driver_name: dt.driver_name,
//       driver_contact: dt.driver_contact,
//       driver_percentage: dt.driver_percentage,
//       load_point: dt.load_point,
//       unload_point: dt.unload_point,
//       trip_time: dt.trip_time,
//       totalCost: totalCost.toFixed(2),
//       trip_price: dt.trip_price,
//       profit: profit.toFixed(2),
//     };
//   });

//   const exportExcel = () => {
//     const headers = [
//       "Index",
//       "Trip Date",
//       "Driver Name",
//       "Driver Contact",
//       "Driver Percentage",
//       "Load Point",
//       "Unload Point",
//       "Trip Time",
//       "Total Cost",
//       "Trip Price",
//       "Profit",
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Trip Data");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "trip_data.xlsx");
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = [
//       "#",
//       "Date",
//       "Driver",
//       "Contact",
//       "Commission",
//       "Load",
//       "Unload",
//       "Time",
//       "Cost",
//       "Price",
//       "Profit",
//     ];
//     const tableRows = exportData.map((row) => [
//       row.index,
//       row.trip_date,
//       row.driver_name,
//       row.driver_contact,
//       row.driver_percentage,
//       row.load_point,
//       row.unload_point,
//       row.trip_time,
//       row.totalCost,
//       row.trip_price,
//       row.profit,
//     ]);

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       styles: { font: "helvetica", fontSize: 8 },
//     });
//     doc.save("trip_data.pdf");
//   };

//   const exportCSV = () => {
//     const csvContent = [
//       [
//         "#",
//         "Date",
//         "Driver Name",
//         "Mobile",
//         "Commission",
//         "Load Point",
//         "Unload Point",
//         "Trip Time",
//         "Trip Cost",
//         "Trip Fare",
//         "Total Income",
//       ],
//       ...exportData.map((row) => [
//         row.index,
//         row.trip_date,
//         row.driver_name,
//         row.driver_contact,
//         row.driver_percentage,
//         row.load_point,
//         row.unload_point,
//         row.trip_time,
//         row.totalCost,
//         row.trip_price,
//         row.profit,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "trip_data.csv");
//   };

//   const columns = [
//     {
//       title: "SL",
//       key: "index",
//       width: 50,
//       render: (_, __, index) => (
//         <Text strong style={{ color: "#11375b" }}>
//           {index + 1}
//         </Text>
//       ),
//     },
//     {
//       title: "Date",
//       dataIndex: "trip_date",
//       key: "trip_date",
//       width: 130,
//       render: (date) => (
//         <Space direction="vertical" size={0}>
//           <Text>{date}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "Trip and Destination",
//       key: "trip_destination",
//       width: 200,
//       render: (_, record) => (
//         <Space direction="vertical" size={0}>
//           <Text>Load: {record.load_point}</Text>
//           <Text>Unload: {record.unload_point}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "Customer Info",
//       key: "customer_info",
//       width: 180,
//       render: (_, record) => (
//         <Space direction="vertical" size={0}>
//           <Text>Name: {record.customer}</Text>
//           <Text>Mobile: {record.customer_mobile}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "Trip Cost",
//       key: "total_cost",
//       width: 130,
//       render: (_, record) => {
//         const fuel = Number.parseFloat(record.fuel_price) || 0;
//         const gas = Number.parseFloat(record.gas_price) || 0;
//         const others = Number.parseFloat(record.other_expenses) || 0;
//         const demarage = Number.parseFloat(record.demarage) || 0;
//         const commission = Number.parseFloat(record.driver_percentage) || 0;
//         const totalCost = fuel + gas + others + demarage + commission;

//         return <div>৳ {totalCost.toFixed(2)}</div>;
//       },
//     },
//     {
//       title: "Trip Fare",
//       dataIndex: "trip_price",
//       key: "trip_price",
//       width: 130,
//       render: (price) => <div>৳ {price}</div>,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       className: "action_column",
//       width: 130,
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Edit">
//             <Link to={`/tramessy/update-tripForm/${record.id}`}>
//               <EditOutlined
//                 className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary"
//               />
//             </Link>
//           </Tooltip>

//           <Tooltip title="View">
//             <EyeOutlined
//               className="bg-white rounded shadow-md p-1 cursor-pointer text-lg hover:bg-primary hover:!text-white transition-all duration-300"
//               onClick={() => handleView(record.id)}
//             />
//           </Tooltip>

//           <Tooltip title="Delete">
//             <RiDeleteBinLine
//               className="!text-red-500 p-1 text-white cursor-pointer text-2xl rounded"
//               onClick={() => {
//                 setSelectedTripId(record.id);
//                 setDeleteModalOpen(true);
//               }}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div style={{ padding: "10px", minHeight: "100vh" }}>
//         <Card
//           className=""
//           style={{
//             boxShadow: "0 8px 32px rgba(48, 47, 47, 0.1)",
//             background: "rgba(255,255,255,0.9)",
//             backdropFilter: "blur(10px)",
//           }}
//         >
//           <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
//             <Col>
//               <Title level={4} style={{ margin: 0, color: "#11375B" }}>
//                 <TruckOutlined style={{ marginRight: "12px", color: "#11375B" }} />
//                 Trip Records
//               </Title>
//             </Col>
//             <Col className="mt-3 md:mt-0">
//               <Space>
//                 <Link to={"/tramessy/add-tripForm"}>
//                   <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     style={{ background: "#11375B", borderColor: "#11375B" }}
//                   >
//                     Add Trip
//                   </Button>
//                 </Link>
//                 <Button
//                   icon={<FilterOutlined />}
//                   onClick={() => setShowFilter(!showFilter)}
//                   className={`border border-[#11375b] px-4 py-1 rounded 
//                     ${showFilter ? "bg-[#11375b] text-white" : "bg-transparent text-[#11375b]"}`}
//                 >
//                   Filter
//                 </Button>
//               </Space>
//             </Col>
//           </Row>

//           {showFilter && (
//             <Card style={{ marginBottom: "16px" }}>
//               <Row gutter={16} align="middle">
//                 <Col sm={10} lg={20}>
//                   <RangePicker
//                     style={{ width: "100%" }}
//                     onChange={(dates) => setDateRange(dates)}
//                     placeholder={["Start Date", "End Date"]}
//                   />
//                 </Col>
//                 <Col span={4}>
//                   <Button
//                     type="primary"
//                     icon={<FilterOutlined />}
//                     style={{ background: "#11375B", borderColor: "#11375B" }}
//                   >
//                     Filter
//                   </Button>
//                 </Col>
//               </Row>
//             </Card>
//           )}

//           <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }} gutter={[16, 16]}>
//             <Col>
//               <Space wrap>
//                 <Button
//                   icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
//                   className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
//                   onClick={exportCSV}
//                 >
//                   CSV
//                 </Button>

//                 <Button
//                   icon={<FileExcelOutlined style={{ color: "#52c41a" }} />}
//                   onClick={exportExcel}
//                   className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary"
//                 >
//                   Excel
//                 </Button>

//                 <Button
//                   icon={<FilePdfOutlined style={{ color: "#f5222d" }} />}
//                   onClick={exportPDF}
//                   className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary"
//                 >
//                   PDF
//                 </Button>

//                 <Button
//                   icon={<PrinterOutlined style={{ color: "#722ed1" }} />}
//                   onClick={printTripTable}
//                   className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
//                 >
//                   Print
//                 </Button>
//               </Space>
//             </Col>

//             <Col>
//               <Search
//                 placeholder="Search..."
//                 allowClear
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 enterButton={
//                   <Button
//                     style={{
//                       backgroundColor: "#11375B",
//                       color: "#fff",
//                       borderColor: "#11375B",
//                     }}
//                   >
//                     <SearchOutlined className="!text-white" />
//                   </Button>
//                 }
//               />
//             </Col>
//           </Row>

//           <Table
//             columns={columns}
//             dataSource={filteredTrip}
//             loading={loading}
//             size="middle"
//             rowKey="id"
//             scroll={{ x: "max-content" }}
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               showSizeChanger: true,
//               pageSizeOptions: ["10", "20", "50", "100"],
//               onChange: (page, pageSize) => {
//                 setPagination({ current: page, pageSize });
//               },
//               onShowSizeChange: (current, size) => {
//                 setPagination({ current: 1, pageSize: size });
//               },
//             }}
//             summary={() => {
//               const totalCost = filteredTrip.reduce((sum, trip) => {
//                 const fuel = Number.parseFloat(trip.fuel_price) || 0;
//                 const gas = Number.parseFloat(trip.gas_price) || 0;
//                 const others = Number.parseFloat(trip.other_expenses) || 0;
//                 const demarage = Number.parseFloat(trip.demarage) || 0;
//                 const commission = Number.parseFloat(trip.driver_percentage) || 0;
//                 return sum + fuel + gas + others + demarage + commission;
//               }, 0);

//               const totalRevenue = filteredTrip.reduce(
//                 (sum, trip) => sum + (Number(trip.trip_price) || 0),
//                 0
//               );

//               return (
//                 <Table.Summary fixed>
//                   <Table.Summary.Row className="bg-blue-50">
//                     <Table.Summary.Cell index={0} />
//                     <Table.Summary.Cell index={1}>
//                       <Text strong style={{ color: "#11375b", whiteSpace: "nowrap" }}>
//                         Total
//                       </Text>
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell index={2} />
//                     <Table.Summary.Cell index={3} />

//                     <Table.Summary.Cell index={5}>
//                       <Text strong style={{ color: "#11375b", whiteSpace: "nowrap" }}>
//                         ৳ {totalCost.toFixed(2)}
//                       </Text>
//                     </Table.Summary.Cell>

//                     <Table.Summary.Cell index={6}>
//                       <Text strong style={{ color: "#11375b", whiteSpace: "nowrap" }}>
//                         ৳ {totalRevenue.toFixed(2)}
//                       </Text>
//                     </Table.Summary.Cell>

//                     <Table.Summary.Cell index={7} className="summary_action_cell" />
//                   </Table.Summary.Row>
//                 </Table.Summary>
//               );
//             }}
//           />

//           <Modal
//             title={
//               <Space>
//                 <DeleteOutlined style={{ color: "#ff4d4f" }} />
//                 Delete Trip
//               </Space>
//             }
//             open={deleteModalOpen}
//             onOk={handleDelete}
//             onCancel={() => {
//               setDeleteModalOpen(false);
//               setSelectedTripId(null);
//             }}
//             okText="Yes"
//             cancelText="No"
//             okButtonProps={{ danger: true }}
//           >
//             <p>Are you sure you want to delete this trip?</p>
//           </Modal>

//           <Modal
//             title={
//               <Space>
//                 <EyeOutlined style={{ color: "#1890ff" }} />
//                 Trip Details
//               </Space>
//             }
//             open={viewModalOpen}
//             onCancel={() => {
//               setViewModalOpen(false);
//               setSelectedTrip(null);
//             }}
//             footer={[
//               <Button key="close" onClick={() => setViewModalOpen(false)}>
//                 Close
//               </Button>,
//             ]}
//             width={800}
//           >
//             {selectedTrip && (
//               <div>
//                 <Row gutter={[16, 16]}>
//                   <Col span={12}>
//                     <Card size="small" title="Trip Information">
//                       <p>
//                         <strong>Trip Time:</strong> {selectedTrip.trip_time}
//                       </p>
//                       <p>
//                         <strong>Trip Date:</strong> {selectedTrip.trip_date}
//                       </p>
//                       <p>
//                         <strong>Load Point:</strong> {selectedTrip.load_point}
//                       </p>
//                       <p>
//                         <strong>Unload Point:</strong> {selectedTrip.unload_point}
//                       </p>
//                     </Card>
//                   </Col>
//                   <Col span={12}>
//                     <Card size="small" title="Driver Information">
//                       <p>
//                         <strong>Driver Name:</strong> {selectedTrip.driver_name}
//                       </p>
//                       <p>
//                         <strong>Driver Mobile:</strong> {selectedTrip.driver_contact}
//                       </p>
//                       <p>
//                         <strong>Driver Commission:</strong> {selectedTrip.driver_percentage}
//                       </p>
//                       <p>
//                         <strong>Vehicle Number:</strong> {selectedTrip.vehicle_number}
//                       </p>
//                     </Card>
//                   </Col>
//                   <Col span={12}>
//                     <Card size="small" title="Cost Information">
//                       <p>
//                         <strong>Fuel Cost:</strong> {selectedTrip.fuel_price}
//                       </p>
//                       <p>
//                         <strong>Gas Cost:</strong> {selectedTrip.gas_price}
//                       </p>
//                       <p>
//                         <strong>Other Expenses:</strong> {selectedTrip.other_expenses}
//                       </p>
//                       <p>
//                         <strong>Demurrage:</strong> {selectedTrip.demarage}
//                       </p>
//                     </Card>
//                   </Col>
//                   <Col span={12}>
//                     <Card size="small" title="Customer Information">
//                       <p>
//                         <strong>Customer Name:</strong> {selectedTrip.customer}
//                       </p>
//                       <p>
//                         <strong>Customer Mobile:</strong> {selectedTrip.customer_mobile}
//                       </p>
//                       <p>
//                         <strong>Trip Fare:</strong> {selectedTrip.trip_price}
//                       </p>
//                     </Card>
//                   </Col>
//                 </Row>
//                 <Divider />
//                 <Row gutter={16}>
//                   <Col span={8}>
//                     <Statistic
//                       title="Total Cost"
//                       value={
//                         (Number(selectedTrip.fuel_price) || 0) +
//                         (Number(selectedTrip.gas_price) || 0) +
//                         (Number(selectedTrip.other_expenses) || 0) +
//                         (Number(selectedTrip.demarage) || 0) +
//                         (Number(selectedTrip.driver_percentage) || 0)
//                       }
//                       precision={2}
//                       valueStyle={{ color: "#cf1322" }}
//                     />
//                   </Col>
//                   <Col span={8}>
//                     <Statistic
//                       title="Trip Fare"
//                       value={selectedTrip.trip_price}
//                       precision={2}
//                       valueStyle={{ color: "#1890ff" }}
//                     />
//                   </Col>
//                   <Col span={8}>
//                     <Statistic
//                       title="Profit"
//                       value={
//                         (selectedTrip.trip_price || 0) -
//                         ((Number(selectedTrip.fuel_price) || 0) +
//                           (Number(selectedTrip.gas_price) || 0) +
//                           (Number(selectedTrip.other_expenses) || 0) +
//                           (Number(selectedTrip.demarage) || 0) +
//                           (Number(selectedTrip.driver_percentage) || 0))
//                       }
//                       precision={2}
//                       valueStyle={{ color: "#3f8600" }}
//                     />
//                   </Col>
//                 </Row>
//               </div>
//             )}
//           </Modal>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default TripList;

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Card,
  Space,
  Typography,
  Tooltip,
  Row,
  Col,
  Descriptions,
  Tag,
  message,
} from "antd";
import {
  TruckOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import moment from "moment";
import api from "../utils/axiosConfig";
import { CSVLink } from "react-csv";

const { Title, Text } = Typography;
const { Search } = Input;

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get(`/api/trip`);
      setTrips(response.data);
    } catch (error) {
      message.error("Failed to load trip data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/trip/${selectedTripId}`);
      setTrips((prev) => prev.filter((t) => t.id !== selectedTripId));
      message.success("Trip deleted successfully.");
      setDeleteModalOpen(false);
      setSelectedTripId(null);
    } catch {
      message.error("Failed to delete the trip.");
    }
  };

  const handleViewTrip = async (id) => {
    try {
      const response = await api.get(`/api/trip/${id}`);
      setSelectedTrip(response.data);
      setViewModalOpen(true);
    } catch {
      message.error("Could not fetch trip details.");
    }
  };

  const headers = [
    { label: "#", key: "index" },
    { label: "Date", key: "date" },
    { label: "Load Point", key: "load_point" },
    { label: "Unload Point", key: "unload_point" },
    { label: "Vehicle No", key: "vehicle_no" },
    { label: "Driver", key: "driver_name" },
    { label: "Customer", key: "customer_name" },
    { label: "Rent Amount", key: "Rent_amount" },
    { label: "Status", key: "status" },
  ];

  const csvData = trips.map((t, i) => ({
    index: i + 1,
    date: t.date,
    load_point: t.load_point,
    unload_point: t.unload_point,
    vehicle_no: t.vehicle_no,
    driver_name: t.driver_name,
    customer_name: t.customer_name,
    Rent_amount: t.Rent_amount,
    status: t.status,
  }));

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trips Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "trips_data.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["#", "Date", "Load Point", "Unload Point", "Vehicle", "Driver", "Customer", "Amount", "Status"]],
      body: trips.map((t, i) => [
        i + 1,
        t.date,
        t.load_point,
        t.unload_point,
        t.vehicle_no,
        t.driver_name,
        t.customer_name,
        t.Rent_amount,
        t.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: "#11375B" },
    });
    doc.save("trips_data.pdf");
  };

  const filteredTrips = trips.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.date?.toLowerCase().includes(term) ||
      t.load_point?.toLowerCase().includes(term) ||
      t.unload_point?.toLowerCase().includes(term) ||
      t.vehicle_no?.toLowerCase().includes(term) ||
      t.driver_name?.toLowerCase().includes(term) ||
      t.customer_name?.toLowerCase().includes(term) ||
      t.Rent_amount?.toString().includes(term) ||
      t.status?.toLowerCase().includes(term)
    );
  });

  const printTripTable = () => {
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

    setTimeout(() => {
      actionColumns.forEach((col) => {
        col.style.display = "";
      });
    }, 1000);
  };

  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format("DD-MM-YYYY") : "N/A";
  };

  const columns = [
    { title: "SL", render: (_, __, i) => i + 1, width: 50 },
    { title: "Date", dataIndex: "date", render: formatDate },
    { title: "Load Point", dataIndex: "load_point" },
    { title: "Unload Point", dataIndex: "unload_point" },
    { title: "Vehicle No", dataIndex: "vehicle_no" },
    { title: "Driver", dataIndex: "driver_name" },
    {
      title: "Rent Amount",
      dataIndex: "Rent_amount",
      render: (amount) => `৳${amount}`
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      className: "action_column",
      render: (_, record) => (
        <Space>
          <Tooltip title="Update">
            <Link to={`/tramessy/update-trip/${record.id}`}>
              <EditOutlined className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary" />
            </Link>
          </Tooltip>
          <Tooltip title="View">
            <EyeOutlined
              className="bg-white shadow-md rounded p-1 cursor-pointer text-lg hover:bg-primary hover:!text-white transition-all duration-300"
              onClick={() => handleViewTrip(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBinLine
              className="!text-red-500 p-1 cursor-pointer text-2xl rounded"
              onClick={() => {
                setSelectedTripId(record.id);
                setDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-hidden mx-auto">
      <div style={{ padding: "10px", minHeight: "100vh" }}>
        <Card className="rounded-lg">
          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <Title level={4} style={{ color: "#11375B" }}>
                <TruckOutlined style={{ marginRight: 8 }} /> Trip List
              </Title>
            </Col>
            <Col>
              <Link to="/tramessy/add-trip">
                <Button icon={<PlusOutlined />} type="primary" className="!bg-primary">
                  Add Trip
                </Button>
              </Link>
            </Col>
          </Row>

          <Row justify="space-between" align="middle" style={{ marginBottom: 16 }} gutter={[16, 16]}>
            <Col>
              <Space wrap>
                <CSVLink data={csvData} headers={headers} filename="trips_data.csv">
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
                <Button icon={<PrinterOutlined style={{ color: "#722ed1" }} />} onClick={printTripTable} className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary">
                  Print
                </Button>
              </Space>
            </Col>
            <Col>
              <Search
                placeholder="Search Trip..."
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
                    <SearchOutlined className="!text-white" />
                  </Button>
                }
              />
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredTrips}
            rowKey="id"
            size="middle"
            loading={loading}
            pagination={pagination}
            onChange={(pg) => setPagination(pg)}
            scroll={{ x: 'max-content' }}
          />

          <Modal
            title="Delete Trip"
            open={deleteModalOpen}
            onOk={handleDelete}
            onCancel={() => setDeleteModalOpen(false)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            Are you sure you want to delete this trip?
          </Modal>

          <Modal
            title="Trip Details"
            open={viewModalOpen}
            onCancel={() => setViewModalOpen(false)}
            footer={false}
            width={700}
            style={{ top: 20 }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            {selectedTrip && (
              <Descriptions 
                bordered 
                column={2} 
                size="small"
                layout="vertical"
                className="compact-view"
              >
                <Descriptions.Item label="Date">{formatDate(selectedTrip.date)}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={selectedTrip.status === "completed" ? "green" : "orange"}>
                    {selectedTrip.status?.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Load Point">{selectedTrip.load_point || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Unload Point">{selectedTrip.unload_point || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Vehicle No">{selectedTrip.vehicle_no || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Driver">{selectedTrip.driver_name || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Customer">{selectedTrip.customer_name || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Customer Mobile">{selectedTrip.customer_mobile || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Rent Amount">৳{selectedTrip.Rent_amount || "0"}</Descriptions.Item>
                <Descriptions.Item label="Advanced">৳{selectedTrip.advanced || "0"}</Descriptions.Item>
                <Descriptions.Item label="Fuel Cost">৳{selectedTrip.fuel_cost || "0"}</Descriptions.Item>
                <Descriptions.Item label="Toll Cost">৳{selectedTrip.toll_cost || "0"}</Descriptions.Item>
                <Descriptions.Item label="Police Cost">৳{selectedTrip.police_cost || "0"}</Descriptions.Item>
                <Descriptions.Item label="Commission">৳{selectedTrip.commision || "0"}</Descriptions.Item>
                <Descriptions.Item label="Labour">৳{selectedTrip.labour || "0"}</Descriptions.Item>
                <Descriptions.Item label="Other Costs">৳{selectedTrip.others || "0"}</Descriptions.Item>
                <Descriptions.Item label="Total Expenses">৳{selectedTrip.total_exp || "0"}</Descriptions.Item>
                <Descriptions.Item label="Demrage Days">{selectedTrip.demrage_day || "0"}</Descriptions.Item>
                <Descriptions.Item label="Demrage Rate">৳{selectedTrip.demrage_rate || "0"}</Descriptions.Item>
                <Descriptions.Item label="Total Demrage">৳{selectedTrip.demrage_total || "0"}</Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default TripList;