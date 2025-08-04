// import React from "react";
// import { useForm } from "react-hook-form";
// import "react-datepicker/dist/react-datepicker.css";
// import { MdOutlineArrowDropDown } from "react-icons/md";
// import toast, { Toaster } from "react-hot-toast";
// import axios from "axios";
// import { useLoaderData, useNavigate } from "react-router-dom";
// import BtnSubmit from "../../components/Button/BtnSubmit";

// const UpdateUsersForm = () => {
//   const navigate = useNavigate();
//   const updateUserLoaderData = useLoaderData();
//   const {
//     id,
//     name,
//     phone,
//     email,
//     password: initialPassword,
//     role,
//     status,
//   } = updateUserLoaderData.data;

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const password = watch("password");

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_BASE_URL}/api/users/${id}`,
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const resData = response.data;

//       if (resData.status === "success") {
//         toast.success("ইউজার সফলভাবে আপডেট হয়েছে!", { position: "top-right" });
//         navigate("/tramessy/all-users")
//       } else {
//         toast.error("সার্ভার ত্রুটি: " + (resData.message || "অজানা সমস্যা"));
//       }
//     } catch (error) {
//       console.error(error);
//       const errorMessage =
//         error.response?.data?.message || error.message || "Unknown error";
//       toast.error("সার্ভার ত্রুটি: " + errorMessage);
//     }
//   };

//   return (
//     <div className="mt-10">
//       <Toaster />
//       <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
//         ইউজার আপডেট করুন
//       </h3>
//       <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Row 1 */}
//           <div className="md:flex justify-between gap-3">
//             <div className="w-full">
//               <label className="text-primary text-sm font-semibold">
//                 নাম *
//               </label>
//               <input
//                 {...register("name")}
//                 defaultValue={name}
//                 type="text"
//                 placeholder="নাম..."
//                 className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
//               />
//             </div>
//             <div className="w-full relative">
//               <label className="text-primary text-sm font-semibold">
//                 মোবাইল *
//               </label>
//               <input
//                 {...register("phone")}
//                 defaultValue={phone}
//                 type="text"
//                 placeholder="মোবাইল..."
//                 className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="md:flex justify-between gap-3">
//             <div className="w-full relative">
//               <label className="text-primary text-sm font-semibold">
//                 ইমেইল *
//               </label>
//               <input
//                 {...register("email")}
//                 defaultValue={email}
//                 type="email"
//                 placeholder="ইমেইল..."
//                 className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
//               />
//             </div>
//             <div className="mt-3 md:mt-0 w-full relative">
//               <label className="text-primary text-sm font-semibold">
//                 পাসওয়ার্ড
//               </label>
//               <input
//                 {...register("password", { required: "পাসওয়ার্ড আবশ্যক" })}
//                 defaultValue={initialPassword}
//                 type="password"
//                 placeholder="পাসওয়ার্ড..."
//                 className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//             <div className="mt-3 md:mt-0 w-full relative">
//               <label className="text-primary text-sm font-semibold">
//                 কনফার্ম পাসওয়ার্ড
//               </label>
//               <input
//                 type="password"
//                 placeholder="কনফার্ম পাসওয়ার্ড..."
//                 {...register("confirmPassword", {
//                   required: "কনফার্ম পাসওয়ার্ড আবশ্যক",
//                   validate: (value) =>
//                     value === password || "পাসওয়ার্ড মেলেনি",
//                 })}
//                 className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
//               />
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Row 3 */}
//           <div className="md:flex justify-between gap-3">
//             <div className="w-full relative">
//               <label className="text-primary text-sm font-semibold">
//                 ইউজারের ধরন
//               </label>
//               <select
//                 {...register("role")}
//                 className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
//               >
//                 <option value={role}>{role}</option>
//                 <option value="User">User</option>
//                 <option value="Admin">Admin</option>
//               </select>
//               <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
//             </div>
//             <div className="mt-3 md:mt-0 relative w-full">
//               <label className="text-primary text-sm font-semibold">
//                 স্ট্যাটাস
//               </label>
//               <select
//                 {...register("status")}
//                 className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
//               >
//                 <option value={status}>{status}</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//               <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="mt-6">
//             <BtnSubmit>সাবমিট করুন</BtnSubmit>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateUsersForm;


import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import { useNavigate, useLoaderData } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BiUser } from "react-icons/bi";

const { Title } = Typography;
const { Option } = Select;

const UpdateUsersForm = () => {
  const navigate = useNavigate();
  const updateUserLoaderData = useLoaderData();

  const { id, name, phone, email, password, role, status } =
    updateUserLoaderData.data;

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/users/${id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("ইউজার সফলভাবে আপডেট হয়েছে!", {
          position: "top-right",
        });
        navigate("/tramessy/all-users");
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
      <Card className="">
        <Title level={4} className="text-left !text-primary flex items-center">
                  <BiUser className="mr-2 !text-primary" /> ইউজার আপডেট করুন
                </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name,
            phone,
            email,
            password,
            confirmPassword: password,
            role,
            status,
          }}
        >
          {/* Row 1 */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="নাম"
                rules={[{ required: true, message: "নাম আবশ্যক" }]}
              >
                <Input placeholder="নাম লিখুন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="মোবাইল"
                rules={[{ required: true, message: "মোবাইল নাম্বার আবশ্যক" }]}
              >
                <Input placeholder="মোবাইল নাম্বার লিখুন" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="ইমেইল"
                rules={[{ required: true, message: "ইমেইল আবশ্যক" }]}
              >
                <Input type="email" placeholder="ইমেইল লিখুন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="পাসওয়ার্ড"
                rules={[{ required: true, message: "পাসওয়ার্ড আবশ্যক" }]}
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
                label="কনফার্ম পাসওয়ার্ড"
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "কনফার্ম পাসওয়ার্ড আবশ্যক",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("পাসওয়ার্ড মেলেনি");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="পুনরায় পাসওয়ার্ড দিন" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="role"
                label="ইউজারের ধরন"
                rules={[{ required: true, message: "ভূমিকা আবশ্যক" }]}
              >
                <Select placeholder="ভূমিকা নির্বাচন করুন">
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
                label="স্ট্যাটাস"
                rules={[{ required: true, message: "স্ট্যাটাস আবশ্যক" }]}
              >
                <Select placeholder="স্ট্যাটাস নির্বাচন করুন">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="!bg-primary">
              সাবমিট করুন
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateUsersForm;
