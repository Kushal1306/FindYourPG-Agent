// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { Heading } from '../components/Heading';
// import { SubHeading } from '../components/SubHeading';
// import { InputBox } from '../components/InputBox';
// import { Button } from '../components/Button';
// import { BottomWarning } from '../components/BottomWarning';
// import httpClient from '@/lib/httpClient';
// import Cookies from 'js-cookie';


// function Signin() {
//     const navigate = useNavigate();
//     // const [userName, setUserName] = useState("");
//     const [email,setEmail]=useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const handleEmailSignIn = async () => {
//         try {
//             const response = await httpClient.post("/user/signin", {
//                 email,
//                 password
//             });
//             Cookies.set('access_token',response.data.token,{expires:7,secure:true,sameSite:'Strict'});

//             // localStorage.setItem("token", response.data.token);
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Email Sign-In Error:", error);
//             setError("Invalid email or password. Please try again.");
//         }
//     };

//     const handleGoogleSignIn = async (codeResponse) => {
//         try {
//             console.log('Google Sign-In Response:', codeResponse);

//             const { code } = codeResponse;
//             if (!code) {
//                 throw new Error('No authorization code received from Google');
        
            
//             }

//             // Send the authorization code to your backend
//             const response = await httpClient.post("/user/google-signin", {
//                 code: code
//             });
            
//             Cookies.set('access_token',response.data.token,{expires:7,secure:true,sameSite:'Strict'});
//             // localStorage.setItem("token", response.data.token);
//             navigate("/dashboard");
//         } catch (error) {
//             console.error('Google Sign-In Error:', error);
//             setError("Google sign-in failed. Please try again.");
//         }
//     };

//     const login = useGoogleLogin({
//         flow: 'auth-code',
//         onSuccess: handleGoogleSignIn,
//         onError: () => setError("Google sign-in failed. Please try again."),
//         scope: 'openid email profile https://www.googleapis.com/auth/calendar',
//     });

//     return (
//         <div className="bg-slate-300 h-screen flex justify-center">
//             <div className="flex flex-col justify-center">
//                 <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
//                     <Heading label={"Sign in"} />
//                     <SubHeading label={"Enter your credentials to access your account"} />
//                     {error && <div className="text-red-500 mb-4">{error}</div>}
//                     <InputBox
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="name@gmail.com"
//                         label={"Email"}
//                     />
//                     <InputBox
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="123456"
//                         label={"Password"}
//                     />
//                     <div className="pt-4">
//                         <Button label={"Sign in"} onClick={handleEmailSignIn} />
//                     </div>
//                     <div className='pt-4 w-full px-10 pb-2'>
//                         <div className="w-full justify-center">
//                             <Button label={"Sign in with Google"} onClick={() => login()} />
//                         </div>
//                     </div>
//                     <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Signin;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import httpClient from '@/lib/httpClient';
// import Cookies from 'js-cookie';

// function Signin() {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const handleEmailSignIn = async () => {
//         try {
//             const response = await httpClient.post("/user/signin", {
//                 email,
//                 password
//             });
//             Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Email Sign-In Error:", error);
//             setError("Invalid email or password. Please try again.");
//         }
//     };

//     const handleGoogleSignIn = async (codeResponse) => {
//         try {
//             const { code } = codeResponse;
//             if (!code) {
//                 throw new Error('No authorization code received from Google');
//             }

//             const response = await httpClient.post("/user/google-signin", {
//                 code: code
//             });
            
//             Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//             navigate("/dashboard");
//         } catch (error) {
//             console.error('Google Sign-In Error:', error);
//             setError("Google sign-in failed. Please try again.");
//         }
//     };

//     const login = useGoogleLogin({
//         flow: 'auth-code',
//         onSuccess: handleGoogleSignIn,
//         onError: () => setError("Google sign-in failed. Please try again."),
//         scope: 'openid email profile https://www.googleapis.com/auth/calendar',
//     });

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-brand-accent to-white">
//             <div className="container min-h-screen grid lg:grid-cols-2 gap-8 items-center px-4 py-8">
//                 {/* Left Column - Branding */}
//                 <div className="hidden lg:flex flex-col justify-center space-y-6 pr-12">
//                     <h1 className="text-4xl font-bold text-gray-900">
//                         Welcome to HireSphere
//                     </h1>
//                     <p className="text-xl text-gray-600">
//                         Your all-in-one platform for streamlined hiring and talent management.
//                     </p>
//                     <div className="grid grid-cols-2 gap-4 mt-8">
//                         <div className="bg-white p-4 rounded-lg shadow-sm">
//                             <h3 className="font-semibold text-gray-800">Smart Hiring</h3>
//                             <p className="text-gray-600 text-sm mt-1">AI-powered candidate matching</p>
//                         </div>
//                         <div className="bg-white p-4 rounded-lg shadow-sm">
//                             <h3 className="font-semibold text-gray-800">Easy Scheduling</h3>
//                             <p className="text-gray-600 text-sm mt-1">Automated interview scheduling</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column - Sign In Form */}
//                 <div className="w-full max-w-md mx-auto">
//                     <div className="bg-white rounded-2xl shadow-xl p-8">
//                         <div className="text-center mb-8">
//                             <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
//                             <p className="text-gray-600 mt-2">Welcome back! Please enter your details.</p>
//                         </div>

