


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
        <Option value="4 Ton">4 Ton</Option>
  <Option value="3 Ton">3 Ton</Option>
  <Option value="22 Ton">22 Ton</Option>
  <Option value="7 Feet">7 Feet</Option>
  <Option value="9 Feet">9 Feet</Option>
  <Option value="12 Feet">12 Feet</Option>
  <Option value="14 Feet">14 Feet</Option>
  <Option value="16 Feet">16 Feet</Option>
  <Option value="18 Feet">18 Feet</Option>
  <Option value="20 Feet">20 Feet</Option>
  <Option value="23 Feet">23 Feet</Option>
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
                 <Option value="">Select zone...</Option>
      <Option value="Dhaka Metro">Dhaka Metro</Option>
      <Option value="Chatto Metro">Chatto Metro</Option>
      <Option value="Sylhet Metro">Sylhet Metro</Option>
      <Option value="Rajshahi Metro">Rajshahi Metro</Option>
      <Option value="Khulna Metro">Khulna Metro</Option>
      <Option value="Rangpur Metro">Rangpur Metro</Option>
      <Option value="Barisal Metro">Barisal Metro</Option>
      <Option value="Dhaka">Dhaka</Option>
      <Option value="Narayanganj">Narayanganj</Option>
      <Option value="Gazipur">Gazipur</Option>
      <Option value="Tangail">Tangail</Option>
      <Option value="Manikgonj">Manikgonj</Option>
      <Option value="Munshigonj">Munshigonj</Option>
      <Option value="Faridpur">Faridpur</Option>
      <Option value="Rajbari">Rajbari</Option>
      <Option value="Narsingdi">Narsingdi</Option>
      <Option value="Kishorgonj">Kishorgonj</Option>
      <Option value="Shariatpur">Shariatpur</Option>
      <Option value="Gopalgonj">Gopalgonj</Option>
      <Option value="Madaripur">Madaripur</Option>
      <Option value="Chattogram">Chattogram</Option>
      <Option value="Cumilla">Cumilla</Option>
      <Option value="Feni">Feni</Option>
      <Option value="Brahmanbaria">Brahmanbaria</Option>
      <Option value="Noakhali">Noakhali</Option>
      <Option value="Chandpur">Chandpur</Option>
      <Option value="Lokkhipur">Lokkhipur</Option>
      <Option value="Bandarban">Bandarban</Option>
      <Option value="Rangamati">Rangamati</Option>
      <Option value="CoxsBazar">CoxsBazar</Option>
      <Option value="Khagrasori">Khagrasori</Option>
      <Option value="Barisal">Barisal</Option>
      <Option value="Barguna">Barguna</Option>
      <Option value="Bhola">Bhola</Option>
      <Option value="Patuakhali">Patuakhali</Option>
      <Option value="Pirojpur">Pirojpur</Option>
      <Option value="Jhalokati">Jhalokati</Option>
      <Option value="Khulna">Khulna</Option>
      <Option value="Kustia">Kustia</Option>
      <Option value="Jashore">Jashore</Option>
      <Option value="Chuadanga">Chuadanga</Option>
      <Option value="Satkhira">Satkhira</Option>
      <Option value="Bagerhat">Bagerhat</Option>
      <Option value="Meherpur">Meherpur</Option>
      <Option value="Jhenaidah">Jhenaidah</Option>
      <Option value="Norail">Norail</Option>
      <Option value="Magura">Magura</Option>
      <Option value="Rangpur">Rangpur</Option>
      <Option value="Ponchogor">Ponchogor</Option>
      <Option value="Thakurgaon">Thakurgaon</Option>
      <Option value="Kurigram">Kurigram</Option>
      <Option value="Dinajpur">Dinajpur</Option>
      <Option value="Nilfamari">Nilfamari</Option>
      <Option value="Lalmonirhat">Lalmonirhat</Option>
      <Option value="Gaibandha">Gaibandha</Option>
      <Option value="Rajshahi">Rajshahi</Option>
      <Option value="Pabna">Pabna</Option>
      <Option value="Bagura">Bagura</Option>
      <Option value="Joypurhat">Joypurhat</Option>
      <Option value="Nouga">Nouga</Option>
      <Option value="Natore">Natore</Option>
      <Option value="Sirajgonj">Sirajgonj</Option>
      <Option value="Chapainawabganj">Chapainawabganj</Option>
      <Option value="Sylhet">Sylhet</Option>
      <Option value="Habiganj">Habiganj</Option>
      <Option value="Moulvibazar">Moulvibazar</Option>
      <Option value="Sunamgonj">Sunamgonj</Option>
      <Option value="Mymensingh">Mymensingh</Option>
      <Option value="Netrokona">Netrokona</Option>
      <Option value="Jamalpur">Jamalpur</Option>
      <Option value="Sherpur">Sherpur</Option>
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