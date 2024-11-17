import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginWithGoogle } from "../../services/login";
import signupUser from "../../services/signup";
import "./clientSignup.css";
import logo from "../../assets/img/logo.png";

const ClientSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupUser(name, email, password);
      console.log("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      setError(errorDetail || error.message || "Signup failed");
      console.error("Signup failed", error.response?.data);
    }
  };

  const handleGoogleSignup = () => {
    loginWithGoogle();
  };

  return (
    <div className="signup-container">
      <div className="gradient-bg"></div>
      <nav className="login-page-navbar">
        <div className="login-page-navbar-container">
          <Link to="/" className="login-page-logo">
            <img src={logo} alt="Spaceify Logo" />
          </Link>
        </div>
      </nav>

      <div className="signup-card">
        <h1 className="title">Create your account</h1>

        <button onClick={handleGoogleSignup} className="google-button">
          <svg
            className="google-icon"
            width="18"
            height="18"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span>or sign up with username</span>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label className="label">NAME</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label className="label">PASSWORD</label>
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

          <div className="input-group">
            <label className="label">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button type="submit" className="sign-in-button">
            Create Account
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <p className="terms">
            By signing up, you agree to our{" "}
            <a href="/privacy-policy">Privacy Policy</a> and{" "}
            <a href="/terms-conditions">Terms & Conditions</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientSignup;
