// import React, { useState, useEffect, useRef } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Header from "../components/Shared/Header";
// import Footer from "../components/Shared/Footer";
// import Sidebar from "../components/SIdeBar";

// const Main = () => {
//   const location = useLocation();
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);

//   const hideMenu =
//     location.pathname.includes("/Login") ||
//     location.pathname.includes("/ResetPass");

//   // Close sidebar if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setMobileSidebarOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     // Cleanup event listener
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (hideMenu) {
//     return (
//       <div className="min-h-screen">
//         <Outlet />
//       </div>
//     );
//   }

//   return (
//     <div className="flex max-w-[1444px] h-full">
//   {/* Normal Sidebar */}
//   <div className=" h-full bg-white ">
//     <Sidebar />
//   </div>

//   {/* Main content automatically beside sidebar */}
//   <div className="flex-1 flex flex-col">
//     <Header setMobileSidebarOpen={setMobileSidebarOpen} />
//     <main className="flex-1 overflow-y-auto md:p-4" style={{ minHeight: 360 }}>
//       <Outlet />
//     </main>
//     <Footer />
//   </div>
// </div>

//   );
// };

// export default Main;


import React, { useEffect, useRef, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/SIdeBar";
import Header from "../components/Shared/Header";
import Footer from "../components/Shared/Footer";

const { Sider, Content } = Layout;

const Main = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const hideMenu =
    location.pathname.includes("/tramessy/Login") ||
    location.pathname.includes("/tramessy/ResetPass");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (hideMenu) {
    return (
      <div className="min-h-screen">
        <Outlet />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      {/* <Sider
        width={260}
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        className="bg-white shadow-md"
        style={{ height: "100vh", overflow: "auto", position: "sticky", top: 0 }}
      > */}
        <Sidebar />
      {/* </Sider> */}

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <div style={{ background: "#fff", zIndex: 10 }}>
          <Header setMobileSidebarOpen={setMobileSidebarOpen} />
        </div>

        {/* Content */}
        <Content className="bg-white px-2 sm:px-4  py-4 hide-scrollbar" style={{ flex: 1, overflowY: "auto", // Ensure content is scrollable
    maxHeight: "100vh", }}>
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Main;
