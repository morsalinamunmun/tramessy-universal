
// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   DatePicker,
//   Form,
//   Input,
//   Select,
//   Row,
//   Col,
//   Typography,
//   Card,
//   Button,
// } from "antd";
// import {
//   CarOutlined,
//   SaveOutlined,
// } from "@ant-design/icons";
// import { useNavigate, useParams } from "react-router-dom";

// const { Option } = Select;
// const { Title } = Typography;

// const TripForm = ({ isUpdate = false }) => {
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [drivers, setDrivers] = useState([]);
//   const [vehicles, setVehicles] = useState([]);

//   // Calculate totals
//   const commission = parseFloat(Form.useWatch('driver_percentage', form) || 0);
//   const fuel = parseFloat(Form.useWatch('fuel_price', form) || 0);
//   const gas = parseFloat(Form.useWatch('gas_price', form) || 0);
//   const totalDemurrage = parseFloat(Form.useWatch('demarage', form) || 0);
//   const other = parseFloat(Form.useWatch('other_expenses', form) || 0);
//   const totalCost = commission + fuel + gas + totalDemurrage + other;

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // Fetch vehicles and drivers
//         const [vehiclesRes, driversRes] = await Promise.all([
//           axios.get(`${import.meta.env.VITE_BASE_URL}/api/vehicle`),
//           axios.get(`${import.meta.env.VITE_BASE_URL}/api/driver`)
//         ]);
        
//         setVehicles(vehiclesRes.data.data);
//         setDrivers(driversRes.data.data);

//         // If update mode, fetch trip data
//         if (isUpdate && id) {
//           const tripRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/trip/${id}`);
//           const tripData = tripRes.data.data;
          
//           form.setFieldsValue({
//             ...tripData,
//             trip_date: tripData.trip_date,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load initial data");
//       }
//     };

//     fetchInitialData();
//   }, [id, isUpdate, form]);

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       let response;
//       const formData = new FormData();
      
//       // Append all form values to formData
//       Object.entries(values).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       if (isUpdate && id) {
//         // Update existing trip
//         response = await axios.post(
//           `${import.meta.env.VITE_BASE_URL}/api/trip/${id}`,
//           formData
//         );
//       } else {
//         // Create new trip
//         response = await axios.post(
//           `${import.meta.env.VITE_BASE_URL}/api/trip`,
//           formData
//         );
//       }

//       if (response.data.status === "success") {
//         toast.success(isUpdate ? "Trip updated successfully!" : "Trip added successfully!");
//         form.resetFields();
//         navigate("/tramessy/trip-list");
//       } else {
//         throw new Error(response.data.message || "Unknown error");
//       }
//     } catch (error) {
//       toast.error(`Error: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-10">
//       <Toaster position="top-center" reverseOrder={false} />
//       <Card className="shadow">
//         <Title level={4} className="text-left text-primary">
//           <CarOutlined className="mr-2 text-primary" /> 
//           {isUpdate ? "Update Trip" : "Add New Trip"}
//         </Title>
        
//         <Form
//           layout="vertical"
//           onFinish={handleSubmit}
//           form={form}
//         >
//           {/* Trip and Destination Section */}
//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item 
//                 label="Date" 
//                 name="trip_date" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input type="date" />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item 
//                 label="Trip Time" 
//                 name="trip_time" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Trip time..." />
//               </Form.Item>
//             </Col>
//           </Row>
          
