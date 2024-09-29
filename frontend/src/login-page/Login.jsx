import React, { useState } from "react";
import "./login.css"; // Import your custom styles

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Vector Mentor</h1>
      </nav>
      
      <div className={`container ${isSignIn ? "" : "active"}`}>
        {isSignIn ? (
          <>
            <div className="form-container sign-in active">
              <form>
                <h1>Sign In</h1>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href="#">Forgot Your Password?</a>
                <button type="button">Sign In</button>
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
              <form>
                <h1>Create Account</h1>
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
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