//                         {error && (
//                             <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
//                                 {error}
//                             </div>
//                         )}

//                         <form onSubmit={(e) => { e.preventDefault(); handleEmailSignIn(); }} className="space-y-6">
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email address
//                                 </label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                                         placeholder="name@company.com"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                                     <input
//                                         id="password"
//                                         type={showPassword ? "text" : "password"}
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                                         placeholder="Enter your password"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5" />
//                                         ) : (
//                                             <Eye className="h-5 w-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full bg-brand-primary text-white py-3 rounded-lg font-medium hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
//                             >
//                                 Sign in
//                             </button>

//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-300"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                                 </div>
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={() => login()}
//                                 className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                             >
//                                 <svg className="h-5 w-5" viewBox="0 0 24 24">
//                                     <path
//                                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                         fill="#4285F4"
//                                     />
//                                     <path
//                                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                         fill="#34A853"
//                                     />
//                                     <path
//                                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                         fill="#FBBC05"
//                                     />
//                                     <path
//                                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                         fill="#EA4335"
//                                     />
//                                 </svg>
//                                 Sign in with Google
//                             </button>
//                         </form>

//                         <p className="text-center mt-8 text-sm text-gray-600">
//                             Don't have an account?{" "}
//                             <button
//                                 onClick={() => navigate("/signup")}
//                                 className="text-brand-primary font-medium hover:text-brand-secondary"
//                             >
//                                 Sign up
//                             </button>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Signin;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import httpClient from '@/lib/httpClient';
// import Cookies from 'js-cookie';
// import { motion } from 'framer-motion';

// function Signin() {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const handleEmailSignIn = async () => {
//         try {
//             const response = await httpClient.post("/user/signin", {
//                 email,
//                 password
//             });
//             Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Email Sign-In Error:", error);
//             setError("Invalid email or password. Please try again.");
//         }
//     };

//     const handleGoogleSignIn = async (codeResponse) => {
//         try {
//             const { code } = codeResponse;
//             if (!code) {
//                 throw new Error('No authorization code received from Google');
//             }

//             const response = await httpClient.post("/user/google-signin", {
//                 code: code
//             });
            
//             Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//             navigate("/dashboard");
//         } catch (error) {
//             console.error('Google Sign-In Error:', error);
//             setError("Google sign-in failed. Please try again.");
//         }
//     };

//     const login = useGoogleLogin({
//         flow: 'auth-code',
//         onSuccess: handleGoogleSignIn,
//         onError: () => setError("Google sign-in failed. Please try again."),
//         scope: 'openid email profile https://www.googleapis.com/auth/calendar',
//     });

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-brand-accent to-white overflow-hidden">
//             <div className="container min-h-screen flex justify-center items-center py-8 ">
//                 {/* Left Column - Only Image with Animation */}
//                 {/* Right Column - Sign In Form */}
//                 <motion.div 
//                     className="w-full max-w-md mx-auto"
//                     initial={{ x: 20, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                     <motion.div 
//                         className="bg-white rounded-2xl shadow-xl p-8"
//                         whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
//                         transition={{ duration: 0.2 }}
//                     >
//                         <div className="text-center mb-8">
//                             <motion.h2 
//                                 className="text-2xl font-bold text-gray-900"
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.3 }}
//                             >
//                                 Sign in to your account
//                             </motion.h2>
//                             <motion.p 
//                                 className="text-gray-600 mt-2"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.5, delay: 0.4 }}
//                             >
//                                 Welcome back! Please enter your details.
//                             </motion.p>
//                         </div>

//                         {error && (
//                             <motion.div 
//                                 className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm"
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: "auto" }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 {error}
//                             </motion.div>
//                         )}

//                         <form onSubmit={(e) => { e.preventDefault(); handleEmailSignIn(); }} className="space-y-6">
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.5 }}
//                             >
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email address
//                                 </label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                                         placeholder="name@company.com"
//                                     />
//                                 </div>
//                             </motion.div>

//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.6 }}
//                             >
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                                     <input
//                                         id="password"
//                                         type={showPassword ? "text" : "password"}
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                                         placeholder="Enter your password"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5" />
//                                         ) : (
//                                             <Eye className="h-5 w-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </motion.div>

