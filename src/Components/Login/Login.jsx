
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
        email,
        password,
      });
      console.log("Response data:", response.data);
      const token = response.data;

      if (!token) {
        console.error("Token is missing from the API response.");
        setError("Login failed. Please try again.");
        return;
      }

      localStorage.setItem("jwtToken", token); // Store the JWT token
      localStorage.setItem("isLoggedIn", "true"); // Store the login status
      console.log("Token saved in localStorage:", localStorage.getItem("jwtToken"));
      onLoginSuccess(response.data);
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials, please try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    console.log("Token retrieved from localStorage in Login:", token);
    if(token){
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="main d-flex justify-content-center align-items-center min-vh-100">
      <div className="container d-flex justify-content-center align-items-center">
        <form
          className="card p-4 shadow-lg"
          style={{ maxWidth: "400px", width: "100%" }}
          onSubmit={handleLogin}
        >
          <h2 className="mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
