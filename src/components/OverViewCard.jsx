

import { useEffect, useState } from "react"
import { Card, Row, Col, List, Typography, Space, Badge, Table, Tag, Spin } from "antd"
import {
  DollarOutlined,
  ToolOutlined,
  BellOutlined,
  TrophyOutlined,
  FireOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import api from "../utils/axiosConfig"

const { Title, Text } = Typography

const OverViewCard = () => {
  const [expiringDocs, setExpiringDocs] = useState([])
  const [octenCost, setOctenCost] = useState(0)
  const [dieselCost, setDieselCost] = useState(0)
  const [petrolCost, setPetrolCost] = useState(0)
  const [gasCost, setGasCost] = useState(0)
  const [todayMaintenanceCost, setTodayMaintenanceCost] = useState(0)
  const [otherExpenses, setOtherExpenses] = useState(0)
  const [demarage, setDemarage] = useState(0)
  const [driverCommission, setDriverCommission] = useState(0)
  const [todayIncome, setTodayIncome] = useState(0)
  const [trips, setTrips] = useState([])
  const [totalTripExpenses, setTotalTripExpenses] = useState(0)
  const [loadingIncome, setLoadingIncome] = useState(true)
  const [loadingReminder, setLoadingReminder] = useState(true)
  const [loadingTrips, setLoadingTrips] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const today = dayjs().format("YYYY-MM-DD")

  // Vehicle document reminder
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get(`/api/vehicle`)
        const vehicles = response.data || []
        const todayDate = dayjs()
        const warnings = []
        const expired = []
        vehicles.forEach((vehicle) => {
          ;["fitness_date", "route_per_date", "tax_date"].forEach((field) => {
            const docDate = dayjs(vehicle[field])
            if (!docDate.isValid()) return
            const diffDays = docDate.diff(todayDate, "day")
            const docInfo = {
              vehicle: vehicle.reg_no || "N/A",
              document: field.replace(/_/g, " ").toUpperCase(),
              expireDate: docDate.format("DD-MM-YYYY"),
              daysLeft: diffDays,
            }
            if (diffDays >= 0 && diffDays <= 7) {
              warnings.push(docInfo) // expiring within 7 days
            } else if (diffDays < 0 && Math.abs(diffDays) <= 5) {
              expired.push({
                ...docInfo,
                daysAgo: Math.abs(diffDays), // expired within 5 days
              })
            }
          })
        })
        setExpiringDocs([...warnings, ...expired])
      } catch (error) {
        console.error("Error fetching vehicle data:", error)
      } finally {
        setLoadingReminder(false)
      }
    }
    fetchVehicles()
  }, [])
