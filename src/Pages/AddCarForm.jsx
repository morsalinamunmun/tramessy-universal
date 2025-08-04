


import { useEffect, useState } from "react"
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  message,
} from "antd"
import {
  CarOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import axios from "axios"
import moment from "moment"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import api from "../utils/axiosConfig"

const { Title, Text } = Typography
const { Option } = Select

const CarForm = ({ mode = "add" }) => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [drivers, setDrivers] = useState([])
  const navigate = useNavigate()
const [vehicleCategory, setVehicleCategory] = useState("")

  // serial
 const registrationSerials = [
  "Ka", "Kha", "Ga", "Gha", "Nga",
  "Cha", "Chha", "Ja", "Jha", "Nya",
  "Ta", "Tha", "Da", "Dha", "Na"
];
  useEffect(() => {
    fetchDrivers()
    if (mode === "edit" && id) {
      fetchCarData()
    }
  }, [id, mode])

  const fetchDrivers = async () => {
    try {
      const response = await api.get(`/api/driver`)
      setDrivers(response.data || [])
    } catch (error) {
      message.error("Failed to load driver data.")
    }
  }

  const fetchCarData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/vehicle/${id}`)
      const carData = response.data
      
      // Format date fields
      const dateFields = ['date', 'reg_date', 'tax_date', 'route_per_date', 'fitness_date']
      dateFields.forEach(field => {
        if (carData[field]) {
          carData[field] = moment(carData[field])
        }
      })
      
      form.setFieldsValue(carData)
    } catch (error) {
      message.error("Failed to load car data.")
    } finally {
      setLoading(false)
    }
  }

//   const onFinish = async (values) => {
//     setLoading(true)
//     try {
//       const formData = new FormData()
//       for (const key in values) {
//         if (values[key]) {
//           formData.append(
//             key,
//             moment.isMoment(values[key]) ? values[key].format("YYYY-MM-DD") : values[key]
//           )
//         }
//       }

//       let response
//       if (mode === "add") {
//         response = await api.post(`/api/vehicle`, formData,  {
//   headers: { 'Content-Type': 'multipart/form-data' }
// })
//       } else {
//         response = await api.put(`/api/vehicle/${id}`, formData,  {
//   headers: { 'Content-Type': 'multipart/form-data' }
// })
//       }

//       // if (response.data.status === "success") {
//         toast.success(`Vehicle ${mode === "add" ? 'saved' : 'updated'} successfully!`)
//         form.resetFields()
//         navigate("/tramessy/car-list")
//       // } else {
//       //   message.error("Server error: " + (response.data.message || "Unknown error"))
//       // }
//     } catch (error) {
//       message.error("Server error: " + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

const onFinish = async (values) => {
  setLoading(true);
  try {
    // Prepare payload object (not FormData) for clarity
    const payload = { ...values };

    // Format all date fields
    const dateFields = ['date', 'reg_date', 'tax_date', 'route_per_date', 'fitness_date'];
    dateFields.forEach(field => {
      if (values[field] && moment.isMoment(values[field])) {
        payload[field] = values[field].format("YYYY-MM-DD");
      }
    });

    let response;
    if (mode === "add") {
      response = await api.post(`/api/vehicle`, payload);
    } else {
      response = await api.put(`/api/vehicle/${id}`, payload);
    }

    toast.success(`Vehicle ${mode === "add" ? "saved" : "updated"} successfully!`);
    form.resetFields();
    navigate("/tramessy/car-list");
  } catch (error) {
    message.error("Server error: " + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen px-4">
      <Toaster/>
      <Card className="max-w-6xl mx-auto">
        <Title level={4} className="text-left text-primary">
          <CarOutlined className="mr-2 text-primary" /> 
          {mode === "add" ? "Add" : "Edit"} Vehicle Information
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          initialValues={{ status: "Active" }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item label=" Date" name="date" rules={[{ required: mode==="edit"? false:true }]}> 
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  size="middel"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Vehicle Name"
                name="vehicle_name"
                rules={[{ required: mode==="edit"? false:true, message: "Please enter the vehicle name" }]}
              >
                <Input size="middel" placeholder="Enter vehicle name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Driver Name"
                name="driver_name"
                rules={[{ required: mode==="edit"? false:true, message: "Please select a driver!" }]}
              >
                <Select size="middel" placeholder="Select driver" showSearch>
                  {drivers.map((d) => (
                    <Option key={d.id} value={d.driver_name}>
                      {d.driver_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item label="Vehicle Type" name="vehicle_category" rules={[{ required: mode==="edit"? false:true }]}> 
                <Select placeholder="Select vehicle type" size="middel" onChange={(value) => setVehicleCategory(value)}>
                  <Option value="Car">Car</Option>
                  <Option value="Truck">Truck</Option>
                  <Option value="Pickup">Pickup</Option>
                  <Option value="Covered van">Covered van</Option>
                  <Option value="Freezer van">Freezer van</Option>
                  <Option value="Trailor">Trailor</Option>
                </Select>
              </Form.Item>
            </Col>
           {vehicleCategory === "Car" ? (
  <Col xs={24} md={8}>
    <Form.Item
      label="Vehicle Seat"
      name="vehicle_size"
      rules={[{ required: mode === "edit" ? false : true }]}
    >
      <Select placeholder="Select seat count" size="middle">
        <Option value="4">4</Option>
        <Option value="7">7</Option>
        <Option value="11">11</Option>
      </Select>
    </Form.Item>
  </Col>
) : (
  <Col xs={24} md={8}>
    <Form.Item
      label="Vehicle Size"
      name="vehicle_size"
      rules={[{ required: mode === "edit" ? false : true }]}
    >
      <Select placeholder="Select size" size="middle">
        <Option value="Large">Large</Option>
        <Option value="Middle">Middle</Option>
        <Option value="Small">Small</Option>
      </Select>
    </Form.Item>
  </Col>
)}

            <Col xs={24} md={8}>
              <Form.Item
                label="Fuel Capacity"
                name="fuel_capcity"
                rules={[{ required: mode==="edit"? false:true, message: "Please enter the Fuel Capacity" }]}
              >
                <Input type="number" size="middel" placeholder="Enter Fuel Capacity" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item label="Registration Number" name="reg_no" rules={[{ required: mode==="edit"? false:true }]}> 
                <Input placeholder="Enter Registration Number" size="middel"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
  label="Registration Serial"
  name="reg_serial"
  rules={[{ required: mode === "edit" ? false : true }]}
>
  <Select placeholder="Select serial" size="middle" showSearch optionFilterProp="children">
    {registrationSerials.map((serial) => (
      <Option key={serial} value={serial}>
        {serial}
      </Option>
    ))}
  </Select>
</Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Registration Zone" name="reg_zone" rules={[{ required: mode==="edit"? false:true }]}> 
                <Select placeholder="Select zone" size="middel">
                  <Option value="Dhaka">Dhaka</Option>
                  <Option value="Chattogram">Chattogram</Option>
                  <Option value="Sylhet">Sylhet</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item label="Registration Date" name="reg_date" rules={[{ required: mode==="edit"? false:true }]}> 
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  size="middel"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Tax Expiry Date" name="tax_date" rules={[{ required: mode==="edit"? false:true }]}> 
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  size="middel"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={8}>
              <Form.Item label="Road Permit Date" name="route_per_date" rules={[{ required: mode==="edit"? false:true }]}> 
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  size="middel"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Fitness Date" name="fitness_date" rules={[{ required: mode==="edit"? false:true }]}> 
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  size="middel"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Status" name="status" rules={[{ required: mode==="edit"? false:true }]}> 
                <Select size="middel">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row style={{ marginTop: "32px", justifyContent: "end" }}>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="middel"
                className="!bg-primary w-full max-w-xs mx-auto"
              >
                {mode === "add" ? "Submit Vehicle" : "Update Vehicle"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default CarForm