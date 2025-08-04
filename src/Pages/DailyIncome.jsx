

// import { useEffect, useState, useRef } from "react"
// import {
//   Table,
//   Button,
//   Input,
//   Card,
//   Space,
//   Typography,
//   Row,
//   Col,
//   Tooltip,
//   DatePicker,
//   message,
//   Statistic,
//   Divider,
// } from "antd"
// import {
//   TruckOutlined,
//   EditOutlined,
//   FilterOutlined,
//   SearchOutlined,
//   FileTextOutlined,
//   FileExcelOutlined,
//   FilePdfOutlined,
//   PrinterOutlined,
//   CalendarOutlined,
//   DollarOutlined,
//   RiseOutlined,
// } from "@ant-design/icons"
// import axios from "axios"
// import { Link } from "react-router-dom"
// import * as XLSX from "xlsx"
// import { saveAs } from "file-saver"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

// const { Title, Text } = Typography
// const { Search } = Input
// const { RangePicker } = DatePicker

// const DailyIncome = () => {
//   const [trips, setTrips] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showFilter, setShowFilter] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [dateRange, setDateRange] = useState([])
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   })

//   const printRef = useRef()

//   useEffect(() => {
//     fetchTrips()
//   }, [])

//   const fetchTrips = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip`)
//       const sorted = response.data.data.sort((a, b) => new Date(b.trip_date) - new Date(a.trip_date))
//       setTrips(sorted)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching trips:", error)
//       // message.error("ট্রিপ ডেটা লোড করতে সমস্যা হয়েছে")
//       setLoading(false)
//     }
//   }

//   // Export functionality
//   const csvData = trips.map((dt, index) => {
//     const fuel = Number.parseFloat(dt.fuel_price ?? "0") || 0
//     const gas = Number.parseFloat(dt.gas_price ?? "0") || 0
//     const others = Number.parseFloat(dt.other_expenses ?? "0") || 0
//     const commission = Number.parseFloat(dt.driver_percentage ?? "0") || 0
//     const totalCost = (fuel + gas + others + commission).toFixed(2)
//     const profit = (Number.parseFloat(dt.trip_price ?? "0") - Number.parseFloat(totalCost)).toFixed(2)

//     return {
//       index: index + 1,
//       trip_date: new Date(dt.trip_date).toLocaleDateString("en-GB"),
//       vehicle_number: dt.vehicle_number,
//       load_point: dt.load_point,
//       unload_point: dt.unload_point,
//       trip_price: dt.trip_price,
//       totalCost,
//       profit,
//     }
//   })

//   const exportCSV = () => {
//     const csvContent = [
//       ["#", "তারিখ", "গাড়ি", "লোড", "আনলোড", "ট্রিপের ভাড়া", "চলমানখরচ", "লাভ"],
//       ...csvData.map((item) => [
//         item.index,
//         item.trip_date,
//         item.vehicle_number,
//         item.load_point,
//         item.unload_point,
//         item.trip_price,
//         item.totalCost,
//         item.profit,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n")

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     saveAs(blob, "daily_income_data.csv")
//   }

//   const exportExcel = () => {
//     const headers = ["#", "তারিখ", "গাড়ি", "লোড", "আনলোড", "ট্রিপের ভাড়া", "চলমানখরচ", "লাভ"]

//     const formattedData = csvData.map((item) => ({
//       "#": item.index,
//       তারিখ: item.trip_date,
//       গাড়ি: item.vehicle_number,
//       লোড: item.load_point,
//       আনলোড: item.unload_point,
//       "ট্রিপের ভাড়া": item.trip_price,
//       চলমানখরচ: item.totalCost,
//       লাভ: item.profit,
//     }))

//     const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers })
//     const workbook = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Income Data")
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" })
//     saveAs(data, "daily_income_data.xlsx")
//   }

