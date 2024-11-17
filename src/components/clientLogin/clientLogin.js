import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../services/login";
import "./clientLogin.css";
import logo from "../../assets/img/logo.png";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Starting login process...");
      const data = await loginUser(email, password);
      console.log("Login response:", data);

      setTimeout(() => {
        const token = localStorage.getItem("access_token");
        console.log("Stored token:", token ? "Present" : "Missing");

        if (token) {
          console.log("Navigating to dashboard...");
          navigate("/dashboard", { replace: true });
        } else {
          console.error("No token found after login");
          setError("Authentication failed");
        }
      }, 100);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Login failed");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="gradient-bg"></div>
      <nav className="login-page-navbar">
        <div className="login-page-navbar-container">
          <Link to="/" className="login-page-logo">
            <img src={logo} alt="Spaceify Logo" />
          </Link>
        </div>
      </nav>

      <div className="login-card">
        <h1 className="title">Sign in to your account</h1>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label className="label">USERNAME</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="password-header">
              <label className="label">PASSWORD</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.checked)}
                className="custom-checkbox"
              />
              <span className="checkbox-text">Remember me on this device</span>
            </label>
          </div>

          <button type="submit" className="sign-in-button">
            Sign in
          </button>
        </form>

        <div className="login-footer">
          <p>
            By signing in, you agree to our{" "}
            <a href="/privacy-policy">Privacy Policy</a> and{" "}
            <a href="/terms-conditions">Terms & Conditions</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