console.log("Expiring Docs:", expiringDocs)
  // Fuel
  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        const response = await api.get(`/api/fuel`)
        const fuels = response.data || []
        console.log("Fetched fuels:", fuels)
        let octen = 0
        let diesel = 0
        let petrol = 0
        let gas = 0
        fuels.forEach((fuel) => {
          if (dayjs(fuel.date).format("YYYY-MM-DD") === today) {
            const totalPrice = Number.parseFloat(fuel.total_cost) || 0
            const type = (fuel.fuel_type || "").toLowerCase()
            if (type === "octen") octen += totalPrice
            else if (type === "diesel") diesel += totalPrice
            else if (type === "petroll" || type === "petrol") petrol += totalPrice
            else if (type === "gas") gas += totalPrice
          }
        })
        setOctenCost(octen)
        setDieselCost(diesel)
        setPetrolCost(petrol)
        setGasCost(gas)
      } catch (error) {
        console.error("Error fetching fuel data:", error)
      } finally {
        setLoadingExpenses(false)
      }
    }
    fetchFuelData()
  }, [today])


  // Maintenance
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const response = await api.get(`/api/maintaince`)
        const data = response.data
        const total = data
          .filter((item) => dayjs(item.date).format("YYYY-MM-DD") === today)
          .reduce((sum, item) => sum + Number.parseFloat(item.total_cost), 0)
        setTodayMaintenanceCost(total)
      } catch (error) {
        console.error("Failed to fetch maintenance data", error)
      }
    }
    fetchMaintenanceData()
  }, [today])

  // Trips
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await api.get(`/api/trip`)
        const data = response.data
        setTrips(data)
        const todayTrips = data.filter((trip) => dayjs(trip.date).format("YYYY-MM-DD") === today)
        // const totalOtherExpenses = todayTrips.reduce((sum, trip) => sum + Number.parseFloat(trip.others || 0), 0)
        // const totalDemarage = todayTrips.reduce((sum, trip) => sum + Number.parseFloat(trip.demrage_total || 0), 0)
        // const totalCommission = todayTrips.reduce((sum, trip) => sum + Number.parseFloat(trip.commision || 0), 0)
        const totalTripIncome = todayTrips.reduce((sum, trip) => sum + Number.parseFloat(trip.Rent_amount || 0), 0)
        const totalTripCost = todayTrips.reduce((sum, trip) => sum + Number.parseFloat(trip.total_exp || 0), 0)
        // setOtherExpenses(totalOtherExpenses)
        // setDemarage(totalDemarage)
        // setDriverCommission(totalCommission)
        setTotalTripExpenses(totalTripCost)
        setTodayIncome(totalTripIncome)
      } catch (error) {
        console.error("Failed to fetch trip data", error)
      } finally {
        setLoadingTrips(false)
        setLoadingIncome(false)
      }
    }
    fetchTripData()
  }, [today])

  const totalFuelCost = octenCost + dieselCost + petrolCost + gasCost
  // const totalTripExpenses = otherExpenses + demarage + driverCommission
  const totalExpense = totalFuelCost + todayMaintenanceCost + totalTripExpenses
  const profit = todayIncome - totalExpense

  const expenseTableData = [
    {
      key: "1",
      type: "Fuel Expense",
      amount: totalFuelCost,
      icon: <FireOutlined style={{ color: "#fa8c16" }} />,
      status: totalFuelCost > 0 ? "active" : "inactive",
    },
    {
      key: "2",
      type: "Maintenance Expense",
      amount: todayMaintenanceCost,
      icon: <ToolOutlined style={{ color: "#f5222d" }} />,
      status: todayMaintenanceCost > 0 ? "active" : "inactive",
    },
    {
      key: "3",
      type: "Trip Expense",
      amount: totalTripExpenses,
      icon: <UserOutlined style={{ color: "#13c2c2" }} />,
      status: totalTripExpenses > 0 ? "active" : "inactive",
    },
  ]

  // booking
  const [bookingReminders, setBookingReminders] = useState([])
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/api/bookings`)
        const bookings = res.data || []
        const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD")
        const filtered = bookings.filter((booking) => {
          const startDate = dayjs(booking.startDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          return startDate === tomorrow
        })
        setBookingReminders(filtered)
      } catch (error) {
        console.error("Booking fetch error", error)
      }
    }
    fetchBookings()
  }, [])

  // parts & spearce
  const [expiredParts, setExpiredParts] = useState([])
  const [warningParts, setWarningParts] = useState([])
  const [loadingPartsReminder, setLoadingPartsReminder] = useState(true)
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await api.get(`/api/parts`)
        const data = response.data || []
        const todayDate = dayjs()
        const expired = []
        const warnings = []
        data.forEach((part) => {
          if (part.validity && dayjs(part.validity).isValid()) {
            const partDate = dayjs(part.validity).startOf("day")
            const diffDays = partDate.diff(todayDate, "day")
            // Expired parts: show if expired within the past 5 days
            if (diffDays < 0 && Math.abs(diffDays) <= 5) {
              expired.push({
                id: part.id,
                name: part.parts_name,
                expireDate: partDate.format("DD-MM-YYYY"),
                daysAgo: Math.abs(diffDays),
              })
            }
            // Warning parts: will expire within next 7 days
            else if (diffDays >= 0 && diffDays <= 7) {
              warnings.push({
                id: part.id,
                name: part.parts_name,
                expireDate: partDate.format("DD-MM-YYYY"),
              })
            }
          }
        })
        setExpiredParts(expired)
        setWarningParts(warnings)
      } catch (error) {
        console.error("Failed to fetch parts:", error)
      } finally {
        setLoadingPartsReminder(false)
      }
    }
    fetchParts()
  }, [])

  const columns = [
    {
      title: "Expense Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <Space className="text-xs lg:text-sm">
          {record.icon}
          <p className="text-xs lg:text-lg">{text}</p>
        </Space>
      ),
    },
    {
      title: "Amount(tk)",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount) => (
        <Text strong style={{ color: amount > 0 ? "#f5222d" : "#8c8c8c" }}>
          {amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "active" ? "red" : "default"}>{status === "active" ? "Expense" : "Not Expense"}</Tag>
      ),
    },
  ]

  // Columns for the new Today's Net Profit table
  const todayNetProfitColumns = [
    {
      title: "Income",
      dataIndex: "income",
      key: "income",
      render: (value) => (
        <Text strong className="text-green-600">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳
        </Text>
      ),
    },
    {
      title: "Trip Expenses",
      dataIndex: "tripExpenses",
      key: "tripExpenses",
      render: (value) => (
        <Text className="text-red-500">{value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳</Text>
      ),
    },
    {
      title: "Fuel Expense",
      dataIndex: "fuelExpense",
      key: "fuelExpense",
      render: (value) => (
        <Text className="text-red-500">{value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳</Text>
      ),
    },
    {
      title: "Maintenance Cost",
      dataIndex: "maintenanceCost",
      key: "maintenanceCost",
      render: (value) => (
        <Text className="text-red-500">{value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳</Text>
      ),
    },
    {
      title: "Total Expenses",
      dataIndex: "totalExpenses",
      key: "totalExpenses",
      render: (value) => (
        <Text strong className="text-red-500">
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳
        </Text>
      ),
    },
    {
      title: "Net Profit",
      dataIndex: "netProfit",
      key: "netProfit",
      render: (value) => (
        <Text strong style={{ color: value >= 0 ? "#22c55e" : "#ff4d4f" }}>
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳
        </Text>
      ),
    },
  ]

  // Data for the new Today's Net Profit table
  const todayNetProfitData = [
    {
      key: "today-profit",
      income: todayIncome,
      fuelExpense: totalFuelCost, // Total fuel cost
      tripExpenses: totalTripExpenses, // Combined fuel and other trip expenses
      maintenanceCost: todayMaintenanceCost,
      totalExpenses: totalExpense,
      netProfit: profit,
    },
  ]

  // Summary for the new Today's Net Profit table
  // const todayNetProfitSummary = (pageData) => {
  //   const dataRow = pageData[0] // There's only one row for today's data
  //   if (!dataRow) return null

  //   return (
  //     <Table.Summary fixed>
  //       <Table.Summary.Row className="bg-blue-50">
  //         <Table.Summary.Cell index={0}>
  //           <Text strong>Total:</Text>
  //         </Table.Summary.Cell>
  //         <Table.Summary.Cell index={1}>
  //           <Text strong className="text-green-700">
  //             {dataRow.income.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳
  //           </Text>
  //         </Table.Summary.Cell>
  //         <Table.Summary.Cell index={2}>
  //           <Text strong>{dataRow.tripExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳</Text>
  //         </Table.Summary.Cell>
  //         <Table.Summary.Cell index={3}>
  //           <Text strong>{dataRow.maintenanceCost.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳</Text>
  //         </Table.Summary.Cell>
  //         <Table.Summary.Cell index={4}>
  //           <Text strong>{dataRow.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳</Text>
  //         </Table.Summary.Cell>
  //         <Table.Summary.Cell index={5}>
  //           <Text strong style={{ color: dataRow.netProfit >= 0 ? "#22c55e" : "#ff4d4f" }}>
  //             {dataRow.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} ৳
  //           </Text>
  //         </Table.Summary.Cell>
  //       </Table.Summary.Row>
  //     </Table.Summary>
  //   )
  // }

  return (
    <div className="p-6">
      <Row gutter={[16, 16]} className="mb-5">
        {/* parts & spears Reminder */}
        <Col xs={24} sm={24} md={12} lg={8}>
          <Card
            size="small"
            title={
              <Space className="text-gray-800">
                <ToolOutlined style={{ color: "#f5222d" }} />
                <span>Parts & Spares Alert</span>
                {expiredParts?.length + warningParts?.length > 0 && (
                  <Badge count={expiredParts?.length + warningParts?.length} />
                )}
              </Space>
            }
            className="h-[200px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            bodyStyle={{ padding: "12px", maxHeight: "150px", overflowY: "auto" }}
          >
            {loadingPartsReminder ? (
              <div className="flex justify-center items-center h-full">
                <Spin size="small" />
              </div>
            ) : expiredParts?.length + warningParts?.length > 0 ? (
              <List
                size="small"
                dataSource={[...warningParts, ...expiredParts]}
                renderItem={(item) => (
                  <List.Item className="py-0 border-b border-gray-100 last:border-b-0">
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <div className="flex justify-between items-center">
                        <Text strong className="text-xs text-gray-900">
                          {item.name}
                        </Text>
                        {item.daysAgo ? (
                          <Tag color="red" className="text-xs font-medium">
                            Expired {item.daysAgo} days ago
                          </Tag>
                        ) : (
                          <Tag color="orange" className="text-xs font-medium">
                            Expiring soon
                          </Tag>
                        )}
                      </div>
                      <Text className="text-xs text-red-600">Expiry: {item.expireDate}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ToolOutlined className="text-2xl mb-2" />
                <Text type="secondary" className="text-xs">
                  No alerts
                </Text>
              </div>
            )}
          </Card>
        </Col>
        {/* document reminder */}
        <Col xs={24} sm={12} md={12} lg={8}>
          <Card
            size="small"
            title={
              <Space className="text-gray-800">
                <BellOutlined style={{ color: "#fa8c16" }} />
                <span>Document Reminder</span>
                {expiringDocs.length > 0 && <Badge count={expiringDocs.length} />}
              </Space>
            }
            className="h-[200px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            bodyStyle={{ padding: "12px", maxHeight: "150px", overflowY: "auto" }}
          >
            {loadingReminder ? (
              <div className="flex justify-center items-center h-full">
                <Spin size="small" />
              </div>
            ) : expiringDocs.length > 0 ? (
              <List
                size="small"
                dataSource={expiringDocs}
                renderItem={(item) => (
                  <List.Item className="py-0 border-b border-gray-100 last:border-b-0">
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <div className="flex justify-between items-center">
                        <Text strong className="text-xs text-gray-900">
                          {item.vehicle}
                        </Text>
                        <Tag
                          color={item.daysLeft < 0 ? "red" : item.daysLeft <= 3 ? "red" : "orange"}
                          className="text-xs font-medium"
                        >
                          {item.daysLeft < 0
                            ? `Expired ${Math.abs(item.daysLeft)} day(s) ago`
                            : `${item.daysLeft} day(s) left`}
                        </Tag>
                      </div>
                      <Text className="text-xs text-gray-500">{item.document}</Text>
                      <Text className="text-xs text-red-600">{item.expireDate}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <BellOutlined className="text-2xl mb-2" />
                <Text type="secondary" className="text-xs">
                  No Alerts
                </Text>
              </div>
            )}
          </Card>
        </Col>
        {/* booking reminder */}
        {/* <Col xs={24} sm={12} md={12} lg={8}>
          <Card
            size="small"
            title={
              <Space className="text-gray-800">
                <BellOutlined style={{ color: "#13c2c2" }} />
                <span>Booking Reminder</span>
                {bookingReminders.length > 0 && <Badge count={bookingReminders.length} />}
              </Space>
            }
            className="h-[150px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            bodyStyle={{ padding: "12px", maxHeight: "100px", overflowY: "auto" }}
          >
            {bookingReminders.length > 0 ? (
              <List
                size="small"
                dataSource={bookingReminders}
                renderItem={(item) => (
                  <List.Item className="py-0 border-b border-gray-100 last:border-b-0">
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                      <div className="flex justify-between items-center">
                        <Text strong className="text-xs text-gray-900">
                          {item.customerName}
                        </Text>
                        <Tag color="cyan" className="text-xs font-medium">
                          {item.carName}
                        </Tag>
                      </div>
                      <Text className="text-xs text-gray-500">Phone: {item.phone}</Text>
                      <Text className="text-xs text-red-600">Start: {item.startDate}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <BellOutlined className="text-2xl mb-2" />
                <Text type="secondary" className="text-xs">
                  No upcoming bookings
                </Text>
              </div>
            )}
          </Card>
        </Col> */}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space className="text-gray-800">
                <DollarOutlined style={{ color: "#1890ff" }} />
                <span>Today's Expense Summary</span>
              </Space>
            }
            extra={
              <Space className="text-gray-600">
                <Text>Total Expense:</Text>
                <Text strong style={{ color: "#fa541c", fontSize: "16px" }}>
                  {totalExpense.toFixed(2)} Tk
                </Text>
              </Space>
            }
            className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <Table
              loading={loadingExpenses}
              dataSource={expenseTableData}
              columns={columns}
              pagination={false}
              size="small"
              rowClassName="hover:bg-gray-50 transition-colors duration-200 w-full"
              summary={(pageData) => {
                const total = pageData.reduce((sum, record) => sum + record.amount, 0)
                return (
                  <Table.Summary.Row className="bg-orange-50 border-t-2 border-orange-200">
                    <Table.Summary.Cell index={0}>
                      <Space>
                        <WarningOutlined style={{ color: "#fa8c16" }} />
                        <Text strong className="text-gray-900">
                          Total
                        </Text>
                      </Space>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong style={{ color: "#fa541c", fontSize: "12px" }}>
                        {total.toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="center">
                      <Tag color="orange" className="font-medium">
                        Total Expense
                      </Tag>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )
              }}
            />
          </Card>
        </Col>
        {/* New: Today's Net Profit Card with Table */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space className="text-gray-800">
                <DollarOutlined style={{ color: "#52c41a" }} />
                <span>Today's Net Profit Statement</span>
              </Space>
            }
            className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <Table
              loading={loadingIncome || loadingExpenses || loadingTrips}
              dataSource={todayNetProfitData}
              columns={todayNetProfitColumns}
              pagination={false}
              size="small"
              bordered
              // summary={todayNetProfitSummary}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OverViewCard
