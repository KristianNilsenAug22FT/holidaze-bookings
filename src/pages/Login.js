import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setGlobalMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.data.accessToken);
        localStorage.setItem("username", data.data.name);
        localStorage.setItem("venueManager", data.data.venueManager);
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Email validation
    if (!email.endsWith("@stud.noroff.no")) {
      setError(
        "Registration failed. Only users with a @stud.noroff.no email can register.",
      );
      return;
    }

    // Username validation
    if (name.length < 6) {
      setError(
        "Registration failed. Username must be at least 6 characters long.",
      );
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Registration failed. Password must be at least 8 characters long and include at least one capital letter and one number.",
      );
      return;
    }

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (response.ok) {
        setSuccess("Registration successful! Please log in.");
        setIsRegister(false);
      } else {
        setError(
          "Registration failed. Please check your details and try again.",
        );
      }
    } catch (error) {
      setError("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="container">
      <h1>{isRegister ? "Register" : "Login"}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        {isRegister && (
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="form-text">
              Username must be at least 6 characters long.
            </div>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {isRegister && (
            <div className="form-text">
              Only users with a <code>@stud.noroff.no</code> email can register.
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <div className="form-text">
              Password must be at least 8 characters long and include at least
              one capital letter and one number.
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        className="btn btn-link"
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
          setSuccess("");
        }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
    </div>
  );
}

export default Login;
