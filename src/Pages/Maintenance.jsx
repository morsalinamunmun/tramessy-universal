"use client"

import { useEffect, useState, useRef } from "react"
import { Table, Button, Input, Modal, Card, Space, Typography, Row, Col, Tooltip, DatePicker, message, Tag } from "antd"
import {
  ToolOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
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
import { RiDeleteBinLine } from "react-icons/ri"
import dayjs from "dayjs" // Import dayjs for date handling
import api from "../utils/axiosConfig" // Assuming this is your axios instance

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState([]) // dayjs objects
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const printRef = useRef()

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const fetchMaintenance = async () => {
    try {
      const response = await api.get(`/api/maintaince`)
      // Assuming response.data is directly the array of maintenance records
      setMaintenance(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching maintenance data:", error)
      message.error("Failed to load maintenance data.")
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMaintenanceId) return
    try {
      await api.delete(`/api/maintaince/${selectedMaintenanceId}`)
      setMaintenance((prev) => prev.filter((item) => item.id !== selectedMaintenanceId))
      message.success("Maintenance record deleted successfully.")
      setDeleteModalOpen(false)
      setSelectedMaintenanceId(null)
    } catch (error) {
      console.error("Delete error:", error)
      message.error("Failed to delete record!")
    }
  }

  // Export functionality
  const getExportData = (data) => {
    return data.map((item, index) => ({
      index: index + 1,
      date: item.date,
      service_type: item.service_type,
      parts: item.parts,
      maintaince_type: item.maintaince_type,
      vehicle_no: item.vehicle_no,
      parts_price: item.parts_price,
      service_charge: item.service_charge,
      total_cost: item.total_cost,
      priority: item.priority,
      notes: item.notes,
      status: item.status,
    }))
  }

  const exportCSV = () => {
    const headers = [
      "#",
      "Date",
      "Service Type",
      "Parts",
      "Maintenance Type",
      "Vehicle No",
      "Parts Price",
      "Service Charge",
      "Total Cost",
      "Priority",
      "Notes",
      "Status",
    ]
    const csvData = getExportData(filteredMaintenance).map((item) => [
      item.index,
      item.date,
      item.service_type,
      item.parts,
      item.maintaince_type,
      item.vehicle_no,
      item.parts_price,
      item.service_charge,
      item.total_cost,
      item.priority,
      item.notes,
      item.status,
    ])
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "maintenance_data.csv")
  }

  const exportExcel = () => {
    const headers = [
      "#",
      "Date",
      "Service Type",
      "Parts",
      "Maintenance Type",
      "Vehicle No",
      "Parts Price",
      "Service Charge",
      "Total Cost",
      "Priority",
      "Notes",
      "Status",
    ]
    const formattedData = getExportData(filteredMaintenance).map((item) => ({
      "#": item.index,
      Date: item.date,
      "Service Type": item.service_type,
      Parts: item.parts,
      "Maintenance Type": item.maintaince_type,
      "Vehicle No": item.vehicle_no,
      "Parts Price": item.parts_price,
      "Service Charge": item.service_charge,
      "Total Cost": item.total_cost,
      Priority: item.priority,
      Notes: item.notes,
      Status: item.status,
    }))
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance Data")
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(data, "maintenance_data.xlsx")
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    const tableColumn = [
      "#",
      "Date",
      "Service Type",
      "Parts",
      "Maint. Type",
      "Vehicle No",
      "Parts Price",
      "Service Charge",
      "Total Cost",
      "Priority",
      "Notes",
      "Status",
    ]
    const tableRows = getExportData(filteredMaintenance).map((item) => [
      item.index,
      item.date,
      item.service_type,
      item.parts,
      item.maintaince_type,
      item.vehicle_no,
      item.parts_price,
      item.service_charge,
      item.total_cost,
      item.priority,
      item.notes,
      item.status,
    ])
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { font: "helvetica", fontSize: 8 },
      headStyles: { fillColor: "#11375B" },
    })
    doc.save("maintenance_data.pdf")
  }

  // Print function
  const printTable = () => {
    const actionColumns = document.querySelectorAll(".action_column")
    const statusColumns = document.querySelectorAll(".status_column") // Select status column elements
    const paginationElements = document.querySelectorAll(".ant-pagination")

    actionColumns.forEach((col) => {
      col.style.display = "none"
    })
    statusColumns.forEach((col) => {
      col.style.display = "none" // Hide status column
    })
    paginationElements.forEach((el) => {
      el.style.display = "none"
    })

    const printContent = printRef.current.outerHTML
    const WinPrint = window.open("", "", "width=900,height=650")
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print Maintenance Data</title>
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
      statusColumns.forEach((col) => {
        col.style.display = "" // Show status column
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
      statusColumns.forEach((col) => {
        col.style.display = "" // Show status column
      })
      paginationElements.forEach((el) => {
        el.style.display = ""
      })
    }, 1000)
    WinPrint.close()
  }

  // Filter maintenance data
  const filteredMaintenance = maintenance.filter((item) => {
    const term = searchTerm.toLowerCase()
    const itemDate = dayjs(item.date)

    const matchesSearch =
      item.date?.toLowerCase().includes(term) ||
      item.service_type?.toLowerCase().includes(term) ||
      item.parts?.toLowerCase().includes(term) || // Use 'parts'
      item.maintaince_type?.toLowerCase().includes(term) || // Use 'maintaince_type'
      item.vehicle_no?.toLowerCase().includes(term) ||
      item.parts_price?.toString().includes(term) ||
      item.service_charge?.toString().includes(term) ||
      item.total_cost?.toString().includes(term) ||
      item.priority?.toLowerCase().includes(term) || // Use 'priority'
      item.notes?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term)

    let matchesDateRange = true
    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]).startOf("day")
      const endDate = dayjs(dateRange[1]).endOf("day")
      matchesDateRange = itemDate.isSameOrAfter(startDate) && itemDate.isSameOrBefore(endDate)
    }
    return matchesSearch && matchesDateRange
  })

  // Calculate totals
  const totalRecords = filteredMaintenance.length
  const totalCost = filteredMaintenance.reduce((sum, item) => sum + Number(item.total_cost || 0), 0)
  const averageCost = totalRecords > 0 ? totalCost / totalRecords : 0

  // Get priority color (using Ant Design Tag colors)
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "red"
      case "medium":
        return "orange"
      case "low":
        return "green"
      default:
        return "blue" // Default color for undefined or other priorities
    }
  }

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
      // width: 100,
      render: (date) => (
        <Space>
        
          <Text>{dayjs(date).format("YYYY-MM-DD")}</Text>
        </Space>
      ),
    },
    // {
    //   title: "Service Type",
    //   dataIndex: "service_type",
    //   key: "service_type",
    //   width: 120,
    //   render: (type) => <Text strong>{type}</Text>,
    // },
    {
      title: "Vehicle No",
      dataIndex: "vehicle_no",
      key: "vehicle_no",
      // width: 100,
    },
    // {
    //   title: "Maintenance Type",
    //   dataIndex: "maintaince_type", 
    //   key: "maintaince_type",
    //   width: 120,
    // },
    {
      title: "Parts",
      dataIndex: "parts", 
      key: "parts",
      // width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (parts) => (
        <Tooltip placement="topLeft" title={parts}>
          {parts}
        </Tooltip>
      ),
    },
    {
      title: "Parts Price",
      dataIndex: "parts_price",
      key: "parts_price",
      // width: 100,
      render: (price) => <Text>৳{Number.parseFloat(price).toFixed(2)}</Text>,
    },
    {
      title: "Service Charge",
      dataIndex: "service_charge",
      key: "service_charge",
      // width: 120,
      render: (charge) => <Text>৳{Number.parseFloat(charge).toFixed(2)}</Text>,
    },
    {
      title: "Total Cost",
      dataIndex: "total_cost",
      key: "total_cost",
      // width: 120,
      render: (cost) => (
        <Space>
        
          <Text strong>৳{Number.parseFloat(cost).toFixed(2)}</Text>
        </Space>
      ),
    },
    // {
    //   title: "Priority",
    //   dataIndex: "priority", // Corrected to 'priority' as per JSON
    //   key: "priority",
    //   width: 80,
    //   render: (priority) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // width: 100,
      className: "status_column",
      render: (status) => {
        let color = "default"
        const text = status
        if (status === "completed") {
          color = "green"
        } else if (status === "pending") {
          color = "orange"
        } else if (status === "in_progress") {
          color = "blue"
        }
        return <Tag color={color}>{text?.toUpperCase()}</Tag>
      },
    },
    {
      title: "Actions",
      key: "actions",
      // width: 100,
      className: "action_column", // Add class for print hiding
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Link to={`/tramessy/update-maintenance/${record.id}`}>
              <EditOutlined className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary" />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBinLine
              className="!text-red-500 p-1 cursor-pointer text-2xl rounded"
              onClick={() => {
                setSelectedMaintenanceId(record.id)
                setDeleteModalOpen(true)
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
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
              <ToolOutlined style={{ marginRight: "12px", color: "#11375B" }} />
              Maintenance Records
            </Title>
          </Col>
          <Col>
            <Space>
              <Link to="/tramessy/add-maintenance">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="middle"
                  style={{
                    backgroundColor: "#11375B",
                    borderColor: "#11375B",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  Add 
                </Button>
              </Link>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(!showFilter)}
                className={`border border-[#11375b] px-4 py-1 rounded ${
                  showFilter ? "bg-[#11375b] text-white" : "bg-transparent text-[#11375b]"
                }`}
              >
                Filter
              </Button>
            </Space>
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
                  type="primary"
                  icon={<FilterOutlined />}
                  style={{ background: "#11375B", borderColor: "#11375B" }}
                >
                  Apply Filter
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
              placeholder="Search Maintenance..."
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
        <div ref={printRef}>
          <Table
            columns={columns}
            dataSource={filteredMaintenance}
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
              let totalPageCost = 0
              pageData.forEach(({ total_cost }) => {
                totalPageCost += Number(total_cost) || 0
              })
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ backgroundColor: "#e6f7ff" }}>
                    <Table.Summary.Cell index={0} colSpan={6}>
                      {" "}
                      {/* Adjusted colSpan based on new columns */}
                      <Text strong style={{ color: "#11375B" }}>
                        Total
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: "#11375B" }}>
                        ৳ {totalPageCost.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={3} /> {/* Remaining columns blank */}
                  </Table.Summary.Row>
                </Table.Summary>
              )
            }}
          />
        </div>
        {/* Delete Modal */}
        <Modal
          title={
            <Space>
              <DeleteOutlined style={{ color: "#ff4d4f" }} />
              Delete Maintenance Record
            </Space>
          }
          open={deleteModalOpen}
          onOk={handleDelete}
          onCancel={() => {
            setDeleteModalOpen(false)
            setSelectedMaintenanceId(null)
          }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this maintenance record?</p>
        </Modal>
      </Card>
    </div>
  )
}

export default Maintenance
