
import { Form, Input, Button, Row, Col, Card, DatePicker, Select, Typography } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const AddBookingForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/bookings`, values);
      if (res.data.status === "success") {
        toast.success("বুকিং সফলভাবে যুক্ত হয়েছে");
        form.resetFields();
        navigate("/tramessy/booking");
      } else {
        toast.error("বুকিং ব্যর্থ");
      }
    } catch {
      toast.error("সার্ভার সমস্যা");
    }
  };

  return (
    <div className="mt-10">
      <Card className="max-w-6xl mx-auto">
        <Title level={4}>নতুন বুকিং</Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="customerName" label="কাস্টমারের নাম" rules={[{ required: true }]}>
                <Input placeholder="নাম লিখুন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="মোবাইল" rules={[{ required: true }]}>
                <Input placeholder="মোবাইল নম্বর" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="carName" label="গাড়ির নাম" rules={[{ required: true }]}>
                <Input placeholder="গাড়ির নাম" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="status" label="স্ট্যাটাস" rules={[{ required: true }]}>
                <Select placeholder="স্ট্যাটাস নির্বাচন করুন">
                  <Option value="Pending">Pending</Option>
                  <Option value="Confirmed">Confirmed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="startDate" label="শুরুর তারিখ" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="endDate" label="শেষ তারিখ" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
  <Col xs={24} md={12}>
    <Form.Item
      name="advancePayment"
      label="অ্যাডভান্স পরিশোধ (৳)"
      rules={[
        { required: true, message: "অ্যাডভান্স অ্যামাউন্ট আবশ্যক!" },
        {
          pattern: /^[0-9]+$/,
          message: "শুধুমাত্র সংখ্যা দিন",
        },
      ]}
    >
      <Input placeholder="যেমনঃ 2000" />
    </Form.Item>
  </Col>
  <Col xs={24} md={12}>
    <Form.Item
      name="totalAmount"
      label="টোটাল ভাড়া (৳)"
      rules={[
        { required: true, message: "অ্যাডভান্স অ্যামাউন্ট আবশ্যক!" },
        {
          pattern: /^[0-9]+$/,
          message: "শুধুমাত্র সংখ্যা দিন",
        },
      ]}
    >
      <Input placeholder="যেমনঃ 2000" />
    </Form.Item>
  </Col>
</Row>

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

export default AddBookingForm;
