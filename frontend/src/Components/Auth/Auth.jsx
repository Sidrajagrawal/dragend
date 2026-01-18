import { useState } from "react";
import Lottie from "lottie-react";

import signinLottie from "../../assets/signin.json";
import signupLottie from "../../assets/signup.json";

import "./Auth.css";


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="login">
      {/* Decorative abstract image */}
      <img
        src="/assets/auth-bg.avif"
        alt=""
        className="auth-bg-image"
      />

      <div className="card">
        {/* NAV */}
        <ul className="card-nav">
          <span
            className="active-bar"
            style={{ top: isLogin ? "8px" : "calc(50% + 8px)" }}
          />
          <li>
            <button
              className={isLogin ? "active" : ""}
              onClick={() => {
                setIsLogin(true);
                setOtpSent(false);
              }}
            >
              Sign In
            </button>
          </li>
          <li>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </li>
        </ul>

        {/* HERO */}
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
      <p>Secure sign in with email and one-time password.</p>

      
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
            style={{
              transform: isLogin ? "translateY(0)" : "translateY(-50%)",
            }}
          >
            {/* SIGN IN */}
            <form className="auth-form">
  <h3>Sign In</h3>

  <input placeholder="Full Name" />
  <input placeholder="Email Address" />

  {!otpSent && (
    <button
      type="button"
      className="gradient-btn"
      onClick={() => setOtpSent(true)}
    >
      Send OTP
    </button>
  )}

  {otpSent && (
    <>
      <input placeholder="Enter OTP" />
      <button className="gradient-btn">
        Verify & Sign In
      </button>
    </>
  )}

  {/* Forgot password */}
  <div className="forgot-row">
    <button type="button" className="text-link">
      Forgot password?
    </button>
  </div>

  <div className="divider" />

  {/* Switch */}
  {/* <div className="switch-row">
    <span>
      Don’t have an account?{" "}
      <button
        type="button"
        className="text-link primary"
        onClick={() => setIsLogin(false)}
      >
        Sign up
      </button>
    </span>
  </div> */}
</form>


            {/* SIGN UP */}
           <form className="auth-form">
  <h3>Create Account</h3>

  <input placeholder="Full Name" />
  <input placeholder="Email Address" />
  <input placeholder="Password" />
  <input placeholder="Confirm Password" />

  <button className="gradient-btn">Create Account</button>

  {/* Switch to Sign In */}
  {/* <div className="switch-row">
    <span>
      Already have an account?{" "}
      <button
        type="button"
        className="text-link primary"
        onClick={() => setIsLogin(true)}
      >
        Sign in
      </button>
    </span>
  </div> */}
</form>

          </div>
        </div>
      </div>
    </div>
  );
}
