import { useEffect, useRef, useState } from "react";
import {
  Table, Button, Card, Row, Col, Typography, Input, Space, Modal, Tag, Tooltip, Spin, message,
} from "antd";
import { PlusOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, PrinterOutlined } from "@ant-design/icons";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { Link } from "react-router-dom";
import BookingInvoice from "../components/BookingInvoice";
import { useReactToPrint } from "react-to-print";

const { Title } = Typography;
const { confirm } = Modal;
const { Search } = Input;

const Booking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const bookings=[
{
     customerName: "customer",
    phone: "0133446789",
    carName: "Luxmy",
    startDate: "12-10-2025",
    endDate: "15-10-2025",
    status: "pending",
    advancePayment:  1000,
    totalAmount: 5000,
}
]

//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/bookings`);
//       setBookings(res.data?.data || []);
//     } catch {
//     //   message.error("বুকিং ডেটা লোড করতে সমস্যা হয়েছে");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const filteredBookings = bookings.filter((booking) =>
//     Object.values(booking).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/bookings/${selectedBooking?.id}`);
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking?.id));
      message.success("বুকিং সফলভাবে ডিলিট হয়েছে");
    } catch {
      message.error("ডিলিট করতে সমস্যা হয়েছে!");
    } finally {
      setDeleteModalVisible(false);
      setSelectedBooking(null);
    }
  };

//   print invoice
const [selectedInvoice, setSelectedInvoice] = useState(null);
const printRef = useRef();

const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Invoice Print",
    onAfterPrint: () => {
      console.log("Print completed")
      setSelectedInvoice(null)
    },
    onPrintError: (error) => {
      console.error("Print error:", error)
    },
  })

  const handlePrintClick = (record) => {
    const formatted = {
       customerName:record.customerName,
    phone: record.phone,
    carName:record.carName,
    startDate: record.startDate,
    endDate:record.endDate,
    status:record.status,
    advancePayment:record.advancePayment,
    totalAmount: record.totalAmount
}

    setSelectedInvoice(formatted)

    // Use setTimeout to ensure the component is rendered before printing
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const columns = [
    {
      title: "SL",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "কাস্টমারের নাম",
      dataIndex: "customerName",
    },
    {
      title: "মোবাইল",
      dataIndex: "phone",
    },
    {
      title: "গাড়ির নাম",
      dataIndex: "carName",
    },
    {
      title: "শুরুর তারিখ",
      dataIndex: "startDate",
    },
    {
      title: "শেষ তারিখ",
      dataIndex: "endDate",
    },
    {
      title: "অ্যাডভান্স পরিশোধ",
      dataIndex: "advancePayment",
    },
    {
      title: "টোটাল ভাড়া",
      dataIndex: "totalAmount",
    },
    {
      title: "স্ট্যাটাস",
      dataIndex: "status",
      render: (status) => <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>,
    },
    {
      title: "অ্যাকশন",
      render: (_, record) => (
        <Space>
          <Link to={`/tramessy/update-booking/${record.id}`}>
            <Tooltip title="সম্পাদনা"><EditOutlined className="text-yellow-500" /></Tooltip>
          </Link>
          <Tooltip title="ইনভয়েস প্রিন্ট করুন">
        <Button
          type="link"
          icon={<PrinterOutlined/>}
          onClick={() => handlePrintClick(record)}
          className="text-green-600"
        />
      </Tooltip>
          <Tooltip title="ডিলিট">
            <RiDeleteBinLine className="text-red-500 cursor-pointer"
              onClick={() => {
                setSelectedBooking(record);
                setDeleteModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

//   if (loading) {
//     return <div className="min-h-screen flex justify-center items-center"><Spin size="large" /></div>;
//   }

  return (
    <div className="p-4">
      <Card>
        <Row justify="space-between" align="middle" className="mb-4">
          <Col><Title level={4}>বুকিং তালিকা</Title></Col>
          <Col>
            <Link to="/tramessy/add-booking">
              <Button type="primary" icon={<PlusOutlined />} className="!bg-primary">নতুন বুকিং</Button>
            </Link>
          </Col>
        </Row>

        {/* Search */}
        <Row justify="end" className="mb-4">
          <Col>
            <Search
              placeholder="ইউজার খুঁজুন..."
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
                  <SearchOutlined className="!text-white"/>
                </Button>
              }
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
        {/* Hidden Component for Printing */}
      <div  style={{ display: "none" }} >
        {selectedInvoice && <BookingInvoice ref={printRef} data={selectedInvoice} />}
      </div>

        <Modal
          open={deleteModalVisible}
          title="ডিলিট কনফার্মেশন"
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="হ্যাঁ"
          cancelText="না"
          okButtonProps={{ danger: true }}
        >
          <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
          আপনি কি নিশ্চিত "{selectedBooking?.customerName}" বুকিংটি ডিলিট করতে চান?
        </Modal>
      </Card>
    </div>
  );
};

export default Booking;
