

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
  message,
  Tag,
  Modal,
  Spin,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";

const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchUsers();
  }, []);
   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`);
      if (response.data.status === "success") {
        setUsers(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("ইউজার ডেটা লোড করতে সমস্যা হয়েছে");
      setLoading(false);
    }
  };

  //  Show confirmation modal
  const showDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };
  // cancel delete modal
  const handleCancel = () => {
    setDeleteModalVisible(false);
    setSelectedUser(null);
  };

  //  Delete user
const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/users/delete/${selectedUser.id}`
      );
      if (response.data.status === "success") {
        setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
        message.success("ইউজার সফলভাবে ডিলিট হয়েছে");
        setDeleteModalVisible(false);
        setSelectedUser(null);
      } else {
        throw new Error("ডিলিট ব্যর্থ");
      }
    } catch (error) {
      console.error("Delete error:", error);
      message.error("ডিলিট করতে সমস্যা হয়েছে!");
    }
  };


  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    {
      title: "নাম",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "মোবাইল",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "ইমেইল",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "ধরন",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "স্ট্যাটাস",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "অ্যাকশন",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="সম্পাদনা">
            <Link to={`/tramessy/update-usersForm/${record.id}`}>
              <EditOutlined className="!text-yellow-500 cursor-pointer text-lg hover:!text-primary" />
            </Link>
          </Tooltip>
          <Tooltip title="ডিলিট">
            <RiDeleteBinLine
              className="text-red-500 cursor-pointer text-xl"
               onClick={() => {
  showDeleteModal(record);
}}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-4" gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ margin: 0, color: "#11375B" }}>
              <UserOutlined style={{ marginRight: "12px", color: "#11375B" }} />
              সকল ইউজারের তালিকা
            </Title>
          </Col>
          <Col>
            <Link to="/tramessy/add-userForm">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="!bg-primary"
              >
                ইউজার
              </Button>
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

        {/* Table */}
        <Table
        size="small"
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
      </Card>
      <Modal
        visible={deleteModalVisible}
        title="ডিলিট কনফার্মেশন"
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="হ্যাঁ"
        cancelText="না"
        okButtonProps={{ danger: true }}
      >
        <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
        আপনি কি নিশ্চিত যে "{selectedUser?.name}" ইউজারকে ডিলিট করতে চান?
      </Modal>
    </div>
  );
};

export default AllUsers;
