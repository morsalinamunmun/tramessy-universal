


import { useEffect, useState, useRef } from "react";
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
  Statistic,
  Divider,
  Spin,
} from "antd";
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
  UserOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import api from "../utils/axiosConfig";

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const DailyTripExpense = () => {
  const [trip, setTrip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const printRef = useRef();

  useEffect(() => {
    fetchTripData();
  }, []);

  const fetchTripData = async () => {
    try {
      const response = await api.get(`/api/trip`);
      if (response.data) {
        const sortedData = response.data.sort((a, b) => {
          const dateTimeA = dayjs(a.date);
          const dateTimeB = dayjs(b.date);
          return dateTimeB.diff(dateTimeA);
        });
        setTrip(sortedData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trip data:", error);
      message.error("Failed to load trip data.");
      setLoading(false);
    }
  };

  const getExportData = () => {
    return filteredExpense.map((item, index) => ({
      index: index + 1,
      date: dayjs(item.date).format("YYYY-MM-DD"),
      vehicle_no: item.vehicle_no,
      driver_name: item.driver_name,
      load_point: item.load_point,
      unload_point: item.unload_point,
      fuel_cost: item.fuel_cost,
      toll_cost: item.toll_cost,
      police_cost: item.police_cost,
      commision: item.commision,
      labour: item.labour,
      demrage_total: item.demrage_total,
      trip_cost:
        Number(item.fuel_cost || 0) +
        Number(item.toll_cost || 0) +
        Number(item.police_cost || 0) +
        Number(item.commision || 0) +
        Number(item.labour || 0) +
        Number(item.demrage_total || 0),
      others: item.others,
      total_exp: item.total_exp,
    }));
  };

  const exportCSV = () => {
    const headers = [
      "#",
      "Date",
      "Load Point",
      "Unload Point",
      "Vehicle No",
      "Driver Name",
      "Fuel Cost",
      "Toll Cost",
      "Police Cost",
      "Commission",
      "Labour Cost",
      "Other Expenses",
      "Total Trip Expenses",
      "Demurrage Day",
      "Demurrage Rate",
      "Demurrage Total",
      "Customer Name",
      "Customer Mobile",
      "Rent Amount",
      "Advanced",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...getExportData(filteredExpense).map((item) => [
        item.index,
        item.date,
        item.load_point,
        item.unload_point,
        item.vehicle_no,
        item.driver_name,
        item.fuel_cost,
        item.toll_cost,
        item.police_cost,
        item.commision,
        item.labour,
        item.others,
        item.total_exp,
        item.demrage_day,
        item.demrage_rate,
        item.demrage_total,
        item.customer_name,
        item.customer_mobile,
        item.Rent_amount,
        item.advanced,
        item.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "daily_expense_data.csv");
  };

  const exportExcel = () => {
    const headers = [
      "#",
      "Date",
      "Load Point",
      "Unload Point",
      "Vehicle No",
      "Driver Name",
      "Fuel Cost",
      "Toll Cost",
      "Police Cost",
      "Commission",
      "Labour Cost",
      "Other Expenses",
      "Total Trip Expenses",
      "Demurrage Day",
      "Demurrage Rate",
      "Demurrage Total",
      "Customer Name",
      "Customer Mobile",
      "Rent Amount",
      "Advanced",
      "Status",
    ];
    const formattedData = getExportData(filteredExpense).map((item) => ({
      "#": item.index,
      Date: item.date,
      "Load Point": item.load_point,
      "Unload Point": item.unload_point,
      "Vehicle No": item.vehicle_no,
      "Driver Name": item.driver_name,
      "Fuel Cost": item.fuel_cost,
      "Toll Cost": item.toll_cost,
      "Police Cost": item.police_cost,
      Commission: item.commision,
      "Labour Cost": item.labour,
      "Other Expenses": item.others,
      "Total Trip Expenses": item.total_exp,
      "Demurrage Day": item.demrage_day,
      "Demurrage Rate": item.demrage_rate,
      "Demurrage Total": item.demrage_total,
      "Customer Name": item.customer_name,
      "Customer Mobile": item.customer_mobile,
      "Rent Amount": item.Rent_amount,
      Advanced: item.advanced,
      Status: item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Expense Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "daily_expense_data.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "#",
      "Date",
      "Vehicle No",
      "Driver Name",
      "Load Point",
      "Unload Point",
      "Fuel Cost",
      "Toll Cost",
      "Police Cost",
      "Commission",
      "Labour Cost",
      "Other Expenses",
      "Total Trip Expenses",
    ];
    const tableRows = getExportData(filteredExpense).map((item) => [
      item.index,
      item.date,
      item.vehicle_no,
      item.driver_name,
      item.load_point,
      item.unload_point,
      item.fuel_cost,
      item.toll_cost,
      item.police_cost,
      item.commision,
      item.labour,
      item.others,
      item.total_exp,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { font: "helvetica", fontSize: 6 },
      headStyles: { fillColor: "#11375B" },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 18 },
        2: { cellWidth: 18 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 15 },
        10: { cellWidth: 15 },
        11: { cellWidth: 15 },
        12: { cellWidth: 20 },
      },
    });
    doc.save("daily_expense_data.pdf");
  };

  const printTable = () => {
    const actionColumns = document.querySelectorAll(".action_column");
    const paginationElements = document.querySelectorAll(".ant-pagination");

    actionColumns.forEach((col) => {
      col.style.display = "none";
    });
    paginationElements.forEach((el) => {
      el.style.display = "none";
    });

    const printContent = printRef.current.outerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
      <html>
        <head>
          <title>Print Daily Expense Data</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            .ant-btn { display: none; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();

    window.onafterprint = () => {
      actionColumns.forEach((col) => {
        col.style.display = "";
      });
      paginationElements.forEach((el) => {
        el.style.display = "";
      });
      window.onafterprint = null;
    };
    setTimeout(() => {
      actionColumns.forEach((col) => {
        col.style.display = "";
      });
      paginationElements.forEach((el) => {
        el.style.display = "";
      });
    }, 1000);
    WinPrint.close();
  };

  const filteredExpense = trip.filter((dt) => {
    const term = searchTerm.toLowerCase();
    const itemDate = dayjs(dt.date);

    const matchesSearch =
      dt.date?.toLowerCase().includes(term) ||
      dt.load_point?.toLowerCase().includes(term) ||
      dt.unload_point?.toLowerCase().includes(term) ||
      dt.vehicle_no?.toLowerCase().includes(term) ||
      dt.driver_name?.toLowerCase().includes(term) ||
      String(dt.fuel_cost).includes(term) ||
      String(dt.toll_cost).includes(term) ||
      String(dt.police_cost).includes(term) ||
      String(dt.commision).includes(term) ||
      String(dt.labour).includes(term) ||
      String(dt.others).includes(term) ||
      String(dt.total_exp).includes(term) ||
      dt.customer_name?.toLowerCase().includes(term) ||
      dt.customer_mobile?.toLowerCase().includes(term) ||
      dt.status?.toLowerCase().includes(term);

    const matchesDateRange =
      dateRange.length === 0 ||
      (itemDate.isAfter(dayjs(dateRange[0]).subtract(1, "day")) &&
        itemDate.isBefore(dayjs(dateRange[1]).add(1, "day")));

    return matchesSearch && matchesDateRange;
  });

  const totalTrips = filteredExpense.length;
  const totalFuelCost = filteredExpense.reduce((sum, item) => sum + Number(item.fuel_cost || 0), 0);
  const totalTollCost = filteredExpense.reduce((sum, item) => sum + Number(item.toll_cost || 0), 0);
  const totalPoliceCost = filteredExpense.reduce((sum, item) => sum + Number(item.police_cost || 0), 0);
  const totalCommission = filteredExpense.reduce((sum, item) => sum + Number(item.commision || 0), 0);
  const totalLabour = filteredExpense.reduce((sum, item) => sum + Number(item.labour || 0), 0);
  const totalOthers = filteredExpense.reduce((sum, item) => sum + Number(item.others || 0), 0);
  const grandTotalExpenses = filteredExpense.reduce((sum, item) => sum + Number(item.total_exp || 0), 0);
  const averageExpense = totalTrips > 0 ? grandTotalExpenses / totalTrips : 0;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "SL",
      key: "index",
      width: 50,
      fixed: "left",
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
      fixed: "left",
      render: (date) => (
        <Space>
          <Text>{dayjs(date).format("YYYY-MM-DD")}</Text>
        </Space>
      ),
    },
    {
      title: "Vehicle No.",
      dataIndex: "vehicle_no",
      key: "vehicle_no",
      width: 100,
      render: (vehicle) => <Text strong>{vehicle}</Text>,
    },
    {
      title: "Driver Name",
      dataIndex: "driver_name",
      key: "driver_name",
      width: 120,
      render: (name) => (
        <Space>
          <Text>{name}</Text>
        </Space>
      ),
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
      title: "Trip Cost",
      key: "trip_cost",
      width: 100,
      render: (record) => {
        const tripCost =
          Number(record.fuel_cost || 0) +
          Number(record.toll_cost || 0) +
          Number(record.police_cost || 0) +
          Number(record.commision || 0) +
          Number(record.labour || 0) +
          Number(record.demrage_total || 0);
        return <Text>৳{tripCost.toFixed(2)}</Text>;
      },
    },
    {
      title: "Other Expenses",
      dataIndex: "others",
      key: "others",
      width: 100,
      render: (cost) => <Text>৳{Number.parseFloat(cost || "0").toFixed(2)}</Text>,
    },
    {
      title: "Total Trip Expenses",
      dataIndex: "total_exp",
      key: "total_exp",
      width: 120,
      fixed: "right",
      render: (totalExp) => (
        <Space>
          <Text strong>৳{Number.parseFloat(totalExp || "0").toFixed(2)}</Text>
        </Space>
      ),
    },
  ];

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
        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }} gutter={[16, 16]}>
          <Col>
            <Title level={3} style={{ margin: 0, color: "#11375B" }}>
              <TruckOutlined style={{ marginRight: "12px", color: "#11375B" }} />
              Daily Trip Expense List
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

        {/* <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: "12px",
                border: "none",
              }}
            >
              <Statistic
                title={<span>Total Trips</span>}
                value={totalTrips}
                valueStyle={{ color: "black", fontSize: "24px", fontWeight: "bold" }}
                prefix={<TruckOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: "12px",
                border: "none",
              }}
            >
              <Statistic
                title={<span>Total Expenses</span>}
                value={totalFuelCost + totalTollCost + totalPoliceCost + totalCommission + totalLabour + totalOthers}
                precision={2}
                valueStyle={{ color: "black", fontSize: "24px", fontWeight: "bold" }}
                prefix={<FallOutlined />}
                suffix="৳"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              style={{
                textAlign: "center",
                borderRadius: "12px",
                border: "none",
              }}
            >
              <Statistic
                title={<span>Grand Total Expenses</span>}
                value={grandTotalExpenses}
                precision={2}
                valueStyle={{
                  color: "black",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                prefix={<DollarOutlined />}
                suffix="৳"
              />
            </Card>
          </Col>
        </Row> */}

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
                  onClick={() => 
                    {setDateRange([])
                    setShowFilter(false)}}
                  type="primary"
                  icon={<FilterOutlined />}
                  style={{ background: "#11375B", borderColor: "#11375B" }}
                >
                  clear
                </Button>
              </Col>
            </Row>
          </Card>
        )}

        <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }} gutter={[16, 16]}>
          <Col>
            <Space wrap>
              <Button
                icon={<FileTextOutlined style={{ color: "#1890ff" }} />}
                onClick={exportCSV}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
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
                onClick={printTable}
                className="!bg-blue-50 border !border-blue-100 hover:!bg-white hover:!text-primary"
              >
                Print
              </Button>
            </Space>
          </Col>
          <Col>
            <Search
              placeholder="Search Trip Expense..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              enterButton={
                <Button
                  className="!bg-primary !border-primary"
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
            columns={columns}
            dataSource={filteredExpense}
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
            summary={(pageData) => {
              let totalPageFuelCost = 0;
              let totalPageTollCost = 0;
              let totalPagePoliceCost = 0;
              let totalPageCommission = 0;
              let totalPageLabour = 0;
              let totalPageOthers = 0;
              let totalPageGrandExpenses = 0;
              let totalTipCost = 0;
              let totalDemrage = 0;

              pageData.forEach((item) => {
                const fuel = Number(item.fuel_cost || 0);
                const toll = Number(item.toll_cost || 0);
                const police = Number(item.police_cost || 0);
                const commission = Number(item.commision || 0);
                const labour = Number(item.labour || 0);
                const others = Number(item.others || 0);
                const total = Number(item.total_exp || 0);
                const demrage = Number(item.demrage_total || 0);

                totalPageFuelCost += fuel;
                totalPageTollCost += toll;
                totalPagePoliceCost += police;
                totalPageCommission += commission;
                totalPageLabour += labour;
                totalPageOthers += others;
                totalPageGrandExpenses += total;
                totalDemrage += demrage;

                totalTipCost += fuel + toll + police + commission + labour + demrage;
              });

              return (
                <Table.Summary fixed>
                  <Table.Summary.Row style={{ backgroundColor: "#e6f7ff" }}>
                    <Table.Summary.Cell index={0} colSpan={6}>
                      <Text strong style={{ color: "#11375B" }}>
                        Page Total
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <Text strong style={{ color: "#11375B" }}>
                        ৳ {totalTipCost.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                      <Text strong style={{ color: "#11375B" }}>
                        ৳ {totalPageOthers.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                      <Text strong style={{ color: "#11375B" }}>
                        ৳ {totalPageGrandExpenses.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </div>

        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>Average Trip Expense</Text>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>
                ৳ {totalTrips > 0 ? (grandTotalExpenses / totalTrips).toFixed(2) : 0}
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>Total Fuel Cost</Text>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>৳ {totalFuelCost.toFixed(2)}</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <Text style={{ color: "#666", fontSize: "14px" }}>Total Commission</Text>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#11375B" }}>
                ৳ {totalCommission.toFixed(2)}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DailyTripExpense;