//   const exportPDF = () => {
//     const doc = new jsPDF()
//     const tableColumn = ["#", "Date", "Car", "Load", "Unload", "Trip Price", "Total Cost", "Profit"]

//     const tableRows = csvData.map((item) => [
//       item.index,
//       item.trip_date,
//       item.vehicle_number,
//       item.load_point,
//       item.unload_point,
//       item.trip_price,
//       item.totalCost,
//       item.profit,
//     ])

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       styles: { font: "helvetica", fontSize: 8 },
//     })

//     doc.save("daily_income_data.pdf")
//   }

//   // Print function
//   const printTable = () => {
//     const printContent = printRef.current.innerHTML
//     const WinPrint = window.open("", "", "width=900,height=650")
//     WinPrint.document.write(`
//       <html>
//         <head>
//           <title>Print</title>
//           <style>
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #000; padding: 8px; text-align: center; }
//             .ant-btn { display: none; }
//           </style>
//         </head>
//         <body>${printContent}</body>
//       </html>
//     `)
//     WinPrint.document.close()
//     WinPrint.focus()
//     WinPrint.print()
//     WinPrint.close()
//   }

//   // Filter trips data
//   const filteredTrips = trips.filter((dt) => {
//     const term = searchTerm.toLowerCase()

//     const matchesSearch =
//       dt.trip_date?.toLowerCase().includes(term) ||
//       dt.trip_time?.toLowerCase().includes(term) ||
//       dt.load_point?.toLowerCase().includes(term) ||
//       dt.unload_point?.toLowerCase().includes(term) ||
//       dt.driver_name?.toLowerCase().includes(term) ||
//       dt.driver_contact?.toLowerCase().includes(term) ||
//       String(dt.driver_percentage).includes(term) ||
//       dt.fuel_price?.toLowerCase().includes(term) ||
//       dt.gas_price?.toLowerCase().includes(term) ||
//       dt.vehicle_number?.toLowerCase().includes(term) ||
//       dt.other_expenses?.toLowerCase().includes(term) ||
//       dt.trip_price?.toLowerCase().includes(term)

//     // Simple date filtering
//     let matchesDateRange = true
//     if (dateRange.length === 2) {
//       const tripDate = new Date(dt.trip_date)
//       const startDate = new Date(dateRange[0])
//       const endDate = new Date(dateRange[1])
//       matchesDateRange = tripDate >= startDate && tripDate <= endDate
//     }

//     return matchesSearch && matchesDateRange
//   })

//   // Calculate totals
//   const totalTrips = filteredTrips.length
//   const totalRevenue = filteredTrips.reduce((sum, trip) => sum + Number(trip.trip_price || 0), 0)
//   const totalCost = filteredTrips.reduce((sum, trip) => {
//     const fuel = Number(trip.fuel_price || 0)
//     const gas = Number(trip.gas_price || 0)
//     const others = Number(trip.other_expenses || 0)
//     const commission = Number(trip.driver_percentage || 0)
//     return sum + fuel + gas + others + commission
//   }, 0)
//   const totalProfit = totalRevenue - totalCost
//   const averageProfit = totalTrips > 0 ? totalProfit / totalTrips : 0

