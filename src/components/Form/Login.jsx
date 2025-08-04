
// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../providers/AuthProvider';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     const result = await login(email, password);
    
//     if (result.success) {
//       navigate('/tramessy');
//     } else {
//       setError(result.message || "Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 bg-gray-50">
//       <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row">
//         {/* Left Image */}
//         <div className="hidden lg:block lg:w-1/2">
//           <img
//             src="/parkline-login.jpg"
//             alt="Login"
//             className="h-full w-full object-cover"
//           />
//         </div>

//         {/* Right Form Section */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
//           <div className="w-full max-w-md">
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#11375B] mb-1">
//               Admin <span className="font-semibold "></span>
//             </h2>
//             <p className="text-sm text-center text-primary mb-6">Login to your account</p>

//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full text-sm px-4 py-2 pr-10 border border-gray-300 rounded-md outline-none"
//                     required
//                   />
//                   <span className="absolute top-0 right-0 h-full flex items-center justify-center bg-primary text-white px-4 rounded-r-md">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </span>
//                 </div>
//               </div>
              
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full text-sm px-4 py-2 pr-10 border border-gray-300 rounded-md outline-none"
//                     required
//                   />
//                   <span className="absolute top-0 right-0 h-full flex items-center justify-center bg-primary text-white px-4 rounded-r-md">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </span>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
//               >
//                 Login
//               </button>
//             </form>

//             <div className="mt-4 text-center">
//               <a 
//                 href="/tramessy/ResetPass" 
//                 className="text-sm text-[#11375B] underline hover:text-red-500"
//               >
//                 Forgot password?
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../providers/AuthProvider"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/autoplay"
import login1 from "../../assets/login2.jpg"
import login2 from "../../assets/login1.jpg"
import login3 from "../../assets/login3.jpg"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate("/tramessy")
    } else {
      setError(result.message || "Invalid credentials")
    }
    setIsLoading(false)
  }
const loginImages = [
  login1,
  login2,
  login3,
]
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[300px] animate-fade-in-up">
        {/* Left Side - Image Section */}
        {/* <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-600/80 z-10 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Welcome Back</h1>
              <p className="text-lg opacity-90 leading-relaxed">Sign in to continue to your dashboard</p>
            </div>
          </div>
          <img src="/parkline-login.jpg" alt="Login Background" className="w-full h-full object-cover" />
        </div> */}
        <div className="hidden lg:flex lg:w-1/2 relative">
        <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full h-full"
          >
            {loginImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Login Background ${index + 1}`}
                    className="w-full h-full object-fill"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-md">
            {/* Header Section */}
            <div className="text-center mb-5">
              <div className="mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tramessy Admin Portal</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white hover:border-gray-300 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white hover:border-gray-300 focus:outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/80 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <a
                href="/tramessy/ResetPass"
                className="text-indigo-600 hover:text-purple-600 font-medium text-sm transition-colors duration-300 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default Login
