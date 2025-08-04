
// import { useState } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   DatePicker,
//   Upload,
//   Button,
//   Typography,
//   Card,
//   Row,
//   Col,
//   Image,
//   message,
// } from "antd";
// import {
//   IdcardOutlined,
//   PhoneOutlined,
//   HomeOutlined,
//   FileTextOutlined,
//   UploadOutlined,
//   DeleteOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;
// const { Title } = Typography;

// const AddDriverForm = () => {
//   const [form] = Form.useForm();
//   const [previewImage, setPreviewImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const uploadProps = {
//     beforeUpload: (file) => {
//       const isImage = file.type.startsWith("image/");
//       if (!isImage) {
//         message.error("Only image files are allowed!");
//         return false;
//       }
//       const isLt5M = file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error("Image must be smaller than 5MB!");
//         return false;
//       }
//       setImageFile(file);
//       setPreviewImage(URL.createObjectURL(file));
//       return false;
//     },
//     showUploadList: false,
//   };

//   const onFinish = async (values) => {
//     try {
//       const formData = new FormData();
//       Object.keys(values).forEach((key) => {
//         if (key === "expire_date") {
//           formData.append(key, values[key].format("YYYY-MM-DD"));
//         } else if (key !== "license_image") {
//           formData.append(key, values[key]);
//         }
//       });
//       if (imageFile) formData.append("license_image", imageFile);

//       const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/driver`, formData);
//       if (response.data.status === "success") {
//         toast.success("Driver successfully added!");
//         form.resetFields();
//         setPreviewImage(null);
//         setImageFile(null);
//         navigate("/tramessy/driver-list");
//       } else {
//         toast.error("Server error: " + (response.data.message || "Unknown error"));
//       }
//     } catch (error) {
//       toast.error("Server error: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const removeImage = () => {
//     setPreviewImage(null);
//     setImageFile(null);
//   };

//   return (
//     <div className="mt-10 p-[10px]">
//       <Toaster />
//       <Card className="max-w-7xl mx-auto">
//         <Title level={4} className="text-primary mb-6">
//           Create Driver
//         </Title>

//         <Form form={form} layout="vertical" onFinish={onFinish} size="large">
//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Driver's Name"
//                 name="name"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter driver's name..." prefix={<IdcardOutlined />} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Mobile Number"
//                 name="contact"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter mobile number..." prefix={<PhoneOutlined />} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="NID Number"
//                 name="nid"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <InputNumber style={{ width: "100%" }} placeholder="Enter NID number..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item label="Emergency Contact" name="emergency_contact">
//                 <Input placeholder="Enter emergency contact..." />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Address"
//                 name="address"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter address..." prefix={<HomeOutlined />} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item label="Note" name="note">
//                 <Input placeholder="Enter note..." prefix={<FileTextOutlined />} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="License Number"
//                 name="license"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter license number..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Expiry Date"
//                 name="expire_date"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <DatePicker style={{ width: "100%" }} placeholder="Select expiry date" format="YYYY-MM-DD" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Status"
//                 name="status"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Select placeholder="Select status">
//                   <Option value="Active">Active</Option>
//                   <Option value="Inactive">Inactive</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item label="License Image" name="license_image">
//                 <Upload {...uploadProps} accept="image/*" listType="picture">
//                   <Button icon={<UploadOutlined />} className="border-primary text-primary">
//                     Upload Image
//                   </Button>
//                 </Upload>

//                 {previewImage && (
//                   <div className="relative inline-block max-w-xs mt-4">
//                     <Image
//                       src={previewImage}
//                       alt="Preview"
//                       style={{ borderRadius: 8, border: "1px solid #d9d9d9" }}
//                     />
//                     <Button
//                       danger
//                       icon={<DeleteOutlined />}
//                       size="small"
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 shadow-md"
//                     />
//                   </div>
//                 )}
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row>
//             <Col>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 icon={<CheckCircleOutlined />}
//                 className="!bg-primary"
//               >
//                 Submit
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default AddDriverForm;


// import { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   DatePicker,
//   Upload,
//   Button,
//   Typography,
//   Card,
//   Row,
//   Col,
//   Image,
//   message,
//   Spin
// } from "antd";
// import {
//   IdcardOutlined,
//   PhoneOutlined,
//   HomeOutlined,
//   FileTextOutlined,
//   UploadOutlined,
//   DeleteOutlined,
//   CheckCircleOutlined,
//   ArrowLeftOutlined
// } from "@ant-design/icons";
// import { useNavigate, useParams } from "react-router-dom";
// import dayjs from "dayjs";
// import api from "../utils/axiosConfig";