//   // Table columns
//   const columns = [
//     {
//       title: "SL",
//       key: "index",
//       width: 50,
//       render: (_, __, index) => (
//         <Text strong style={{ color: "#11375b" }}>
//           {(pagination.current - 1) * pagination.pageSize + index + 1}
//         </Text>
//       ),
//     },
//     {
//       title: "তারিখ",
//       dataIndex: "trip_date",
//       key: "trip_date",
//       // width: 120,
//       render: (date) => (
//         <Space>
//           <Text>{new Date(date).toLocaleDateString("en-GB")}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "গাড়ি",
//       dataIndex: "vehicle_number",
//       key: "vehicle_number",
//       // width: 100,
//       render: (vehicle) => (
//         <Space>
//           <Text strong>{vehicle}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "লোড",
//       dataIndex: "load_point",
//       key: "load_point",
//       // width: 150,
//       ellipsis: {
//         showTitle: false,
//       },
//       render: (load) => (
//         <Tooltip placement="topLeft" title={load}>
//           {load}
//         </Tooltip>
//       ),
//     },
//     {
//       title: "আনলোড",
//       dataIndex: "unload_point",
//       key: "unload_point",
//       // width: 130,
//       ellipsis: {
//         showTitle: false,
//       },
//       render: (unload) => (
//         <Tooltip placement="topLeft" title={unload}>
//           {unload}
//         </Tooltip>
//       ),
//     },
//     {
//       title: "ট্রিপের ভাড়া",
//       dataIndex: "trip_price",
//       key: "trip_price",
//       // width: 120,
//       render: (price) => (
//         <Space>
//           <Text strong> {price}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "চলমানখরচ",
//       key: "total_cost",
//       // width: 120,
//       render: (_, record) => {
//         const totalCost = (
//           parseFloat(record.other_expenses || 0) +
//           parseFloat(record.gas_price || 0) +
//           parseFloat(record.fuel_price || 0) +
//           parseFloat(record.driver_percentage || 0)
//         ).toFixed(2)
//          const finalCost = isNaN(totalCost) ? 0 : totalCost;
//         return (
//           <Space>
//             <Text> {finalCost || 0} </Text>
//           </Space>
//         )
//       },
//     },
//     {
//       title: "লাভ",
//       key: "profit",
//       // width: 120,
//       render: (_, record) => {
//         const totalCost =
//           parseFloat(record.other_expenses || 0) +
//           parseFloat(record.gas_price || 0) +
//           parseFloat(record.fuel_price || 0) +
//           parseFloat(record.driver_percentage || 0)
//         const profit = parseFloat(record.trip_price || 0) - totalCost
//          const finalProfit = isNaN(profit) ? 0 : profit;
//         return (
//           <Space>
//             <Text strong style={{ color: profit >= 0 ? "" : "#ff4d4f" }}>
//               {finalProfit.toFixed(2)}
//             </Text>
//           </Space>
//         )
//       },
//     },
//     // {
//     //   title: "অ্যাকশন",
//     //   key: "actions",
//     //   width: 50,
//     //   render: (_, record) => (
//     //     <Tooltip title="সম্পাদনা">
//     //                 <Link to={`/tramessy/update-dailyIncomeForm/${record.id}`}>
//     //                     <EditOutlined
//     //                       className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary"
//     //                     />
//     //                     </Link>
//     //                   </Tooltip>
//     //   ),
//     // },
//   ]

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
//               <TruckOutlined style={{ marginRight: "12px", color: "#11375B" }} />
//               আয়ের তালিকা
//             </Title>
//           </Col>
//           <Col>
//              <Button
//   icon={<FilterOutlined />}
//   onClick={() => setShowFilter(!showFilter)}
//   className={`border border-[#11375b] px-4 py-1 rounded 
//     ${showFilter ? "bg-[#11375b] text-white" : "bg-transparent text-[#11375b]"}`}
// >
//   ফিল্টার
//               </Button>
//           </Col>
//         </Row>

//         {/* Filter Section */}
//         {showFilter && (
//           <Card style={{ marginBottom: "16px" }}>
//             <Row gutter={16} align="middle">
//               <Col sm={10} lg={20}>
//                 <RangePicker
//                   style={{ width: "100%" }}
//                   onChange={(dates) => setDateRange(dates ?? [])}
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
//             <Space wrap>
//               {/* CSV */}
//               <Button
//                 icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
//                 onClick={exportCSV}
//                 className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
//               >
//                 CSV
//               </Button>
//               {/* Excel */}
//               <Button
//                 icon={<FileExcelOutlined style={{ color: "#52c41a" }} />}
//                 onClick={exportExcel}
//                 className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary"
//               >
//                 Excel
//               </Button>
//               {/* PDF */}
//               <Button
//                 icon={<FilePdfOutlined style={{ color: "#f5222d" }} />}
//                 onClick={exportPDF}
//                 className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary"
//               >
//                 PDF
//               </Button>
//               {/* Print */}
//               <Button
//                 icon={<PrinterOutlined style={{ color: "#722ed1" }} />}
//                 onClick={printTable}
//                 className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
//               >
//                 Print
//               </Button>
//             </Space>
//           </Col>

