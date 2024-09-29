import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./login.css"; // Import your custom styles

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isFading, setIsFading] = useState(false); // New state for fade
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate(); // Initialize useNavigate

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setErrorMessage(""); // Clear error message on toggle
  };

  const handleSignIn = () => {
    // Check if the email and password are correct
    if (email === "umbchacks@umbc.edu" && password === "UMBCHacks24") {
      // Start fade out effect
      setIsFading(true);

      // Wait for fade out animation to finish before navigating
      setTimeout(() => {
        navigate("/landing"); // Navigate to the landing page
      }, 600); // Duration must match your CSS transition
    } else {
      // Set error message for incorrect credentials
      setErrorMessage("Incorrect email or password.");
    }
  };

  return (
    <div className={`login-wrapper ${isFading ? "fade-out" : ""}`}>
      <nav className="navbar">
      </nav>

      <div className={`container ${isSignIn ? "" : "active"}`}>
        {isSignIn ? (
          <>
            <div className="form-container sign-in active">
              <form onSubmit={(e) => e.preventDefault()}>
                <h1>Sign In</h1>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                />
                <a href="#">Forgot Your Password?</a>
                <button type="button" onClick={handleSignIn}>Sign In</button>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Error message */}
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
