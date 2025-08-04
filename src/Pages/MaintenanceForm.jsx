
import { useEffect, useState } from "react"
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  Image,
} from "antd"
import { ToolOutlined, CalendarOutlined, UploadOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom"
import dayjs from "dayjs" // Using dayjs for date handling

import api from "../utils/axiosConfig" // Assuming api is imported from a separate file
import toast, { Toaster } from "react-hot-toast"

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const MaintenanceForm = ({ isUpdate = false }) => {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
const navigate = useNavigate()
  // Load Vehicles and Drivers
  useEffect(() => {
    api
      .get(`/api/vehicle`)
      .then((res) => setVehicles(res.data || []))
      .catch(() => message.error("Failed to load vehicles."))

    api
      .get(`/api/driver`)
      .then((res) => setDrivers(res.data || []))
      .catch(() => message.error("Failed to load drivers."))
  }, [])

  // Fetch maintenance data for update
  useEffect(() => {
    if (isUpdate && id) {
      setLoading(true)
      api
        .get(`/api/maintaince/${id}`)
        .then((res) => {
          const data = res.data
          form.setFieldsValue({
            date: data.date ? dayjs(data.date) : null,
            service_type: data.service_type,
            parts: data.parts,
            maintaince_type: data.maintaince_type,
            parts_price: data.parts_price,
            vehicle_no: data.vehicle_no,
            service_charge: data.service_charge,
            total_cost: data.total_cost,
            priority: data.priority,
            service_for: data.service_for,
            notes: data.notes,
            status: data.status, // Set the status field
          })
          setPreviewImage(data.receipt || null) // Assuming receipt is a URL
          setLoading(false)
        })
        .catch((error) => {
          message.error("Failed to load maintenance data for update.")
          setLoading(false)
        })
    }
  }, [isUpdate, id, form])

  const updateTotalCost = () => {
    const partsPrice = form.getFieldValue("parts_price") || 0
    const serviceCharge = form.getFieldValue("service_charge") || 0
    const total = Number(partsPrice) + Number(serviceCharge)
    form.setFieldsValue({ total_cost: total })
  }

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("Only image files can be uploaded!")
        return false
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error("Image size must be less than 5MB!")
        return false
      }
      setImageFile(file)
      setPreviewImage(URL.createObjectURL(file))
      return false // Prevent default upload behavior
    },
    showUploadList: false,
  }

  const removeImage = () => {
    setImageFile(null)
    setPreviewImage(null)
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("date", values.date.format("YYYY-MM-DD"))
      formData.append("service_type", values.service_type)
      formData.append("parts", values.parts)
      formData.append("maintaince_type", values.maintaince_type)
      formData.append("parts_price", values.parts_price)
      formData.append("vehicle_no", values.vehicle_no)
      formData.append("service_charge", values.service_charge || 0)
     
      formData.append("priority", values.priority)
      formData.append("notes", values.notes || "")
      formData.append("status", values.status) // Append the status field
 const calculatedTotalCost = Number(values.parts_price || 0) + Number(values.service_charge || 0)
      formData.append("total_cost", calculatedTotalCost)
      if (imageFile) {
        formData.append("receipt", imageFile)
      } else if (previewImage && isUpdate) {
      
      } else if (!previewImage && isUpdate) {
        // If it's an update and the image was removed, send a flag to clear it on the server
        formData.append("clear_receipt", "true")
      }

      let res
      if (isUpdate) {
  formData.append("_method", "PUT")
  res = await api.post(`/api/maintaince/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
} else {
        res = await api.post(`/api/maintaince`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      // if (res.data.status === "success") {
        toast.success("Information saved successfully!")
        form.resetFields()
        removeImage()
        navigate("/tramessy/maintenance")
      // } else {
      //   toast.error("Server error: " + (res.data.message || "Unknown Error"))
      // }
    } catch (error) {
      toast.error("Server error: " + (error.response?.data?.message || error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ">
      <Toaster/>
      <Card className="max-w-5xl mx-auto">
        <Title level={4} style={{ color: "#11375B" }}>
          <ToolOutlined className="mr-2" />
          {isUpdate ? "Update Maintenance Record" : "Add Maintenance Record"}
        </Title>
        <Form layout="vertical" form={form} size="large" onFinish={onFinish}>
          <Row gutter={[16, 16]} className="-space-y-4">
            {/* Maintenance Date */}
            <Col xs={24} md={12}>
              <Form.Item
                name="date"
                label="Maintenance Date"
                rules={[{ required: isUpdate?false:true, message: "Please select a date!" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Select Date"
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined style={{ color: "#11375B" }} />}
                  size="middle"
                />
              </Form.Item>
            </Col>
            {/* Service Type */}
            <Col xs={24} md={12}>
              <Form.Item
                name="service_type"
                label="Service Type"
                rules={[{ required: isUpdate?false:true, message: "Please select service type!" }]}
              >
                <Select placeholder="Select Service Type" size="middle">
                  <Option value="Maintenance">Maintenance</Option>
                  <Option value="General">General</Option>
                  <Option value="Emergency">Emergency</Option>
                  <Option value="Preventive">Preventive</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* Parts and Spares */}
            <Col xs={24} md={12}>
              <Form.Item
                name="parts"
                label="Parts and Spares"
                rules={[{ required: isUpdate?false:true, message: "Please select parts!" }]}
              >
                <Select placeholder="Select Parts" size="middle">
                  <Option value="EngineOil">Engine Oil</Option>
                  <Option value="Pistons">Pistons</Option>
                  <Option value="ABS_Sensors">ABS Sensors</Option>
                  <Option value="BrakeDrum">Brake Drum</Option>
                  <Option value="Tires">Tires</Option>
                  <Option value="Battery">Battery</Option>
                  <Option value="Filters">Filters</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* Maintenance Type */}
            <Col xs={24} md={12}>
              <Form.Item
                name="maintaince_type"
                label="Maintenance Type"
                rules={[{ required: isUpdate?false:true, message: "Please select maintenance type!" }]}
              >
                <Select placeholder="Select Maintenance Type" size="middle">
                  <Option value="EngineOil">Engine Oil Change</Option>
                  <Option value="Pistons">Piston Replacement</Option>
                  <Option value="ABS_Sensors">ABS Sensor Check</Option>
                  <Option value="BrakeDrum">Brake Drum Service</Option>
                  <Option value="TireRotation">Tire Rotation</Option>
                  <Option value="BatteryCheck">Battery Check</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* Parts Price */}
            <Col xs={24} md={12}>
              <Form.Item
                name="parts_price"
                label="Parts Price"
                rules={[{ required: isUpdate?false:true, message: "Please enter parts price!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(val) => `৳ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(val) => val.replace(/৳\s?|(,*)/g, "")}
                  size="middle"
                  onChange={updateTotalCost}
                />
              </Form.Item>
            </Col>
            {/* Vehicle Number */}
            <Col xs={24} md={12}>
              <Form.Item
                name="vehicle_no"
                label="Vehicle Number"
                rules={[{ required: isUpdate?false:true, message: "Please select vehicle number!" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Vehicle Number"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  size="middle"
                >
                  {vehicles.map((v) => (
                    <Option key={v.id} value={v.reg_no}>
                     {v.reg_zone}-{v.reg_serial}-{v.reg_no}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* Service Charge */}
            <Col xs={24} md={12}>
              <Form.Item name="service_charge" label="Service Charge">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(val) => `৳ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(val) => val.replace(/৳\s?|(,*)/g, "")}
                  size="middle"
                  onChange={updateTotalCost}
                />
              </Form.Item>
            </Col>
            {/* Total Cost */}
            <Col xs={24} md={12}>
              <Form.Item
                name="total_cost"
                label="Total Cost"
                rules={[{ required: isUpdate?false:true, message: "Please enter total cost!" }]}
              >
                <InputNumber
                  readOnly
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(val) => `৳ ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(val) => val.replace(/৳\s?|(,*)/g, "")}
                  size="middle"
                />
              </Form.Item>
            </Col>
            {/* Priority */}
            <Col xs={24} md={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: isUpdate?false:true, message: "Please select priority!" }]}
              >
                <Select placeholder="Select Priority" size="middle">
                  <Option value="High">
                    <span className="text-red-500 text-xl">●</span> High Priority
                  </Option>
                  <Option value="Medium">
                    <span className="text-yellow-500 text-xl">●</span> Medium Priority
                  </Option>
                  <Option value="Low">
                    <span className="text-green-500 text-xl">●</span> Low Priority
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            {/* Service For (Driver) */}
            {/* <Col xs={24} md={12}>
              <Form.Item name="service_for" label="Service For (Driver)">
                <Select
                  showSearch
                  allowClear
                  placeholder="Select Driver"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  size="middle"
                >
                  {drivers.map((d) => (
                    <Option key={d.id} value={d.name}>
                      {d.name} - {d.contact}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}
            {/* Status */}
            <Col xs={24} md={12}>
              <Form.Item name="status" label="Status" rules={[{ required: isUpdate?false:true, message: "Please select status!" }]}>
                <Select placeholder="Select Status" size="middle">
                  <Option value="completed">Completed</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="in_progress">In Progress</Option>
                </Select>
              </Form.Item>
            </Col>
            {/* Notes */}
            <Col xs={24} md={12}>
              <Form.Item name="notes" label="Notes" rules={[{ required: isUpdate?false:true, message: "Please Enter Note" }]}>
                <TextArea rows={1} placeholder="Add any notes here..." size="middle" />
              </Form.Item>
            </Col>
            {/* Upload Receipt */}
            {/* <Col xs={24}>
              <Form.Item label="Cash Memo / Receipt Image">
                <Upload {...uploadProps} accept="image/*" listType="picture">
                  <Button icon={<UploadOutlined />} className="border-primary text-primary">
                    Upload Image
                  </Button>
                </Upload>
                {previewImage && (
                  <div className="relative inline-block max-w-xs mt-4">
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      alt="Receipt Preview"
                      style={{ borderRadius: 8, border: "1px solid #d9d9d9" }}
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={removeImage}
                      className="absolute top-2 right-2 shadow-md"
                    />
                  </div>
                )}
              </Form.Item>
            </Col> */}
            
          </Row>
          {/* Submit */}
            <Row style={{justifyContent: "end"}}>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="middle"
                icon={<SaveOutlined />}
                className="!bg-primary"
              >
                {isUpdate ? "Update" : "Save"}
              </Button>

            </Row>
        </Form>
      </Card>
    </div>
  )
}

export default MaintenanceForm
