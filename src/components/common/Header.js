import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Holidaze_Logo.png"; // Adjust the path if necessary

function Header({ setGlobalMessage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Update state based on presence of token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setGlobalMessage("You are logged out.");
    navigate("/"); // Redirect to home after logout
    setTimeout(() => {
      setGlobalMessage("");
    }, 3000); // Clear the message after 3 seconds
  };

  const linkStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    margin: '0 10px',
    color: '#fff',
    backgroundColor: '#324549',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const linkHoverStyle = {
    transform: 'translateY(2px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Holidaze Logo" style={{ height: '80px' }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    style={linkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.transform = linkHoverStyle.transform;
                      e.target.style.boxShadow = linkHoverStyle.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    My Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                    style={{ ...linkStyle, border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = linkHoverStyle.transform;
                      e.target.style.boxShadow = linkHoverStyle.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = linkHoverStyle.transform;
                    e.target.style.boxShadow = linkHoverStyle.boxShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
