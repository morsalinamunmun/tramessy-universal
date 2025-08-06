
import { useState } from "react"
import { Layout, Menu, Avatar } from "antd"
import { DashboardOutlined, CarOutlined, FundOutlined, UserOutlined } from "@ant-design/icons"
import { Link, useLocation } from "react-router-dom"
import useAdmin from "../hooks/useAdmin"
import logo from "../assets/logo.svg"
import avatar from "../assets/avatar.png";

const { Sider } = Layout
const { SubMenu } = Menu

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const isAdmin = useAdmin()
  const [openKeys, setOpenKeys] = useState([]);

  // Get current selected key from pathname
  // const getSelectedKey = () => {
  //   return location.pathname === "/" ? "dashboard" : location.pathname.replace("/", "")
  // }
const handleOpenChange = (keys) => {
  setOpenKeys(keys.length > 0 ? [keys[keys.length - 1]] : []);
};

  // Admin menu items
  const adminMenuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/tramessy">Dashboard</Link>,
    },
    {
      key: "fleet",
      icon: <CarOutlined />,
      label: "Fleet Management",
      children: [
        {
          key: "CarList",
          label: <Link to="/tramessy/car-list">Vehicle</Link>,
        },
        {
          key: "DriverList",
          label: <Link to="/tramessy/driver-list">Driver</Link>,
        },
        {
          key: "TripList",
          label: <Link to="/tramessy/trip-list">Trip Records</Link>,
        },
        {
          key: "Fuel",
          label: <Link to="/tramessy/fuel">Fuel Records</Link>,
        },
        {
          key: "Parts",
          label: <Link to="/tramessy/parts">Parts & Spares</Link>,
        },
        {
          key: "Maintenance",
          label: <Link to="/tramessy/maintenance">Maintenance</Link>,
        },
        // {
        //   key: "Booking",
        //   label: <Link to="/tramessy/booking">Booking</Link>,
        // },
      ],
    },
    {
      key: "business",
      icon: <FundOutlined />,
      label: "Business Statement",
      children: [
        {
          key: "DailyIncome",
          label: <Link to="/tramessy/daily-income">Daily Income</Link>,
        },
        {
          key: "DailyTripExpense",
          label: <Link to="/tramessy/daily-trip-expense">Daily Trip Expense</Link>,
        },
        {
          key: "DailyExpense",
          label: <Link to="/tramessy/daily-expense">Daily Expense</Link>,
        },
         {
          key: "monthlyStatement",
          label: <Link to="/tramessy/monthly-statement">Monthly Statement</Link>,
        },
      ],
    },
    // {
    //   key: "user",
    //   icon: <UserOutlined />,
    //   label: "User Control",
    //   children: [
    //     {
    //       key: "AllUsers",
    //       label: <Link to="/tramessy/all-users">All Users</Link>,
    //     },
    //   ],
    // },
  ]

  const getSelectedKey = () => {
  const match = adminMenuItems
    .flatMap(item => (item.children ? item.children : item))
    .find(item => location.pathname.includes(item.key));
  return match ? [match.key] : [];
};


  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      
      breakpoint="lg"
      collapsedWidth="80"
      width={260}
      className="bg-white shadow-2xl custom-sider"
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        overflow: "auto",
      }}
    >
      {/* Logo Section */}
      <div className="flex justify-center items-center px-4 py-4 lg:py-0  border-b border-gray-200">
        <Link to="/tramessy">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${collapsed ? "w-10 h-10" : "w-20 h-18"}`}
          />
        </Link>
      </div>

      {/* Admin Info Section */}
      {/* {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
            <Avatar  src={avatar} size={32} className="shadow-sm" />
            <div className="flex-1">
              <h3 className="text-gray-800 font-semibold text-sm">Admin</h3>
       
            </div>
          </div>
        </div>
      )} */}

      {/* Navigation Menu */}
      <div className="p-2 pb-8">
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={getSelectedKey()}
  openKeys={openKeys}
       onOpenChange={handleOpenChange}
          items={adminMenuItems}
          className="!border-none bg-white h-full custom-menu"
          style={{
            fontSize: "14px",
          }}
        />
      </div>
    </Sider>
  )
}

export default Sidebar

