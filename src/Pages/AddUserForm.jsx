

import React from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Card,
  Typography,
} from "antd";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const AddUserForm = () => {
  const [form] = Form.useForm();
  const navigate =  useNavigate();

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users`,
        formData
      );

      if (response.data.status === "success") {
        toast.success("ইউজার সফলভাবে যোগ হয়েছে!", { position: "top-right" });
        form.resetFields();
        navigate('/tramessy/all-users')
      } else {
        toast.error("সার্ভার ত্রুটি: " + (response.data.message || "অজানা সমস্যা"));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      toast.error("সার্ভার ত্রুটি: " + errorMessage);
    }
  };

  return (
    <div className="mt-10">
      <Toaster />
      <Card
        className="max-w-5xl mx-auto"
     
      >
         <Title level={4} style={{ color: "#11375B" }}className="flex gap-1 items-center">
          <BiUser className="mr-2" />
          ইউজার যোগ করুন
        </Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Row 1 */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="নাম "
                rules={[{ required: true, message: "নাম আবশ্যক!" }]}
              >
                <Input placeholder="নাম লিখুন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="মোবাইল "
                rules={[{ required: true, message: "মোবাইল আবশ্যক!" }]}
              >
                <Input type="tel" placeholder="মোবাইল নম্বর লিখুন" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="ইমেইল "
                rules={[
                  { required: true, message: "ইমেইল আবশ্যক!" },
                  { type: "email", message: "বৈধ ইমেইল দিন!" },
                ]}
              >
                <Input placeholder="ইমেইল লিখুন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="পাসওয়ার্ড "
                rules={[{ required: true, message: "পাসওয়ার্ড আবশ্যক!" }]}
              >
                <Input.Password placeholder="পাসওয়ার্ড লিখুন" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="কনফার্ম পাসওয়ার্ড "
                dependencies={["password"]}
                rules={[
                  { required: true, message: "কনফার্ম পাসওয়ার্ড আবশ্যক!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("পাসওয়ার্ড মেলেনি!");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="কনফার্ম পাসওয়ার্ড লিখুন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="role"
                label="ইউজারের ধরন "
                rules={[{ required: true, message: "ইউজারের ধরন নির্বাচন করুন!" }]}
              >
                <Select placeholder="ইউজারের ধরন নির্বাচন করুন">
                  <Option value="User">User</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="স্ট্যাটাস "
                rules={[{ required: true, message: "স্ট্যাটাস নির্বাচন করুন!" }]}
              >
                <Select placeholder="স্ট্যাটাস নির্বাচন করুন">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" className="!bg-primary">
              সাবমিট করুন
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddUserForm;