//                             <motion.button
//                                 type="submit"
//                                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.7 }}
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 Sign in
//                             </motion.button>

//                             <motion.div 
//                                 className="relative"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.5, delay: 0.8 }}
//                             >
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-300"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                                 </div>
//                             </motion.div>

//                             <motion.button
//                                 type="button"
//                                 onClick={() => login()}
//                                 className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.9 }}
//                                 whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <svg className="h-5 w-5" viewBox="0 0 24 24">
//                                     <path
//                                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                         fill="#4285F4"
//                                     />
//                                     <path
//                                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                         fill="#34A853"
//                                     />
//                                     <path
//                                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                         fill="#FBBC05"
//                                     />
//                                     <path
//                                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                         fill="#EA4335"
//                                     />
//                                 </svg>
//                                 Sign in with Google
//                             </motion.button>
//                         </form>

//                         <motion.p 
//                             className="text-center mt-8 text-sm text-gray-600"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.5, delay: 1 }}
//                         >
//                             Don't have an account?{" "}
//                             <button
//                                 onClick={() => navigate("/signup")}
//                                 className="text-blue-600 font-medium hover:text-blue-700"
//                             >
//                                 Sign up
//                             </button>
//                         </motion.p>
//                     </motion.div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

// export default Signin;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { httpClient2 } from '@/lib/httpClient';
// import Cookies from 'js-cookie';

// function Signin() {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleEmailSignIn = async () => {
//         try {
//             setIsLoading(true);
//             const response = await httpClient2.post("/user/signin", {
//                 email,
//                 password
//             });
//             Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//             navigate("/dashboard");
//         } catch (error) {
//             console.error("Email Sign-In Error:", error);
//             setError("Invalid email or password. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGoogleSignIn = async (codeResponse) => {
//         try {
//             setIsLoading(true);
//             const { code } = codeResponse;
//             if (!code) {
//                 throw new Error('No authorization code received from Google');
//             }

//             const response = await httpClient2.post("/user/google-signin", {
//                 code: code
//             });
            
//             Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
//             navigate("/dashboard");
//         } catch (error) {
//             console.error('Google Sign-In Error:', error);
//             setError("Google sign-in failed. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const login = useGoogleLogin({
//         flow: 'auth-code',
//         onSuccess: handleGoogleSignIn,
//         onError: () => setError("Google sign-in failed. Please try again."),
//         scope: 'openid email profile https://www.googleapis.com/auth/calendar',
//     });

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-brand-accent to-white overflow-hidden">
//             <div className="container min-h-screen flex justify-center items-center py-8">
//                 {/* Sign In Form */}
//                 <div className="w-full max-w-md mx-auto">
//                     <div className="bg-white rounded-2xl shadow-xl p-8">
//                         <div className="text-center mb-8">
//                             <h2 className="text-2xl font-bold text-gray-900">
//                                 Sign in to your account
//                             </h2>
//                             <p className="text-gray-600 mt-2">
//                                 Welcome back! Please enter your details.
//                             </p>
//                         </div>

//                         {error && (
//                             <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
//                                 {error}
//                             </div>
//                         )}

//                         <form onSubmit={(e) => { e.preventDefault(); handleEmailSignIn(); }} className="space-y-6">
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Email address
//                                 </label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                                         placeholder="name@company.com"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
//                                     <input
//                                         id="password"
//                                         type={showPassword ? "text" : "password"}
//                                         value={password}
//                                         onChange={(e) => setPassword(e.target.value)}
//                                         className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
//                                         placeholder="Enter your password"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5" />
//                                         ) : (
//                                             <Eye className="h-5 w-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={isLoading}
//                                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
//                             >
//                                 {isLoading ? (
//                                     <div className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Signing in...
//                                     </div>
//                                 ) : "Sign in"}
//                             </button>

//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-300"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                                 </div>
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={() => login()}
//                                 disabled={isLoading}
//                                 className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
//                             >
//                                 {isLoading ? (
//                                     <div className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Processing...
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <svg className="h-5 w-5" viewBox="0 0 24 24">
//                                             <path
//                                                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                                 fill="#4285F4"
//                                             />
//                                             <path
//                                                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                                 fill="#34A853"
//                                             />
//                                             <path
//                                                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                                 fill="#FBBC05"
//                                             />
//                                             <path
//                                                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                                 fill="#EA4335"
//                                             />
//                                         </svg>
//                                         Sign in with Google
//                                     </>
//                                 )}
//                             </button>
//                         </form>

