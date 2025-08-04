
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
//   Form,
//   Modal,
// } from "antd"
// import {
//   EditOutlined,
//   DeleteOutlined,
//   FileTextOutlined,
//   FileExcelOutlined,
//   FilePdfOutlined,
//   PrinterOutlined,
//   PlusOutlined,
//   SearchOutlined,
// } from "@ant-design/icons"
// import { useEffect, useState, useRef } from "react"
// import axios from "axios"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// import * as XLSX from "xlsx"
// import { saveAs } from "file-saver"
// import dayjs from "dayjs"

// const { Title, Text } = Typography
// const { Search } = Input

// const DailyExpense = () => {
//   const [expenses, setExpenses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const printRef = useRef()
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [editingId, setEditingId] = useState(null)
//   const [form] = Form.useForm()

//   const showModal = async (record = null) => {
//     if (record) {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/expense/${record.id}`)
//         const data = res.data?.data
//         form.setFieldsValue({
//           ...data,
//           date: data?.date ? dayjs(data.date) : null,
//         })
//         setEditingId(record.id)
//       } catch (err) {
//         message.error("ডেটা লোড করতে সমস্যা হয়েছে")
//       }
//     }
//     setIsModalVisible(true)
//   }

//   const handleCancel = () => {
//     form.resetFields()
//     setEditingId(null)
//     setIsModalVisible(false)
//   }

//   useEffect(() => {
//     fetchExpenses()
//   }, [])

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/expense/list`)
//       setExpenses(response.data?.data || [])
//       setLoading(false)
//     } catch (err) {
//       message.error("ডেটা লোড করতে সমস্যা হয়েছে")
//       setLoading(false)
//     }
//   }

//   const handleFormSubmit = async (values) => {
//     try {
//       const payload = {
//         ...values,
//         date: values.date.format("YYYY-MM-DD"),
//       }

//       if (editingId) {
//         await axios.post(`${import.meta.env.VITE_BASE_URL}/api/expense/update/${editingId}`, payload)
//         message.success("খরচ আপডেট হয়েছে")
//       } else {
//         await axios.post(`${import.meta.env.VITE_BASE_URL}/api/expense/save`, payload)
//         message.success("খরচ যুক্ত করা হয়েছে")
//       }

//       form.resetFields()
//       setIsModalVisible(false)
//       setEditingId(null)
//       fetchExpenses()
//     } catch (err) {
//       console.error(err)
//       message.error("অপারেশন ব্যর্থ হয়েছে")
//     }
//   }

//   const filteredData = expenses.filter((item) =>
//     [item.paid_to, item.pay_amount, item.payment_category, item.remarks]
//       .join(" ")
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   )

//   const exportCSV = () => {
//     const csvContent = [
//       ["Serial", "Date", "Paid To", "Amount", "Category", "Remarks"],
//       ...filteredData.map((item, i) => [
//         i + 1,
//         item.date,
//         item.paid_to,
//         item.pay_amount,
//         item.payment_category,
//         item.remarks,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n")

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     saveAs(blob, "general_expense.csv")
//   }

//   const exportExcel = () => {
//     const data = filteredData.map((item, i) => ({
//       ক্রমিক: i + 1,
//       তারিখ: item.date,
//       "যাকে প্রদান": item.paid_to,
//       "পরিমাণ": item.pay_amount,
//       ক্যাটাগরি: item.payment_category,
//       মন্তব্য: item.remarks,
//     }))

//     const ws = XLSX.utils.json_to_sheet(data)
//     const wb = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(wb, ws, "General Expense")
//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
//     saveAs(new Blob([buffer]), "general_expense.xlsx")
//   }

//   const exportPDF = () => {
//     const doc = new jsPDF()
//     autoTable(doc, {
//       head: [["Serial", "Date", "Paid To", "Amount", "Category", "Remarks"]],
//       body: filteredData.map((item, i) => [
//         i + 1,
//         item.date,
//         item.paid_to,
//         item.pay_amount,
//         item.payment_category,
//         item.remarks,
//       ]),
//     })
//     doc.save("general_expense.pdf")
//   }

//   const printTable = () => {
//     const content = printRef.current.innerHTML
//     const win = window.open("", "", "width=900,height=650")
//     win.document.write(`
//       <html>
//         <head><title>Print</title></head>
//         <body>${content}</body>
//       </html>
//     `)
//     win.document.close()
//     win.focus()
//     win.print()
//     win.close()
//   }

