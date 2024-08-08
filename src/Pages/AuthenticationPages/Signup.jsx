import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../Context/toast-context";
import "./UserAuth.css";

function Signup() {
  const { showToast } = useToast();
  const [termsAndConditionsCheckbox, setTermsAndConditionsCheckbox] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const navigate = useNavigate();

  function signupUser(event) {
    event.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/user/register", {
        firstName: newUserName,
        email: newUserEmail,
        password: newUserPassword,
      })
      .then((res) => {
        // Assuming the backend sends a proper response object with a success status
        if (res.status === 200) {
          showToast("success", "", "New user created successfully");
          console.log("Navigating to login...");
navigate('/login');

          
        } else {
          showToast("error", "", res.data.message || "Error occurred while creating new user");
        }
      })
      .catch((err) => {
        // Improved error handling to account for various scenarios
        const errorMessage = err.response?.data?.message || "Error creating new user. Please try again";
        showToast("error", "", errorMessage);
      });
  }

  return (
    <div className="user-auth-content-container">
      <form onSubmit={signupUser} className="user-auth-form">
        <h2>Signup</h2>

        <div className="user-auth-input-container">
          <label htmlFor="user-auth-input-name"><h4>Name</h4></label>
          <input
            id="user-auth-input-name"
            className="user-auth-form-input"
            type="text"
            placeholder="Name"
            value={newUserName}
            onChange={(event) => setNewUserName(event.target.value)}
            
            required
          />
        </div>

        <div className="user-auth-input-container">
          <label htmlFor="user-auth-input-email"><h4>Email address</h4></label>
          <input
            id="user-auth-input-email"
            className="user-auth-form-input"
            type="email"
            placeholder="Email"
            value={newUserEmail}
            onChange={(event) => setNewUserEmail(event.target.value)}
            required
          />
        </div>

        <div className="user-auth-input-container">
          <label htmlFor="user-auth-input-password"><h4>Password</h4></label>
          <input
            id="user-auth-input-password"
            className="user-auth-form-input"
            type="password"
            placeholder="Password"
            value={newUserPassword}
            onChange={(event) => setNewUserPassword(event.target.value)}
            required
          />
        </div>

        <div className="accept-terms-container">
          <input
            type="checkbox"
            id="accept-terms"
            checked={termsAndConditionsCheckbox}
            onChange={() => setTermsAndConditionsCheckbox((prevState) => !prevState)}
          />
          <label htmlFor="accept-terms">I accept all terms and conditions</label>
        </div>

        <button
          type="submit"
          className="solid-success-btn form-user-auth-submit-btn"
          disabled={!termsAndConditionsCheckbox}
        >
          Create New Account
        </button>

        <div className="existing-user-container">
          <Link to="/login" className="links-with-blue-underline existing-user-link" id="existing-user-link">
            Already have an account &nbsp;
          </Link>
        </div>
      </form>
    </div>
  );
}

export { Signup };