// const { Option } = Select;
// const { Title } = Typography;

// const DriverForm = ({ mode = "add" }) => {
//   const [form] = Form.useForm();
//   const [previewImage, setPreviewImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(mode === "edit");
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // Fetch driver data for edit mode
//   useEffect(() => {
//     if (mode === "edit" && id) {
//       const fetchDriver = async () => {
//         try {
//           const response = await api.get(`/api/driver/${id}`);
//           if (response.data.status === "success") {
//             const driver = response.data.data;
//             console.log(driver, 'driver data');
//             form.setFieldsValue({
//               ...driver,
//               expire_date: driver.expire_date ? dayjs(driver.expire_date) : null
//             });
//             if (driver.license_image_url) {
//               setPreviewImage(driver.license_image_url);
//             }
//           }
//         } catch (error) {
//           message.error("Failed to load driver data");
//           console.error(error);
//         } finally {
//           setInitialLoading(false);
//         }
//       };
//       fetchDriver();
//     }
//   }, [id, mode, form]);

//   const uploadProps = {
//     beforeUpload: (file) => {
//       const isImage = file.type.startsWith("image/");
//       if (!isImage) {
//         message.error("Only image files are allowed!");
//         return false;
//       }
//       const isLt5M = file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error("Image must be smaller than 5MB!");
//         return false;
//       }
//       setImageFile(file);
//       setPreviewImage(URL.createObjectURL(file));
//       return false;
//     },
//     showUploadList: false,
//   };

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       Object.keys(values).forEach((key) => {
//         if (values[key] !== undefined && values[key] !== null) {
//           if (key === "expire_date") {
//             formData.append(key, values[key].format("YYYY-MM-DD"));
//           } else if (key !== "license_image") {
//             formData.append(key, values[key]);
//           }
//         }
//       });
//       if (imageFile) formData.append("license_image", imageFile);

//       let response;
//       if (mode === "add") {
//         response = await api.post("/api/driver", formData);
//       } else {
//         response = await api.put(`/api/driver/${id}`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data"
//           }
//         });
//       }

//       if (response.data.status === "success") {
//         message.success(`Driver ${mode === "add" ? "added" : "updated"} successfully!`);
//         navigate("/tramessy/driver-list");
//       }
//     } catch (error) {
//       message.error(error.response?.data?.message || "An error occurred");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeImage = () => {
//     setPreviewImage(null);
//     setImageFile(null);
//     form.setFieldsValue({ license_image: null });
//   };

//   if (initialLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="mt-10 p-[10px]">
//       <Card className="max-w-7xl mx-auto">
//         <div className="flex items-center mb-6">
//           <Button
//             type="text"
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate("/tramessy/driver-list")}
//             className="flex items-center"
//           >
            
//           </Button>
//           <Title level={4} className="text-primary mt-2">
//             {mode === "add" ? "Create Driver" : "Update Driver"}
//           </Title>
          
          
//         </div>

//         <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Driver's Name"
//                 name="name"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter driver's name..." prefix={<IdcardOutlined />} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Mobile Number"
//                 name="contact"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter mobile number..." prefix={<PhoneOutlined />} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="NID Number"
//                 name="nid"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <InputNumber style={{ width: "100%" }} placeholder="Enter NID number..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item label="Emergency Contact" name="emergency_contact">
//                 <Input placeholder="Enter emergency contact..." />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Address"
//                 name="address"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter address..." prefix={<HomeOutlined />} />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item label="Note" name="note">
//                 <Input placeholder="Enter note..." prefix={<FileTextOutlined />} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="License Number"
//                 name="license"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Input placeholder="Enter license number..." />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Expiry Date"
//                 name="expire_date"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <DatePicker 
//                   style={{ width: "100%" }} 
//                   placeholder="Select expiry date" 
//                   format="YYYY-MM-DD" 
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col xs={24} md={12}>
//               <Form.Item
//                 label="Status"
//                 name="status"
//                 rules={[{ required: true, message: "Required" }]}
//               >
//                 <Select placeholder="Select status">
//                   <Option value="Active">Active</Option>
//                   <Option value="Inactive">Inactive</Option>
//                   <Option value="Suspended">Suspended</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={12}>
//               <Form.Item label="License Image" name="license_image">
//                 <Upload {...uploadProps} accept="image/*" listType="picture">
//                   <Button icon={<UploadOutlined />} className="border-primary text-primary">
//                     Upload Image
//                   </Button>
//                 </Upload>

//                 {previewImage && (
//                   <div className="relative inline-block max-w-xs mt-4">
//                     <Image
//                       src={previewImage}
//                       alt="Preview"
//                       style={{ borderRadius: 8, border: "1px solid #d9d9d9" }}
//                     />
//                     <Button
//                       danger
//                       icon={<DeleteOutlined />}
//                       size="small"
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 shadow-md"
//                     />
//                   </div>
//                 )}
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row justify="left">
//             <Col>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 loading={loading}
//                 icon={<CheckCircleOutlined />}
//                 className="!bg-primary"
//               >
//                 {mode === "add" ? "Create Driver" : "Update Driver"}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default DriverForm;

import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Upload,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Image,
  message,
  Spin
} from "antd";
import {
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  FileTextOutlined,
  UploadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import api from "../utils/axiosConfig";

const { Option } = Select;
const { Title } = Typography;

const DriverForm = ({ mode = "add" }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const navigate = useNavigate();
  const { id } = useParams();

  // Field validation rules - only require name and contact in update mode
  const getValidationRules = (fieldName) => {
    if (mode === "add") {
      // All fields required when adding new driver
      return [{ required: true, message: 'Required' }];
    } else {
      // Only name and contact required when updating
      return  [];
    }
  };

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchDriver = async () => {
        try {
          const response = await api.get(`/api/driver/${id}`);
          // if (response.data.status === "success") {
            const driver = response.data;
            console.log("Fetched Driver:", driver); 
            form.setFieldsValue({
              ...driver,
              expire_date: driver.expire_date ? dayjs(driver.expire_date) : null
            });
            if (driver.lincense_image) {
              setPreviewImage(driver.lincense_image);
            }
          // }
        } catch (error) {
          message.error("Failed to load driver data");
          console.error(error);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchDriver();
    }
  }, [id, mode, form]);

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Only image files are allowed!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      return false;
    },
    showUploadList: false,
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Only include fields that have values (for update mode)
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          if (key === "expire_date") {
            formData.append(key, values[key].format("YYYY-MM-DD"));
          } else if (key !== "lincense_image") {
            formData.append(key, values[key]);
          }
        }
      });
      
      if (imageFile) formData.append("lincense_image", imageFile);

      let response;
      if (mode === "add") {
        response = await api.post("/api/driver", formData);
      } else {
        response = await api.put(`/api/driver/${id}`, formData);
      }

      // if (response.data.status === "success") {
        message.success(`Driver ${mode === "add" ? "added" : "updated"} successfully!`);
        form.resetFields();
        navigate("/tramessy/driver-list");
      // }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    form.setFieldsValue({ license_image: null });
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className=" p-[10px]">
      <Card className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/tramessy/driver-list")}
            className="flex items-center"
          />
          <Title level={4} className="text-primary mt-2">
            {mode === "add" ? "Create Driver" : "Update Driver"}
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Driver's Name"
                name="driver_name"
                rules={getValidationRules('driver_name')}
              >
                <Input placeholder="Enter driver's name..." prefix={<IdcardOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mobile Number"
                name="driver_mobile"
                rules={getValidationRules('driver_mobile')}
              >
                <Input placeholder="Enter mobile number..." prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="NID Number"
                name="nid"
                rules={getValidationRules('nid')}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Enter NID number..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="License Number"
                name="lincense"
                rules={getValidationRules('lincense')}
              >
                <Input placeholder="Enter license number..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Expiry Date"
                name="expire_date"
                rules={getValidationRules('expire_date')}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  placeholder="Select expiry date" 
                  format="YYYY-MM-DD" 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={getValidationRules('address')}
              >
                <Input placeholder="Enter address..." prefix={<HomeOutlined />} />
              </Form.Item>
            </Col>
            
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Note" name="note">
                <Input placeholder="Enter note..." prefix={<FileTextOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={getValidationRules('status')}
              >
                <Select placeholder="Select status">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                  <Option value="Suspended">Suspended</Option>
                </Select>
              </Form.Item>
            </Col>
            
          </Row>

          {/* <Row gutter={16}>   
            <Col xs={24} md={12}>
              <Form.Item label="License Image" name="lincense_image">
                <Upload {...uploadProps} accept="image/*" listType="picture">
                  <Button icon={<UploadOutlined />} className="border-primary text-primary">
                    Upload Image
                  </Button>
                </Upload>

                {previewImage && (
                  <div className="relative inline-block max-w-xs mt-4">
                    <Image
                      src={previewImage}
                      alt="Preview"
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
            </Col>
          </Row> */}

          <Row justify="end">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<CheckCircleOutlined />}
                className="!bg-primary"
              >
                {mode === "add" ? "Create Driver" : "Update Driver"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default DriverForm;