//   const columns = [
//     {
//       title: "ক্রমিক",
//       render: (_, __, i) => i + 1,
//       width: 70,
//     },
//     {
//       title: "তারিখ",
//       dataIndex: "date",
//       width: 120,
//     },
//     {
//       title: "যাকে প্রদান",
//       dataIndex: "paid_to",
//     },
//     {
//       title: "পরিমাণ",
//       dataIndex: "pay_amount",
//     },
//     {
//       title: "ক্যাটাগরি",
//       dataIndex: "payment_category",
//     },
//     {
//       title: "মন্তব্য",
//       dataIndex: "remarks",
//     },
//     // {
//     //   title: "অ্যাকশন",
//     //   render: (_, record) => (
//     //     <Space>
//     //       <Tooltip title="সম্পাদনা">
//     //         <EditOutlined onClick={() => showModal(record)} className="!text-yellow-500 hover:!text-primary"/>
//     //       </Tooltip>
//     //     </Space>
//     //   ),
//     // },
//   ]

//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className="">
//         <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} gutter={[16, 16]}>
//           <Col>
//             <Title level={4}>দৈনিক খরচের তালিকা</Title>
//           </Col>
//           <Col>
//             <Button type="primary" icon={<PlusOutlined />} size="middle" className="!bg-primary" onClick={() => showModal()}>
//               নতুন খরচ
//             </Button>
//           </Col>
//         </Row>

//         <Row justify="space-between" style={{ marginBottom: 16 }} gutter={[16, 16]}>
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
//            {/* Search */}
//           <Col>
//             <Search
//               placeholder="ব্যয় খুঁজুন...."
//               allowClear
//               onChange={(e) => setSearchTerm(e.target.value)}
//               enterButton={
//                 <Button
//                   style={{
//                     backgroundColor: "#11375B",
//                     color: "#fff",
//                     borderColor: "#11375B",
//                   }}
//                 >
//                   <SearchOutlined className="!text-white"/>
//                 </Button>
//               }
//             />
//           </Col>
//         </Row>

//         <div ref={printRef}>
//           <Table
//             dataSource={filteredData}
//             columns={columns}
//             rowKey="id"
//             loading={loading}
//             size="small"
//             pagination={{ pageSize: 10 }}
//           />
//         </div>
//       </Card>
// {/* add & update খরচ */}
//       <Modal
//         title={editingId ? "খরচ আপডেট করুন" : "নতুন খরচ যুক্ত করুন"}
//         open={isModalVisible}
//         onCancel={handleCancel}
//         onOk={() => form.submit()}
//         okText="সাবমিট"
//         cancelText="বাতিল করুন"
//         centered
//       >
//         <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//           <Row gutter={[16, 0]}>
//             <Col md={12}>
//               <Form.Item name="date" label="তারিখ" rules={[{ required: true, message: "তারিখ দিন" }]}> 
//                 <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} size="middle" />
//               </Form.Item>
//             </Col>
//             <Col md={12}>
//               <Form.Item name="paid_to" label="যাকে প্রদান" rules={[{ required: true, message: "প্রাপকের নাম দিন" }]}> 
//                 <Input placeholder="প্রাপকের নাম" size="middle" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={[16, 0]}>
//             <Col md={12}>
//               <Form.Item name="pay_amount" label="পরিমাণ" rules={[{ required: true, message: "পরিমাণ দিন" }]}> 
//                 <Input type="number" placeholder="পরিমাণ" size="middle" />
//               </Form.Item>
//             </Col>
//             <Col md={12}>
//               <Form.Item name="payment_category" label="ক্যাটাগরি" rules={[{ required: true, message: "ক্যাটাগরি দিন" }]}> 
//                 <Input placeholder="ক্যাটাগরি" size="middle" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={[16, 0]}>
//             <Col span={24}>
//               <Form.Item name="remarks" label="মন্তব্য"> 
//                 <Input placeholder="মন্তব্য" size="middle" />
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Modal>
//     </div>
//   )
// }

// export default DailyExpense