//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item 
//                 label="Pickup Point" 
//                 name="load_point" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Load point..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item 
//                 label="Drop Point" 
//                 name="unload_point" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Unload point..." />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* Vehicle and Driver Information */}
//           <Row gutter={16}>
//             <Col xs={24} md={8}>
//               <Form.Item 
//                 label="Vehicle Number" 
//                 name="vehicle_number" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Select placeholder="Select vehicle number">
//                   {vehicles.map((v) => (
//                     <Option key={v.registration_number} value={v.registration_number}>
//                       {v.registration_number}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={8}>
//               <Form.Item 
//                 label="Driver Name" 
//                 name="driver_name" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Select
//                   placeholder="Select driver"
//                   onChange={(value) => {
//                     const driver = drivers.find((d) => d.name === value);
//                     form.setFieldsValue({ 
//                       driver_contact: driver?.contact || "" 
//                     });
//                   }}
//                 >
//                   {drivers.map((d) => (
//                     <Option key={d.name} value={d.name}>{d.name}</Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={8}>
//               <Form.Item 
//                 label="Driver Mobile" 
//                 name="driver_contact" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Driver mobile..." />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* Trip Expenses */}
//           <Row gutter={16}>
//             <Col xs={24} md={8}>
//               <Form.Item 
//                 label="Driver Commission" 
//                 name="driver_percentage" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Commission..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={8}>
//               <Form.Item label="Fuel Cost" name="fuel_price">
//                 <Input placeholder="Fuel cost..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={8}>
//               <Form.Item label="Gas Cost" name="gas_price">
//                 <Input placeholder="Gas cost..." />
//               </Form.Item>
//             </Col>
//           </Row>
          
//           <Row gutter={16}>
//             <Col xs={24} md={8}>
//               <Form.Item label="Other Expenses" name="other_expenses">
//                 <Input placeholder="Other expenses..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={8}>
//               <Form.Item 
//                 label="Waiting Charge" 
//                 name="demarage" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Waiting charge..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={8}>
//               <Form.Item label="Total Cost">
//                 <Input 
//                   readOnly 
//                   value={totalCost.toFixed(2)} 
//                   className="bg-gray-100 cursor-not-allowed" 
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* Customer and Payment Information */}
//           <Row gutter={16}>
//             <Col xs={24} md={6}>
//               <Form.Item 
//                 label="Customer Name" 
//                 name="customer" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Customer name..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={6}>
//               <Form.Item 
//                 label="Customer Mobile" 
//                 name="customer_mobile" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Mobile..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={6}>
//               <Form.Item 
//                 label="Trip Fare" 
//                 name="trip_price" 
//                 rules={[{ required: true, message: "Required field" }]}
//               >
//                 <Input placeholder="Trip fare..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={6}>
//               <Form.Item label="Advance Payment" name="advance">
//                 <Input placeholder="Advance payment..." />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row style={{ marginTop: "32px" }}>
//             <Col>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 icon={<SaveOutlined />}
//                 size="middle"
//                 className="!bg-primary w-full max-w-xs mx-auto"
//               >
//                 {isUpdate ? "Update Trip" : "Save Trip"}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default TripForm;


