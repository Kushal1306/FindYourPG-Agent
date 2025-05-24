// import React, { useState } from 'react'
// import { Heading } from '../components/Heading'
// import { SubHeading } from '../components/SubHeading'
// import { InputBox } from '../components/InputBox'
// import { Button } from '../components/Button'
// import { BottomWarning } from '../components/BottomWarning'
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google'
// import { useNavigate } from 'react-router-dom'
// import {jwtDecode} from 'jwt-decode';
// import httpClient from '@/lib/httpClient';
// import Cookies from 'js-cookie'


// function Signup() {
//   // const [firstName,setfirstName]=useState("");
//   // const [lastName,setlastName]=useState("");
//   const [userName,setUserName]=useState("");
//   const [email,setEmail]=useState("");
//   const [password,setPassword]=useState("");
//   const navigate=useNavigate();

//   const handleSignup=async()=>{
//     try { 
//      const response= await httpClient.post("/user/signup",{
//         userName:userName,
//         email:email,
//         password:password,
//       });
//       // if(!response.data.token)
//       //   tota
//       Cookies.set('access_token',response.data.token,{expires:7,secure:true,sameSite:'Strict'});
//       // localStorage.setItem("token",response.data.token);
//       navigate("/dashboard");

//     } catch (error) {
//         console.error('Sign-up Error:', error);
//     }
   
//   };
//   const handleGoogleSignIn=async(credentialResponse)=>{
//     try {
//         const decoded=jwtDecode(credentialResponse.credential);
//         console.log(decoded);

//         const response=await httpClient.post("user/google-signin",{
//             token:credentialResponse.credential,
//         });
//         localStorage.setItem("token",response.data.token);
//         navigate("/dashboard"); 
//     } catch (error) {
//         console.error('Google Sign-In Error:', error);
//     }

// };
//   return (
//   <div className="bg-slate-100 h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8">
//   <div className="flex flex-col justify-center max-w-md w-full">
//     <div className="rounded-lg bg-white shadow-lg w-full text-center py-2 sm:py-6 px-6 sm:px-8">
//       <Heading label={"Sign Up"} />
//       <SubHeading label={"Enter your information to create an account"} />
//       <div className="mt-2">
//         <InputBox
//          id="userName"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           label={"Full Name"}
//           placeholder={"xxx"}
//         />
//       </div>
//       <div className="mt-2">
//         <InputBox
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           label={"Email"}
//           placeholder={"abc@gmail.com"}
//         />
//       </div>
//       <div className="mt-2">
//         <InputBox
//           id="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           label={"Password"}
//           placeholder={"********"}
//         />
//       </div>
//       <div className="mt-4">
//         <Button onClick={handleSignup} label={"Sign Up"} />
//       </div>
//       <div className="pt-4 w-full flex justify-center">
//         <GoogleLogin
//           onSuccess={handleGoogleSignIn}
//           onError={() => console.log('Sign up failed')}
//           useOneTap
//           className="w-full max-w-xs"
//         />
//       </div>
//       <div className="pt-4">
//         <BottomWarning
//           label={"Already have an account?"}
//           buttonText={"Login"}
//           to={"/signin"}
//         />
//       </div>
//     </div>
//   </div>
// </div>
//   )
// }

// export default Signup;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
// import { GoogleLogin } from '@react-oauth/google';
// import httpClient from '@/lib/httpClient';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// function Signup() {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isEmailLoading, setIsEmailLoading] = useState(false);

//   const handleSignup = async () => {
//     try {
//       setIsEmailLoading(true);
//       const response = await httpClient.post("/user/signup", {
//         userName: userName,
//         email: email,
//         password: password,
//       });
      
//       Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//       navigate("/dashboard");
//     } catch (error) {
//       console.error('Sign-up Error:', error);
//       setError("Registration failed. Please try again.");
//     } finally {
//       setIsEmailLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async (credentialResponse) => {
//     try {
//       const decoded = jwtDecode(credentialResponse.credential);
//       console.log(decoded);

//       const response = await httpClient.post("user/google-signin", {
//         token: credentialResponse.credential,
//       });
      
//       Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//       navigate("/dashboard");
//     } catch (error) {
//       console.error('Google Sign-In Error:', error);
//       setError("Google sign-in failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-brand-accent to-white overflow-hidden flex items-center justify-center px-4">
//       <div className="w-full max-w-sm mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl px-6 py-2">
//           <div className="text-center mb-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               Create an account
//             </h2>
//             <p className="text-gray-600 mt-1">
//               Enter your information to get started
//             </p>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-5">
//             <div>
//               <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="userName"
//                   type="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                   placeholder="John Doe"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                   placeholder="name@company.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isEmailLoading}
//               className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
//             >
//               {isEmailLoading ? (
//                 <div className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing up...
//                 </div>
//               ) : "Sign up"}
//             </button>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//               </div>
//             </div>

//             <div className="flex justify-center">
//             <GoogleLogin
//   onSuccess={handleGoogleSignIn}
//   onError={() => setError("Google sign-up failed. Please try again.")}
//   shape="rectangular"
//   text="signup_with"
//   size="large"
//   width="100%"
// />

//             </div>
//           </form>

//           <p className="text-center mt-3 mb-2 text-sm text-gray-600">
//             Already have an account?{" "}
//             <button
//               onClick={() => navigate("/signin")}
//               className="text-blue-600 font-medium hover:text-blue-700"
//             >
//               Sign in
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import httpClient from '@/lib/httpClient';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setIsEmailLoading(true);
      const response = await httpClient.post("/user/signup", {
        userName: userName,
        email: email,
        password: password,
      });
      
      Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
      navigate("/dashboard");
    } catch (error) {
      console.error('Sign-up Error:', error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async (codeResponse) => {
    try {
      setIsAuthLoading(true);
      let response;
      
      if (codeResponse.credential) {
        // Handle credential response from GoogleLogin component
        const decoded = jwtDecode(codeResponse.credential);
        console.log(decoded);

        response = await httpClient.post("user/google-signin", {
          token: codeResponse.credential,
        });
      } else {
        // Handle auth code flow from useGoogleLogin hook
        response = await httpClient.post("user/google-signin", {
          code: codeResponse.code,
          scope: codeResponse.scope,
        });
      }
      
      Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
      navigate("/dashboard");
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: handleGoogleSignIn,
    onError: () => setError("Google sign-in failed. Please try again."),
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
  });

  const handleMicrosoftSignIn = async () => {
    try {
      setIsAuthLoading(true);
      
      // Get the redirect URL from your backend
      // const response = await httpClient.get('/outlook/auth');
      window.location.href = 'http://localhost:3000/outlook/auth';

      
      // Redirect to Microsoft login page
      // window.location.href = response.data.redirectUrl;
      
      // The rest of the authentication process will be handled when Microsoft
      // redirects back to your application's callback URL
    } catch (error) {
      console.error('Microsoft Auth Redirect Error:', error);
      setError("Microsoft sign-in failed. Please try again.");
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-accent to-white overflow-hidden flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-xl px-6 py-2">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an account
            </h2>
            <p className="text-gray-600 mt-1">
              Enter your information to get started
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-5">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isEmailLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isEmailLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </div>
              ) : "Sign up"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => googleLogin()}
                disabled={isAuthLoading}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
              </button>
              
              <button
                onClick={handleMicrosoftSignIn}
                disabled={isAuthLoading}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Microsoft</span>
              </button>
            </div>
          </form>

          <p className="text-center mt-5 mb-2 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;