import {
  Table,
  Button,
  Input,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Tooltip,
  DatePicker,
  message,
  Form,
  Modal,
} from "antd"
import {
  EditOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import dayjs from "dayjs"
import api from "../utils/axiosConfig"

const { Title, Text } = Typography
const { Search } = Input
const DailyExpense = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const printRef = useRef(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const showModal = async (record=null) => {
    if (record) {
      try {
        const res = await api.get(`/api/payments/${record.id}`)
        const data = res.data
        form.setFieldsValue({
          ...data,
          date: data?.date ? dayjs(data.date) : null,
        })
        setEditingId(record.id)
      } catch (err) {
        message.error("Failed to load data")
      }
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setEditingId(null)
    setIsModalVisible(false)
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/api/payments`)
      setExpenses(response.data || [])
      setLoading(false)
    } catch (err) {
      message.error("Failed to load data")
      setLoading(false)
    }
  }

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      }
      if (editingId) {
        await api.put(`/api/payments/${editingId}`, payload)
        message.success("Expense updated successfully")
      } else {
        await api.post(`/api/payments`, payload)
        message.success("Expense added successfully")
      }
      form.resetFields()
      setIsModalVisible(false)
      setEditingId(null)
      fetchExpenses()
    } catch (err) {
      console.error(err)
      message.error("Operation failed")
    }
  }

  const filteredData = expenses.filter((item) =>
    [item.paid_to, item.pay_amount, item.payment_category, item.remarks]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  )

  const exportCSV = () => {
    const csvContent = [
      ["Serial", "Date", "Paid To", "Amount", "Category", "Remarks"],
      ...filteredData.map((item, i) => [
        i + 1,
        item.date,
        item.paid_to,
        item.pay_amount,
        item.payment_category,
        item.remarks,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "general_expense.csv")
  }

  const exportExcel = () => {
    const data = filteredData.map((item, i) => ({
      Serial: i + 1,
      Date: item.date,
      "Paid To": item.paid_to,
      Amount: item.pay_amount,
      Category: item.payment_category,
      Remarks: item.remarks,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "General Expense")
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    saveAs(new Blob([buffer]), "general_expense.xlsx")
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [["Serial", "Date", "Paid To", "Amount", "Category", "Remarks"]],
      body: filteredData.map((item, i) => [
        i + 1,
        item.date,
        item.paid_to,
        item.pay_amount,
        item.payment_category,
        item.remarks,
      ]),
    })
    doc.save("general_expense.pdf")
  }

  const printTable = () => {
    const content = printRef.current?.innerHTML
    const win = window.open("", "", "width=900,height=650")
    if (win && content) {
      win.document.write(`
        <html>
          <head><title>Print</title></head>
          <body>${content}</body>
        </html>
      `)
      win.document.close()
      win.focus()
      win.print()
      win.close()
    }
  }

  const columns = [
    {
      title: "Serial",
      render: (_, __, i) => i + 1,
      width: 70,
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 120,
    },
    {
      title: "Paid To",
      dataIndex: "paid_to",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Category",
      dataIndex: "payment_category",
    },
    {
      title: "Remarks",
      dataIndex: "particulars",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <EditOutlined onClick={() => showModal(record)} className="!text-yellow-500 hover:!text-primary" />
          </Tooltip>
          {/* You can add a delete button here if needed */}
          {/* <Tooltip title="Delete">
            <DeleteOutlined onClick={() => handleDelete(record.id)} className="!text-red-500 hover:!text-primary" />
          </Tooltip> */}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: "10px" }}>
      <Card className="">
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} gutter={[16, 16]}>
          <Col>
            <Title level={4}>Daily Expense List</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              className="!bg-primary"
              onClick={() => showModal()}
            >
              Add New Expense
            </Button>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginBottom: 16 }} gutter={[16, 16]}>
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
              placeholder="Search Expense..."
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
        <div ref={printRef}>
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            loading={loading}
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
      {/* add & update expense */}
      <Modal
        title={editingId ? "Update Expense" : "Add New Expense"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Submit"
        cancelText="Cancel"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={[16, 0]}>
            <Col md={12}>
              <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}>
                <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} size="middle" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="paid_to"
                label="Paid To"
                rules={[{ required: true, message: "Please enter recipient name" }]}
              >
                <Input placeholder="Recipient Name" size="middle" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col md={12}>
              <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
                <Input type="number" placeholder="Amount" size="middle" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                name="payment_category"
                label="Category"
                rules={[{ required: true, message: "Please enter category" }]}
              >
                <Input placeholder="Category" size="middle" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item name="particulars" label="Remarks">
                <Input placeholder="Remarks" size="middle" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default DailyExpense
