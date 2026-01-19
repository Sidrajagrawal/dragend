import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import { LoginUserApi, SignUpApi, VerifyOtpApi } from "./AuthAPI";
import "./Auth.css";

// Restored Placeholder Imports
import signinLottie from "../../assets/signin.json";
import signupLottie from "../../assets/signup.json";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);


  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "", Cpassword: "" });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPass, setShowPass] = useState(false);
  const inputRefs = useRef([]);

  const handleInput = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") setLoginData({ ...loginData, [name]: value });
    else setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const res = await LoginUserApi(loginData.email, loginData.password);
      if (res.msg === 'Login successfully.' || res.success) {
        toast.success("Login successful!");
        localStorage.setItem("isLoggedIn", "true");
        setTimeout(() => navigate("/new"), 1000);
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password, Cpassword } = signupData;
    if (!username || !email || !password) return toast.error("All fields required");
    if (password !== Cpassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await SignUpApi(username, email, password, Cpassword);
      if (res.status === 201) {
        toast.success("Account created! Check email.");
        setShowOtp(true);
        setTimeLeft(180);
      }
    } catch (err) {
      toast.error(err.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full OTP");
    setLoading(true);
    try {
      const res = await VerifyOtpApi(signupData.email, code);
      if (res.status === 200) {
        toast.success("Verified! Please login.");
        setShowOtp(false);
        setIsLogin(true); 
        setSignupData({ username: "", email: "", password: "", Cpassword: "" }); 
      }
    } catch (err) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Helpers
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (showOtp && timeLeft > 0) timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  return (
    <div className="login">
      <Toaster position="top-center" />
      <img src="/assets/auth-bg.avif" alt="" className="auth-bg-image" />

      <div className="card">
        {/* NAV */}
        <ul className="card-nav">
          <span
            className="active-bar"
            style={{ 
               top: isLogin ? "8px" : "calc(50% + 8px)" 
            }}
          />
          <li onClick={() => { setIsLogin(true); setShowOtp(false); }}>
            <button className={isLogin ? "active" : ""}>Sign In</button>
          </li>
          <li onClick={() => setIsLogin(false)}>
            <button className={!isLogin ? "active" : ""}>Sign Up</button>
          </li>
        </ul>

        {/* HERO */}
        <div className="card-hero">
          
          {/* === RESTORED LOTTIE PLACEHOLDER === */}
          <div className="lottie-wrapper">
            <Lottie
              animationData={isLogin ? signinLottie : signupLottie}
              loop
              autoplay
              className="hero-lottie"
              key={isLogin ? "signin" : "signup"}
            />
          </div>

          <div
            className="card-hero-inner"
            style={{ transform: isLogin ? "translateY(0)" : "translateY(-50%)" }}
          >
            <div className="card-hero-content">
              <h2>Welcome back</h2>
              <p>Secure sign in with email and password.</p>
            </div>
            <div className="card-hero-content">
              <h2>Create account</h2>
              <p>Join Dragend and build your backend faster.</p>
            </div>
          </div>
        </div>

        {/* FORMS */}
        <div className="card-form">
          <div
            className="forms"
            style={{ transform: isLogin ? "translateY(0)" : "translateY(-50%)" }}
          >
            {/* SIGN IN FORM */}
            <form className="auth-form" onSubmit={handleLogin}>
              <h3>Sign In</h3>
              <input 
                name="email" 
                placeholder="Email Address" 
                onChange={(e) => handleInput(e, "login")} 
              />
              <div style={{ position: 'relative' }}>
                <input 
                  name="password" 
                  type={showPass ? "text" : "password"} 
                  placeholder="Password" 
                  onChange={(e) => handleInput(e, "login")}
                  style={{ width: '100%' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="icon-btn">
                   {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              
              <button disabled={loading} className="gradient-btn">
                {loading ? "Signing In..." : "Sign In"}
              </button>
              
              <div className="forgot-row">
                <button type="button" className="text-link">Forgot password?</button>
              </div>
            </form>

            {/* 2. SIGN UP FORM*/}
            <div className="auth-form" style={{ display: 'flex', flexDirection: 'column' }}>
              {!showOtp ? (
                // Normal Signup
                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '18px', height: '100%' }}>
                   <h3>Create Account</h3>
                   <input name="username" placeholder="Full Name" onChange={(e) => handleInput(e, "signup")} />
                   <input name="email" placeholder="Email Address" onChange={(e) => handleInput(e, "signup")} />
                   <div style={{ display: 'flex', gap: '10px' }}>
                     <input name="password" type="password" placeholder="Password" onChange={(e) => handleInput(e, "signup")} />
                     <input name="Cpassword" type="password" placeholder="Confirm" onChange={(e) => handleInput(e, "signup")} />
                   </div>
                   <button disabled={loading} className="gradient-btn">
                     {loading ? "Creating..." : "Create Account"}
                   </button>
                </form>
              ) : (
                // OTP View
                <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                   <h3>Verify Email</h3>
                   <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Code sent to {signupData.email}</p>
                   
                   <div className="flex justify-center gap-2 my-6">
                     {otp.map((d, i) => (
                       <input 
                         key={i} 
                         value={d} 
                         maxLength="1"
                         ref={el => inputRefs.current[i] = el}
                         onChange={e => handleOtpChange(e.target, i)}
                         onKeyDown={e => handleOtpKeyDown(e, i)}
                         className="caret-transparent !w-12 !h-14 !p-0 !text-center !text-xl !font-bold border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                       />
                     ))}
                   </div>

                   <button onClick={handleVerifyOtp} disabled={loading} className="gradient-btn" style={{ marginTop: '20px' }}>
                      {loading ? "Verifying..." : "Verify Code"}
                   </button>

                   <div style={{ marginTop: '15px', fontSize: '13px' }}>
                      {timeLeft > 0 ? (
                        <span style={{color: '#94a3b8'}}>Resend in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                      ) : (
                        <button onClick={() => {setTimeLeft(180); toast.success("Sent!")}} className="text-link">Resend Code</button>
                      )}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}