
// // src/providers/AuthProvider.jsx
// import { createContext, useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Load token on first render
//   useEffect(() => {
//     const token = Cookies.get("auth_token");
//     if (token) {
//       fetchUser(token);
//     }
//   }, []);

//   useEffect(() => {
//   const token = Cookies.get("auth_token");
//   if (token) {
//     setIsAuthenticated(true);
//     // You might want to store the email in localStorage or cookies during login
//     const userEmail = localStorage.getItem('user_email');
//     if (userEmail) {
//       setUser({
//         email: userEmail,
//         name: userEmail.split('@')[0]
//       });
//     }
//   }
// }, []);
 
//   // Login method
// // src/providers/AuthProvider.jsx
// const login = async (email, password) => {
//   try {
//     const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/login`, {
//       email,
//       password,
//     });

//     const { token } = res.data;
//     Cookies.set("auth_token", token, { expires: 1 });

//     // Create minimal user object from the email
//     setUser({
//       email: email,
//       // Add any other basic info you might need
//       name: email.split('@')[0] // Simple name from email
//     });
//     setIsAuthenticated(true);
    
//     return { success: true };
//   } catch (err) {
//     return {
//       success: false,
//       message: err.response?.data?.message || "Login failed",
//     };
//   }
// };

//   // Logout
//   const logout = () => {
//   Cookies.remove("auth_token");
//   localStorage.removeItem('user_email');
//   setUser(null);
//   setIsAuthenticated(false);
// };
//   // Clear everything
//   const clearAuth = () => {
//     Cookies.remove("auth_token");
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         login,
//         logout,
//         clearAuth
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on initial load
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      const userEmail = localStorage.getItem("user_email");
      if (userEmail) {
        setUser({
          email: userEmail,
          name: userEmail.split("@")[0]
        });
      }
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login method
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/login`, {
        email,
        password,
      });

      const { token } = res.data;
      Cookies.set("auth_token", token, { expires: 1 });
      localStorage.setItem("user_email", email);

      setUser({
        email: email,
        name: email.split("@")[0],
      });
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout
  const logout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_email");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/tramessy/Login";
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;