import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  DatePicker,
  Form,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Card,
  Button,
  InputNumber,
} from "antd";
import { CarOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import api from "../utils/axiosConfig";

const { Option } = Select;
const { Title } = Typography;

const TripForm = ({ isUpdate = false }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Calculate totals
 const calculateTotals = (changedValues, allValues) => {
  const {
    commision = 0,
    fuel_cost = 0,
    toll_cost = 0,
    police_cost = 0,
    labour = 0,
    others = 0,
    demrage_day = 0,
    demrage_rate = 0,
  } = allValues;

  const demrageTotal = parseFloat(demrage_day || 0) * parseFloat(demrage_rate || 0);
  const totalExp = 
    parseFloat(commision || 0) +
    parseFloat(fuel_cost || 0) +
    parseFloat(toll_cost || 0) +
    parseFloat(police_cost || 0) +
    parseFloat(labour || 0) +
    parseFloat(others || 0) +
    demrageTotal;

  form.setFieldsValue({
    demrage_total: demrageTotal,
    total_exp: totalExp,
  });
};


  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch vehicles and drivers
        const [vehiclesRes, driversRes] = await Promise.all([
          api.get(`/api/vehicle`),
          api.get(`/api/driver`)
        ]);
        
        setVehicles(vehiclesRes.data);
        setDrivers(driversRes.data);

        // If update mode, fetch trip data
        if (isUpdate && id) {
          const tripRes = await api.get(`/api/trip/${id}`);
          const tripData = tripRes.data;
          
          // Format date fields
          const formattedData = {
            ...tripData,
            date: moment(tripData.date)
          };
          
          form.setFieldsValue(formattedData);
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
      // Format date before submission
      const formattedValues = {
        ...values,
        date: moment(values.date).format('YYYY-MM-DD')
      };

      if (isUpdate && id) {
        // Update existing trip
        await api.put(`/api/trip/${id}`, formattedValues);
        toast.success("Trip updated successfully!");
      } else {
        // Create new trip
        await api.post(`/api/trip`, formattedValues);
        toast.success("Trip added successfully!");
      }
      
      form.resetFields();
      navigate("/tramessy/trip-list");
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="shadow">
        <Title level={4} className="text-left text-primary">
          <CarOutlined className="mr-2 text-primary" /> 
          {isUpdate ? "Update Trip" : "Add New Trip"}
        </Title>
        
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          onValuesChange={calculateTotals}
        >
          {/* Trip Information Section */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Date" 
                name="date" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Load Point" 
                name="load_point" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Input placeholder="Enter load point" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Unload Point" 
                name="unload_point" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Input placeholder="Enter unload point" />
              </Form.Item>
            </Col>
          </Row>

          {/* Vehicle and Driver Information */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Vehicle Number" 
                name="vehicle_no" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Select placeholder="Select vehicle">
                  {vehicles.map((v) => (
                    <Option key={v.id} value={v.reg_no}>
                     {v.reg_zone}-{v.reg_serial}-{v.reg_no}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Driver Name" 
                name="driver_name" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Select
                  placeholder="Select driver"
                  onChange={(value) => {
                    const driver = drivers.find((d) => d.driver_name === value);
                    form.setFieldsValue({ 
                      driver_contact: driver?.contact_number || "" 
                    });
                  }}
                >
                  {drivers.map((d) => (
                    <Option key={d.id} value={d.driver_name}>{d.driver_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={8}>
              <Form.Item 
                label="Driver Contact" 
                name="driver_contact" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Input type="number" placeholder="Driver contact number" />
              </Form.Item>
            </Col> */}
          </Row>

          {/* Customer Information */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Customer Name" 
                name="customer_name" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Customer Mobile" 
                name="customer_mobile" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Input placeholder="Enter customer mobile" />
              </Form.Item>
            </Col>
          </Row>

          {/* Financial Information */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Rent Amount" 
                name="Rent_amount" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter rent amount" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Advanced Payment" 
                name="advanced" 
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter advance amount" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Commission" 
                name="commision" 
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter commission" 
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Expenses Section */}
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item label="Fuel Cost" name="fuel_cost">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter fuel cost" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Toll Cost" name="toll_cost">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter toll cost" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Police Cost" name="police_cost">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter police cost" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Labour Cost" name="labour">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter labour cost" 
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Demurrage Section */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Demarage Days" name="demrage_day">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter days" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Demarage Rate" name="demrage_rate">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter rate per day" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Total Demarage" name="demrage_total">
                <InputNumber 
                  style={{ width: '100%' }} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Other Expenses */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Other Expenses" name="others">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter other expenses" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Total Expenses" name="total_exp">
                <InputNumber 
                  style={{ width: '100%' }} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item 
                label="Status" 
                name="status" 
                rules={[{ required: true, message: "Required field" }]}
              >
                <Select placeholder="Select status">
                  <Option value="completed">Completed</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Status */}

          <Row style={{ marginTop: "32px", justifyContent: "end" }}>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="middle"
                className="!bg-primary w-full max-w-xs mx-auto"
              >
                {isUpdate ? "Update Trip" : "Save Trip"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default TripForm;