//           {/* Search */}
//           <Col>
//             <Search
//               placeholder="আয় খুঁজুন...."
//               allowClear
//               onChange={(e) => setSearchTerm(e.target.value)}
//               enterButton={
//                 <Button
//                   className="!bg-primary !border-primary"
//                   style={{
//                     backgroundColor: "#11375B"
//                   }}
//                 >
//                   <SearchOutlined className="!text-white"/>
//                 </Button>
//               }
//             />
//           </Col>
//         </Row>

//         {/* Table */}
//         <div ref={printRef}>
//           <Table
//             columns={columns}
//             dataSource={filteredTrips}
//             loading={loading}
//             rowKey="id"
//             scroll={{ x: "max-content" }}
//             size="middle"
//             pagination={{
//               current: pagination.current,
//               pageSize: pagination.pageSize,
//               showSizeChanger: true,
//               pageSizeOptions: ["10", "20", "50", "100"],
//               onChange: (page, pageSize) => {
//                 setPagination({ current: page, pageSize })
//               },
//               onShowSizeChange: (current, size) => {
//                 setPagination({ current: 1, pageSize: size })
//               },
//             }}
//             summary={(pageData) => {
//               let totalPageRevenue = 0
//               let totalPageCost = 0

//               pageData.forEach((trip) => {
//                 totalPageRevenue += Number(trip.trip_price || 0)
//                 const cost =
//                   Number(trip.other_expenses || 0) +
//                   Number(trip.gas_price || 0) +
//                   Number(trip.fuel_price || 0) +
//                   Number(trip.driver_percentage || 0)
//                 totalPageCost += cost
//               })

//               const totalPageProfit = totalPageRevenue - totalPageCost
//  const finalTotalPageProfit = isNaN(totalPageProfit) ? 0 : totalPageProfit;
//               return (
//                 <Table.Summary fixed>
//                   <Table.Summary.Row style={{ backgroundColor: "#e6f7ff" }}>
//                     <Table.Summary.Cell index={0} colSpan={5}>
//                       <Text strong style={{ color: "#11375B" }}>
//                        Total
//                       </Text>
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell index={1}>
//                       <Text strong style={{ color: "#11375B" }}>
//                         ৳ {totalPageRevenue.toFixed(2)}
//                       </Text>
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell index={2}>
//                       <Text strong style={{ color: "#11375B" }}>
//                         ৳ {totalPageCost.toFixed(2)}
//                       </Text>
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell index={3}>
//                       <Text strong style={{ color: totalPageProfit >= 0 ? "#11375B" : "#ff4d4f" }}>
//                         ৳ {finalTotalPageProfit.toFixed(2)}
//                       </Text>
//                     </Table.Summary.Cell>
//                     <Table.Summary.Cell />
//                   </Table.Summary.Row>
//                 </Table.Summary>
//               )
//             }}
//           />
//         </div>

