// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { router } from "./Routes/Routes.jsx";
// import { RouterProvider } from "react-router-dom";
// import AuthProvider from "./providers/AuthProvider.jsx";
// createRoot(document.getElementById("root")).render(
//   <AuthProvider>
//     <StrictMode>
//       <RouterProvider router={router} />
//     </StrictMode>
//   </AuthProvider>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./Routes/Routes.jsx";
import { RouterProvider } from "react-router-dom"; // ✅ Only this, not BrowserRouter
import AuthProvider from "./providers/AuthProvider.jsx";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <AuthProvider> 
        <RouterProvider router={router} />
      </AuthProvider>
    </CookiesProvider>
  </StrictMode>
);
