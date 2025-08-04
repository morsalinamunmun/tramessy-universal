
import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  DatePicker, 
  Card, 
  Typography,
  message, 
  Row
} from "antd";
import { FireOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/axiosConfig";

const { Option } = Select;
const { Title } = Typography;

const FuelForm = ({ isUpdate = false }) => {
  const [form] = Form.useForm();
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Calculate total price
  const onValuesChange = () => {
    const quantity = parseFloat(form.getFieldValue("quantity")) || 0;
    const price = parseFloat(form.getFieldValue("unit_price")) || 0;
    form.setFieldsValue({ total_cost: (quantity * price).toFixed(2) });
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          api.get("/api/vehicle"),
          api.get("/api/driver")
        ]);
        
        setVehicles(vehiclesRes.data);
        setDrivers(driversRes.data);

        // If update mode, fetch fuel data
        if (isUpdate && id) {
          const fuelRes = await api.get(`/api/fuel/${id}`);
          const fuelData = fuelRes.data;
          
          form.setFieldsValue({
            ...fuelData,
            date: moment(fuelData.date),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load initial data");
      }
    };

    fetchInitialData();
  }, [id, isUpdate, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        total_price: (values.quantity * values.price).toFixed(2)
      };

      if (isUpdate && id) {
        await api.put(`/api/fuel/${id}`, formData);
        toast.success("Fuel record updated successfully!");
      } else {
        await api.post("/api/fuel", formData);
        toast.success("Fuel record added successfully!");
      }
      
      form.resetFields();
      navigate("/tramessy/fuel");
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 ">
      <Toaster position="top-center" />
      <Card className="max-w-6xl mx-auto">
        <Title level={4} className="text-left text-primary">
          <FireOutlined className="mr-2 text-primary" />
          {isUpdate ? "Update Fuel Record" : "Add Fuel Record"}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={onValuesChange}
        >
          <div className="grid md:grid-cols-2 gap-x-4">
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: isUpdate? false:true, message: "Please select date" }]}
            >
              <DatePicker 
                className="w-full" 
                format="YYYY-MM-DD" 
              />
            </Form.Item>

            <Form.Item
              label="Vehicle Number"
              name="vehicle_no"
              rules={[{ required: isUpdate? false:true, message: "Please select vehicle" }]}
            >
              <Select placeholder="Select vehicle">
                {vehicles.map((v) => (
                  <Option key={v.id} value={v.reg_no}>
                    {v.reg_zone}-{v.reg_serial}-{v.reg_no}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Driver Name"
              name="driver_name"
              rules={[{ required: isUpdate? false:true, message: "Please select driver" }]}
            >
              <Select placeholder="Select driver">
                {drivers.map((d) => (
                  <Option key={d.id} value={d.driver_name}>
                    {d.driver_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item 
              label="Trip ID/Invoice No" 
              name="trip_id_invoice_no"
            >
              <Input placeholder="Enter trip ID/invoice number" />
            </Form.Item> */}

            <Form.Item
              label="Pump Name & Address"
              name="pump_name"
              rules={[{ required: isUpdate? false:true, message: "Please enter pump details" }]}
            >
              <Input placeholder="Enter pump name and address" />
            </Form.Item>

            <Form.Item 
              label="Fuel Capacity" 
              name="fuel_capacity"
            >
              <Input placeholder="Enter fuel capacity" type="number" />
            </Form.Item>

            <Form.Item
              label="Fuel Type"
              name="fuel_type"
              rules={[{ required: isUpdate? false:true, message: "Please select fuel type" }]}
            >
              <Select placeholder="Select fuel type">
                <Option value="Octane">Octane</Option>
                <Option value="Gas">Gas</Option>
                <Option value="Petrol">Petrol</Option>
                <Option value="Diesel">Diesel</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Quantity (Liters)"
              name="quantity"
              rules={[{ required: isUpdate? false:true, message: "Please enter quantity" }]}
            >
              <Input placeholder="Enter quantity" type="number" step="0.01" />
            </Form.Item>

            <Form.Item
              label="Price per Liter"
              name="unit_price"
              rules={[{ required: isUpdate? false:true, message: "Please enter price" }]}
            >
              <Input placeholder="Enter price per liter" type="number" step="0.01" />
            </Form.Item>

            <Form.Item label="Total Amount" name="total_cost">
              <Input
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </Form.Item>
          </div>
          <Row style={{ justifyContent: "end"}}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!bg-primary"
                icon={<SaveOutlined />}
              >
                {isUpdate ? "Update Record" : "Submit"}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default FuelForm;