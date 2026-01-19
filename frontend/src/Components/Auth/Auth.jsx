import { useState } from "react";
import Lottie from "lottie-react";
import signinLottie from "../../assets/signin.json";
import signupLottie from "../../assets/signup.json";
import { LoginUserApi, SignUpApi, VerifyOtpApi } from "./AuthAPI";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(email);
      const response = await LoginUserApi(email, password);
      setIsLoading(false);
      alert("Login Successful");

    } catch (error) {
      alert(error.msg || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await SignUpApi(username, email, password, confirmPass);
      alert(response.msg || "OTP Sent!");
      setIsVerifying(true);
    } catch (error) {
      alert(error.msg || "Signup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await VerifyOtpApi(email, otp);
      alert(response.msg || "Verification Successful! Please Login.");
      setIsVerifying(false);
      setIsLogin(true);
      setOtp("");
      setPassword("");
      setConfirmPass("");
    } catch (error) {
      alert(error.msg || "Verification Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        {/* NAV */}
        <ul className="card-nav">
          <span
            className="active-bar"
            style={{ top: isLogin ? "8px" : "calc(50% + 8px)" }}
          />
          <li className="cursor-pointer" onClick={() => {
            setIsLogin(true);
            setIsVerifying(false);

          }}>
            <button
              className={isLogin ? "active" : ""}

            >
              Sign In
            </button>
          </li>
          <li onClick={() => setIsLogin(false)} className="cursor-pointer">
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </li>
        </ul>

        <div className="card-hero">
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
            style={{
              transform: isLogin ? "translateY(0)" : "translateY(-50%)",
            }}
          >
            <div className="card-hero-content">
              <h2>Welcome back</h2>
              <p>Secure sign in with your email and password.</p>
            </div>

            <div className="card-hero-content">
              <h2>Create account</h2>
              <p>Join Dragend and build your backend faster.</p>
            </div>
          </div>
        </div>
        <div className="card-form">
          <div
            className="forms"
            style={{
              transform: isLogin ? "translateY(0)" : "translateY(-50%)",
            }}
          >
            <form className="auth-form" onSubmit={handleLogin}>
              <h3>Sign In</h3>

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="gradient-btn" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="forgot-row">
                <button type="button" className="text-link">
                  Forgot password?
                </button>
              </div>
            </form>

            {/* SIGN UP FORM */}
            <form
              className="auth-form"
              onSubmit={isVerifying ? handleVerifyOtp : handleSignup}
            >
              <h3>{isVerifying ? "Verify Email" : "Create Account"}</h3>

              {!isVerifying ? (
                // Step 1: Registration Details
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                  <button className="gradient-btn" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Account"}
                  </button>
                </>
              ) : (
                // Step 2: OTP Entry
                <>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    We sent a verification code to <strong>{email}</strong>
                  </p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <button className="gradient-btn" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify & Register"}
                  </button>

                  <button
                    type="button"
                    className="text-link"
                    style={{ marginTop: '10px', fontSize: '12px' }}
                    onClick={() => setIsVerifying(false)}
                  >
                    Go back
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}