//         {/* Additional Summary */}
//         {/* <Divider />
//         <Row gutter={[16, 16]} justify="center">
//           <Col xs={24} sm={8}>
//             <div style={{ textAlign: "center" }}>
//               <Text style={{ color: "#666", fontSize: "14px" }}>গড় ট্রিপ আয়</Text>
//               <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>
//                 ৳ {totalTrips > 0 ? (totalRevenue / totalTrips).toFixed(2) : 0}
//               </div>
//             </div>
//           </Col>
//           <Col xs={24} sm={8}>
//             <div style={{ textAlign: "center" }}>
//               <Text style={{ color: "#666", fontSize: "14px" }}>গড় ট্রিপ খরচ</Text>
//               <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>
//                 ৳ {totalTrips > 0 ? (totalCost / totalTrips).toFixed(2) : 0}
//               </div>
//             </div>
//           </Col>
//           <Col xs={24} sm={8}>
//             <div style={{ textAlign: "center" }}>
//               <Text style={{ color: "#666", fontSize: "14px" }}>লাভের হার</Text>
//               <div
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   color: totalProfit >= 0 ? "#52c41a" : "#ff4d4f",
//                 }}
//               >
//                 {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
//               </div>
//             </div>
//           </Col>
//         </Row> */}
//       </Card>
//     </div>
//   )
// }

// export default DailyIncome



