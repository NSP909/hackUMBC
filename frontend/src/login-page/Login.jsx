import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css"; // Import your custom styles

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isFading, setIsFading] = useState(false); // New state for fade
  const navigate = useNavigate(); // Initialize useNavigate

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSignIn = () => {
    // Start fade out effect
    setIsFading(true);
    
    // Wait for fade out animation to finish before navigating
    setTimeout(() => {
      navigate("/landing"); // Navigate to the landing page
    }, 600); // Duration must match your CSS transition
  };

  return (
    <div className={`login-wrapper ${isFading ? "fade-out" : ""}`}>
      <nav className="navbar">
        <h1>Vector Mentor</h1>
      </nav>

      <div className={`container ${isSignIn ? "" : "active"}`}>
        {isSignIn ? (
          <>
            <div className="form-container sign-in active">
              <form onSubmit={(e) => e.preventDefault()}>
                <h1>Sign In</h1>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <a href="#">Forgot Your Password?</a>
                <button type="button" onClick={handleSignIn}>Sign In</button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-right active">
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start your journey with us</p>
                  <button className="btn" id="register" onClick={handleToggle}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-container sign-up active">
              <form onSubmit={(e) => e.preventDefault()}>
                <h1>Create Account</h1>
                <input type="text" placeholder="Name" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="button">Sign Up</button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left active">
                  <h1>Welcome Back!</h1>
                  <p>To keep connected, please sign in with your personal details</p>
                  <button className="btn" id="login" onClick={handleToggle}>
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
