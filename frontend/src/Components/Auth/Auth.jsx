import { useState } from "react";
import "./Auth.css";
import bgImage from "../../assets/Lock.png";

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3L21 21"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M10.58 10.58A2 2 0 0012 14A2 2 0 0013.42 13.42"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M1 12C1 12 5 5 12 5C14.12 5 15.97 5.5 17.5 6.3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M23 12C23 12 19 19 12 19C9.88 19 8.03 18.5 6.5 17.7"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
        {/* 🔮 Auth-only animated background */}
    <div className="ambient-bg">
      <span className="orb orb-1"></span>
      <span className="orb orb-2"></span>
      <span className="orb orb-3"></span>
    </div>
      <div className="auth-overlay">
        <div className="auth-right-wrapper">
          <div className="auth-card fade-slide-in">
            <h1 className="brand-title">Dragend</h1>
            <p className="brand-subtitle">
              Build Backends. Drag. Drop. Deploy.
            </p>

            {/* Toggle */}
            <div className="auth-toggle">
              <button
                className={isLogin ? "active" : ""}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Login
              </button>
              <button
                className={!isLogin ? "active" : ""}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>

              <div className="form-group password-group">
  <label>Password</label>
  <div className="password-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
    />
    <button
      type="button"
      className="eye-btn"
      onClick={() => setShowPassword(!showPassword)}
      aria-label="Toggle password visibility"
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  </div>
  {isLogin && (
    <p className="forgot-password">Forgot Password?</p>
  )}
</div>



              {!isLogin && (
  <div className="form-group password-group">
    <label>Confirm Password</label>
    <div className="password-wrapper">
      <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm password"
      />
      <button
        type="button"
        className="eye-btn"
        onClick={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
        aria-label="Toggle password visibility"
      >
        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  </div>
)}


              <button className="submit-btn" type="submit">
                {isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? " Sign up" : " Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