import { useEffect, useState, useRef } from "react"
import { Table, Button, Input, Card, Space, Typography, Row, Col, Tooltip, DatePicker, message, Divider } from "antd"
import {
  TruckOutlined,
  EditOutlined,
  FilterOutlined,
  SearchOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import dayjs from "dayjs" // Using dayjs for date handling
import api from "../utils/axiosConfig" // Assuming api is imported from a separate file

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

const DailyIncome = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const printRef = useRef()

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await api.get(`/api/trip`) // Using api instance
      // Sort by date in descending order
      const sorted = response.data.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
      setTrips(sorted)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching trips:", error)
      message.error("Failed to load trip data.")
      setLoading(false)
    }
  }

  // Export functionality - using total_exp directly from backend
  const getExportData = (data) => {
    return data.map((dt, index) => {
      const totalExpenses = Number.parseFloat(dt.total_exp || "0") || 0
      const rentAmount = Number.parseFloat(dt.Rent_amount || "0") || 0
      const profit = (rentAmount - totalExpenses).toFixed(2)
      return {
        index: index + 1,
        date: dayjs(dt.date).format("YYYY-MM-DD"),
        load_point: dt.load_point,
        unload_point: dt.unload_point,
        vehicle_no: dt.vehicle_no,
        driver_name: dt.driver_name,
        Rent_amount: rentAmount,
        total_exp: totalExpenses,
        profit: profit,
        // Include all other fields for comprehensive export, even if not in table display
        fuel_cost: dt.fuel_cost,
        toll_cost: dt.toll_cost,
        police_cost: dt.police_cost,
        commision: dt.commision,
        labour: dt.labour,
        others: dt.others,
        demrage_day: dt.demrage_day,
        demrage_rate: dt.demrage_rate,
        demrage_total: dt.demrage_total,
        customer_name: dt.customer_name,
        customer_mobile: dt.customer_mobile,
        advanced: dt.advanced,
        status: dt.status,
      }
    })
  }

  const exportCSV = () => {
    const headers = [
      "#",
      "Date",
      "Load Point",
      "Unload Point",
      "Vehicle No",
      "Driver Name",
      "Rent Amount",
      "Total Expenses",
      "Profit",
      // Include all other fields for comprehensive export
      "Fuel Cost",
      "Toll Cost",
      "Police Cost",
      "Commission",
      "Labour",
      "Others",
      "Demurrage Day",
      "Demurrage Rate",
      "Demurrage Total",
      "Customer Name",
      "Customer Mobile",
      "Advanced",
      "Status",
    ]
    const csvData = getExportData(filteredTrips).map((item) => [
      item.index,
      item.date,
      item.load_point,
      item.unload_point,
      item.vehicle_no,
      item.driver_name,
      item.Rent_amount,
      item.total_exp,
      item.profit,
      // All other fields
      item.fuel_cost,
      item.toll_cost,
      item.police_cost,
      item.commision,
      item.labour,
      item.others,
      item.demrage_day,
      item.demrage_rate,
      item.demrage_total,
      item.customer_name,
      item.customer_mobile,
      item.advanced,
      item.status,
    ])
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "daily_income_data.csv")
  }

  const exportExcel = () => {
    const headers = [
      "#",
      "Date",
      "Load Point",
      "Unload Point",
      "Vehicle No",
      "Driver Name",
      "Rent Amount",
      "Total Expenses",
      "Profit",
      // Include all other fields for comprehensive export
      "Fuel Cost",
      "Toll Cost",
      "Police Cost",
      "Commission",
      "Labour",
      "Others",
      "Demurrage Day",
      "Demurrage Rate",
      "Demurrage Total",
      "Customer Name",
      "Customer Mobile",
      "Advanced",
      "Status",
    ]
    const formattedData = getExportData(filteredTrips).map((item) => ({
      "#": item.index,
      Date: item.date,
      "Load Point": item.load_point,
      "Unload Point": item.unload_point,
      "Vehicle No": item.vehicle_no,
      "Driver Name": item.driver_name,
      "Rent Amount": item.Rent_amount,
      "Total Expenses": item.total_exp,
      Profit: item.profit,
      // All other fields
      "Fuel Cost": item.fuel_cost,
      "Toll Cost": item.toll_cost,
      "Police Cost": item.police_cost,
      Commission: item.commision,
      Labour: item.labour,
      Others: item.others,
      "Demurrage Day": item.demrage_day,
      "Demurrage Rate": item.demrage_rate,
      "Demurrage Total": item.demrage_total,
      "Customer Name": item.customer_name,
      "Customer Mobile": item.customer_mobile,
      Advanced: item.advanced,
      Status: item.status,
    }))
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Income Data")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(data, "daily_income_data.xlsx")
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    const tableColumn = ["#", "Date", "Load", "Unload", "Vehicle", "Driver", "Rent", "Total Exp.", "Profit"] // Only main columns for PDF
    const tableRows = getExportData(filteredTrips).map((item) => [
      item.index,
      item.date,
      item.load_point,
      item.unload_point,
      item.vehicle_no,
      item.driver_name,
      item.Rent_amount,
      item.total_exp,
      item.profit,
    ])
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { font: "helvetica", fontSize: 8 },
      headStyles: { fillColor: "#11375B" },
    })
    doc.save("daily_income_data.pdf")
  }

  // Print function
  const printTable = () => {
    const actionColumns = document.querySelectorAll(".action_column")
    const paginationElements = document.querySelectorAll(".ant-pagination")

    actionColumns.forEach((col) => {
      col.style.display = "none"
    })
    paginationElements.forEach((el) => {
      el.style.display = "none"
    })

    const printContent = printRef.current.outerHTML
    const WinPrint = window.open("", "", "width=900,height=650")
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print Daily Income Data</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .ant-btn { display: none; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    WinPrint.document.close()
    WinPrint.focus()
    WinPrint.print()

    // Restore UI after print
    window.onafterprint = () => {
      actionColumns.forEach((col) => {
        col.style.display = ""
      })
      paginationElements.forEach((el) => {
        el.style.display = ""
      })
      window.onafterprint = null
    }
    // Fallback for browsers that don't support onafterprint
    setTimeout(() => {
      actionColumns.forEach((col) => {
        col.style.display = ""
      })
      paginationElements.forEach((el) => {
        el.style.display = ""
      })
    }, 1000)
    WinPrint.close()
  }

  // Filter trips data
  const filteredTrips = trips.filter((dt) => {
    const term = searchTerm.toLowerCase()
    const itemDate = dayjs(dt.date) // Use 'date' field from JSON

    const matchesSearch =
      dt.date?.toLowerCase().includes(term) ||
      dt.load_point?.toLowerCase().includes(term) ||
      dt.unload_point?.toLowerCase().includes(term) ||
      dt.vehicle_no?.toLowerCase().includes(term) ||
      dt.driver_name?.toLowerCase().includes(term) ||
      String(dt.Rent_amount).includes(term) ||
      String(dt.total_exp).includes(term) || // Use total_exp for search
      String(Number.parseFloat(dt.Rent_amount || "0") - Number.parseFloat(dt.total_exp || "0")).includes(term) || // Search by calculated profit
      dt.customer_name?.toLowerCase().includes(term) ||
      dt.customer_mobile?.toLowerCase().includes(term) ||
      dt.status?.toLowerCase().includes(term)

        // Simple date filtering
   const matchesDateRange =
        dateRange.length === 0 ||
        (itemDate.isAfter(dayjs(dateRange[0]).subtract(1, "day")) && itemDate.isBefore(dayjs(dateRange[1]).add(1, "day")))
  
      return matchesSearch && matchesDateRange
    })

  // Calculate totals for summary
  const totalTrips = filteredTrips.length
  const totalRevenue = filteredTrips.reduce((sum, trip) => sum + Number(trip.Rent_amount || 0), 0)
  const totalExpenses = filteredTrips.reduce((sum, trip) => sum + Number(trip.total_exp || 0), 0) // Use total_exp
  const totalProfit = totalRevenue - totalExpenses
  const averageProfit = totalTrips > 0 ? totalProfit / totalTrips : 0

  // Table columns - matching your original structure
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
      width: 100,
      render: (date) => (
        <Space>
          <Text>{dayjs(date).format("YYYY-MM-DD")}</Text>
        </Space>
      ),
    },
    {
      title: "Vehicle",
      dataIndex: "vehicle_no",
      key: "vehicle_no",
      width: 100,
      render: (vehicle) => <Text strong>{vehicle}</Text>,
    },
    {
      title: "Load Point",
      dataIndex: "load_point",
      key: "load_point",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (load) => (
        <Tooltip placement="topLeft" title={load}>
          {load}
        </Tooltip>
      ),
    },
    {
      title: "Unload Point",
      dataIndex: "unload_point",
      key: "unload_point",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (unload) => (
        <Tooltip placement="topLeft" title={unload}>
          {unload}
        </Tooltip>
      ),
    },
    {
      title: "Rent Amount", // "ট্রিপের ভাড়া"
      dataIndex: "Rent_amount",
      key: "Rent_amount",
      width: 100,
      render: (price) => (
        <Space>
          <Text strong>৳{Number.parseFloat(price).toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: "Total Expenses", // "চলমানখরচ"
      dataIndex: "total_exp", // Use the total_exp field directly
      key: "total_exp",
      width: 120,
      render: (totalExp) => (
        <Space>
          <Text>৳{Number.parseFloat(totalExp).toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: "Profit", // "লাভ"
      key: "profit",
      width: 100,
      render: (_, record) => {
        const rentAmount = Number.parseFloat(record.Rent_amount || "0")
        const totalExp = Number.parseFloat(record.total_exp || "0")
        const profit = rentAmount - totalExp
        const finalProfit = isNaN(profit) ? 0 : profit
        return (
          <Space>
            <Text strong style={{ color: finalProfit >= 0 ? "#11375B" : "#ff4d4f" }}>
              ৳{finalProfit.toFixed(2)}
            </Text>
          </Space>
        )
      },
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 80,
    //   className: "action_column", // Add class for print hiding
    //   render: (_, record) => (
    //     <Tooltip title="Edit">
    //       <Link to={`/tramessy/update-dailyIncomeForm/${record.id}`}>
    //         <EditOutlined className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary" />
    //       </Link>
    //     </Tooltip>
    //   ),
    // },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <Card
        className=""
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }} gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ margin: 0, color: "#11375B" }}>
              <TruckOutlined style={{ marginRight: "12px", color: "#11375B" }} />
              Daily Income List
            </Title>
          </Col>
          <Col>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilter(!showFilter)}
              className={`border border-[#11375b] px-4 py-1 rounded ${
                showFilter ? "bg-[#11375b] text-white" : "bg-transparent text-[#11375b]"
              }`}
            >
              Filter
            </Button>
          </Col>
        </Row>
        {/* Filter Section */}
        {showFilter && (
          <Card style={{ marginBottom: "16px" }}>
            <Row gutter={16} align="middle">
              <Col sm={10} lg={20}>
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => setDateRange(dates ?? [])}
                  placeholder={["Start Date", "End Date"]}
                />
              </Col>
              <Col span={4}>
                <Button
                onClick={()=>setShowFilter(false)}
                  type="primary"
                  icon={<FilterOutlined />}
                  style={{ background: "#11375B", borderColor: "#11375B" }}
                >
                  close
                </Button>
              </Col>
            </Row>
          </Card>
        )}
        {/* Export and Search */}
        <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }} gutter={[16, 16]}>
          <Col>
            <Space wrap>
              {/* CSV */}
              <Button
                icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
                onClick={exportCSV}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
              >
                CSV
              </Button>
              {/* Excel */}
              <Button
                icon={<FileExcelOutlined style={{ color: "#52c41a" }} />}
                onClick={exportExcel}
                className="!bg-green-50 border !border-green-100 hover:!bg-white hover:!text-primary"
              >
                Excel
              </Button>
              {/* PDF */}
              <Button
                icon={<FilePdfOutlined style={{ color: "#f5222d" }} />}
                onClick={exportPDF}
                className="!bg-orange-50 border !border-orange-100 hover:!bg-white hover:!text-primary"
              >
                PDF
              </Button>
              {/* Print */}
              <Button
                icon={<PrinterOutlined style={{ color: "#722ed1" }} />}
                onClick={printTable}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
              >
                Print
              </Button>
            </Space>
          </Col>
          {/* Search */}
          <Col>
            <Search
              placeholder="Search Income..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              enterButton={
                <Button
                  className="!bg-primary !border-primary"
                  style={{
                    backgroundColor: "#11375B",
                  }}
                >
                  <SearchOutlined className="!text-white" />
                </Button>
              }
            />
          </Col>
        </Row>
        {/* Table */}
        <div ref={printRef}>
          <Table
            columns={columns}
            dataSource={filteredTrips}
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
                setPagination({ current: page, pageSize })
              },
              onShowSizeChange: (current, size) => {
                setPagination({ current: 1, pageSize: size })
              },
            }}
            summary={(pageData) => {
              let totalPageRevenue = 0
              let totalPageExpenses = 0
              pageData.forEach((trip) => {
                totalPageRevenue += Number(trip.Rent_amount || 0)
                totalPageExpenses += Number(trip.total_exp || 0)
              })
              const totalPageProfit = totalPageRevenue - totalPageExpenses
              const finalTotalPageProfit = isNaN(totalPageProfit) ? 0 : totalPageProfit

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ backgroundColor: "#e6f7ff" }}>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong style={{ color: "#11375B" }}>
                        Total
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: "#11375B" }}>
                        ৳ {totalPageRevenue.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>
                      <Text strong style={{ color: "#11375B" }}>
                        ৳ {totalPageExpenses.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text strong style={{ color: finalTotalPageProfit >= 0 ? "#11375B" : "#ff4d4f" }}>
                        ৳ {finalTotalPageProfit.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell /> {/* For Actions column */}
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </div>
        {/* Additional Summary */}
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>Average Trip Revenue</Text>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>
                ৳ {totalTrips > 0 ? (totalRevenue / totalTrips).toFixed(2) : 0}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>Average Trip Expenses</Text>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>
                ৳ {totalTrips > 0 ? (totalExpenses / totalTrips).toFixed(2) : 0}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>Profit Margin</Text>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: totalProfit >= 0 ? "#52c41a" : "#ff4d4f",
                }}
              >
                {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default DailyIncome