//                         <p className="text-center mt-8 text-sm text-gray-600">
//                             Don't have an account?{" "}
//                             <button
//                                 onClick={() => navigate("/signup")}
//                                 className="text-blue-600 font-medium hover:text-blue-700"
//                             >
//                                 Sign up
//                             </button>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Signin;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { httpClient2 } from '@/lib/httpClient';
import Cookies from 'js-cookie';

function Signin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleEmailSignIn = async () => {
        try {
            setIsEmailLoading(true);
            const response = await httpClient2.post("/user/signin", {
                email,
                password
            });
            Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
            navigate("/dashboard");
        } catch (error) {
            console.error("Email Sign-In Error:", error);
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleGoogleSignIn = async (codeResponse) => {
        try {
            setIsGoogleLoading(true);
            const { code } = codeResponse;
            if (!code) {
                throw new Error('No authorization code received from Google');
            }

            const response = await httpClient2.post("/user/google-signin", {
                code: code
            });
            
            Cookies.set('access_token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
            navigate("/dashboard");
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            setError("Google sign-in failed. Please try again.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSignIn,
        onError: () => setError("Google sign-in failed. Please try again."),
        scope: 'openid email profile https://www.googleapis.com/auth/calendar',
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-accent to-white overflow-hidden flex items-center justify-center px-4">
            <div className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleEmailSignIn(); }} className="space-y-5">
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
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
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
                                    className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors"
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
                            disabled={isEmailLoading || isGoogleLoading}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isEmailLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : "Sign in"}
                        </button>

                        {/* <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => login()}
                            disabled={isEmailLoading || isGoogleLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign in with Google
                                </>
                            )}
                        </button> */}
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 font-medium hover:text-blue-700"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signin;
// import React,{useState} from 'react';
// import { Heading } from '../components/Heading'
// import { SubHeading } from '../components/SubHeading'
// import { InputBox } from '../components/InputBox'
// import { Button } from '../components/Button'
// import { BottomWarning } from '../components/BottomWarning'
// import { useNavigate } from 'react-router-dom';
// import {jwtDecode} from 'jwt-decode';
// import {GoogleLogin} from '@react-oauth/google';
// import axios from 'axios';
// import { useGoogleLogin } from '@react-oauth/google';



// function Signin() {
//     const navigate=useNavigate();
//     const [userName,setuserName]=useState("");
//     const [password,setPassword]=useState("");

//     const handleButton=async()=>{
//         try {
//             const response=await axios.post("https://realtimechatbot-rentok.onrender.com/user/signin",{
//                 userName,
//                 password
//             });
//             localStorage.setItem("token",response.data.token);
//             navigate("/chat");
            
//         } catch (error) {
//             console.log(error); 
//         }

//     }; 

//     const handleGoogleSignIn=async(tokenResponse)=>{
//         try {
//           console.log('Full Google Sign-In response:', tokenResponse);

//           const { access_token, credentialResponse } = tokenResponse;
//           console.log('Access Token:', access_token);
//           console.log('ID Token:', credentialResponse);
//             const decoded=jwtDecode(credentialResponse.credential);
//             console.log(decoded);
//             //https://realtimechatbot-rentok.onrender.com
//             const response=await axios.post("http://localhost:3000/user/google-signin",{
//                 token:credentialResponse.credential,
//             });
//             localStorage.setItem("token",response.data.token);
//             navigate("/chat"); 
//         } catch (error) {
//             console.error('Google Sign-In Error:', error);
//         }

//     };
//     const login = useGoogleLogin({
//       onSuccess: handleGoogleSignIn,
//       flow: 'auth-code',
//       scope: 'openid https://www.googleapis.com/auth/calendar',
//       prompt: 'consent',
//     });
    

//   return (
//     <div className="bg-slate-300 h-screen flex justify-center">
//       <div className="flex flex-col justify-center">
//         <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
//           <Heading label={"Sign in"} />
//           <SubHeading label={"Enter your credentials to access your account"} />
//           <InputBox
//             type="email"
//             value={userName}
//             onChange={(e) => {
//               setuserName(e.target.value);
//             }} placeholder="name@gmail.com" label={"Email"} />
//           <InputBox
//             type="password"
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//             }}
//             placeholder="123456" label={"Password"} />
//           <div className="pt-4">
//             <Button label={"Sign in"} onClick={handleButton} />
//           </div>
//           <div className='pt-4 w-full px-10 pb-2'>
//             <div className="w-full justify-center">
//             {/* <GoogleLogin
//              onSuccess={handleGoogleSignIn}
//              onError={() => console.log('login failed')}
//              scope="https://www.googleapis.com/auth/calendar email profile"
// /> */}
//          <Button label={"Sign in with Google"} onClick={login} />
//  {/* onClick={() => login()}></button> */}

//             </div>
//           </div>
//           <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signin