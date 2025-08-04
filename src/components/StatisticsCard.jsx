
import axios from "axios"
import { useEffect, useState } from "react"
import { Card, Statistic, Row, Col, Spin } from "antd"
import { CarOutlined, TeamOutlined, UserAddOutlined, TruckOutlined } from "@ant-design/icons"
import api from "../utils/axiosConfig"

const StatisticsCard = () => {
  const [trips, setTrips] = useState([])
  const [vehicle, setvehicle] = useState([])
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0)
  const [driver, setDriver] = useState([]);
  const [todayTripCount, setTodayTripCount] = useState(0)
const [todayIncome, setTodayIncome] = useState(0)
  const [loadingVehicle, setLoadingVehicle] = useState(true)
  const [loadingCustomer, setLoadingCustomer] = useState(true)
  const [loadingDriver, setLoadingDriver] = useState(true)
  // loading
    const [loadingIncome, setLoadingIncome] = useState(true)
  const [loadingTrips, setLoadingTrips] = useState(true)

  // trips
  useEffect(() => {
    api.get(`/api/trip`).then((res) => {
      setTrips(res.data)
    })
  }, [])

  // income
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await api.get(`/api/trip`)
        const data = response.data
        setTrips(data)

       const today = new Date().toISOString().split("T")[0]
        const todayTrips = data.filter((trip) => trip.date === today)
setTodayTripCount(todayTrips.length)


const totalTripIncome = todayTrips.reduce(
  (sum, trip) => sum + Number.parseFloat(trip.Rent_amount || 0),
  0
)

setTodayIncome(totalTripIncome)
      } catch (error) {
        console.error("Failed to fetch trip data", error)
      } finally {
        setLoadingTrips(false)
        setLoadingIncome(false)
      }
    }

    fetchTripData()
  }, [])

  // vehicle
  useEffect(() => {
    api.get(`/api/vehicle`).then((res) => {
      setvehicle(res.data)
      setLoadingVehicle(false)
    })
  }, [])

  // customer count
  useEffect(() => {
  api.get(`/api/trip`)
    .then((res) => {
      const trips = res.data
      if (Array.isArray(trips)) {
        const customerNames = trips
          .map((trip) => trip.customer_name?.trim())
          .filter((name) => name && name !== "")
        const uniqueCustomers = new Set(customerNames)
        setUniqueCustomerCount(uniqueCustomers.size)
      }
    })
    .catch((error) => {
      console.error("Error fetching trips:", error)
    })
    .finally(() => {
      setLoadingCustomer(false)
    })
}, [])


  // drivers
  useEffect(() => {
    api.get(`/api/driver`).then((res) => {
      setDriver(res.data)
    })
     setLoadingDriver(false)
  }, [])

  const statisticsData = [
    // {
    //   title: "টোটাল ট্রিপ",
    //   value: trips.length,
    //   icon: <TruckOutlined className="text-white text-xl" />,
    //   iconBg: "bg-gradient-to-r from-blue-500 to-blue-600",
    //   cardBg: "bg-gradient-to-r from-blue-50 to-blue-100",
    //   textColor: "text-blue-700",
    //   borderColor: "border-l-blue-500",
    // },
    {
      title: "Today's Income",
      value: todayIncome,
      loading: loadingIncome,
      icon: <CarOutlined className="!text-white text-xl" />,
      iconBg: "bg-gradient-to-r from-green-500 to-green-600",
      cardBg: "bg-gradient-to-r from-green-50 to-green-100",
      textColor: "text-green-700",
      borderColor: "border-l-green-500",
    },
    {
      title: "Total Customers",
      value: uniqueCustomerCount,
      loading: loadingCustomer,
      icon: <TeamOutlined className="!text-white text-xl" />,
      iconBg: "bg-gradient-to-r from-orange-500 to-orange-600",
      cardBg: "bg-gradient-to-r from-orange-50 to-orange-100",
      textColor: "text-orange-700",
      borderColor: "border-l-orange-500",
    },
    {
      title: "Today Trips",
      value: todayTripCount,
      loading: loadingTrips,
      icon: <UserAddOutlined className="!text-white text-xl" />,
      iconBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      cardBg: "bg-gradient-to-r from-purple-50 to-purple-100",
      textColor: "text-purple-700",
      borderColor: "border-l-purple-500",
    },
  ]

  return (
    <div className="px-6 pt-6 ">
      <Row gutter={[20, 20]}>
        {statisticsData.map((item, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              hoverable
              className={`${item.cardBg} ${item.borderColor} border-l-4 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden`}
              bodyStyle={{ padding: "20px" }}
            >
              <div className="flex items-center gap-2 md:gap-0 md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-primary rounded-lg shadow-md`}>{item.icon}</div>
                    <h3 className={`text-primary font-semibold text-xs md:text-base`}>{item.title}</h3>
                    </div>
                    <p className="text-3xl font-medium">{item.loading ? <Spin size="small" /> : item.value}</p>
                  </div>
                  {/* <Statistic
                    value={item.value}
                    valueStyle={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      // color: "#1f2937",
                    }}
                    className="!text-white"
                  /> */}
                </div>
                <div className="ml-4">
                  <div className={`w-2 h-16 ${item.iconBg} rounded-full opacity-30`}></div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default StatisticsCard
