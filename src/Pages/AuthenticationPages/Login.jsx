import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useToast, useUserLogin, useWishlist, useCart, useOrders } from "../../index";
import "./UserAuth.css";

function Login() {
  const { setUserLoggedIn } = useUserLogin();
  const { showToast } = useToast();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { dispatchUserOrders } = useOrders();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  function loginUser(event) {
    event.preventDefault();
    axios
      .post("http://localhost:5000/api/v1/user/login", {
        email: userEmail,
        password: userPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          const { token, message, data } = res.data;
          localStorage.setItem("token", token);

          // // Decode token to get user data (Optional)
          // const decodedUser = jwtDecode(token);

          // showToast("success", "", message);
          // setUserLoggedIn(true);

          // // Updating state with user information if needed
          // dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: data.wishlist });
          // dispatchUserCart({ type: "UPDATE_USER_CART", payload: data.cart });
          // dispatchUserOrders({ type: "UPDATE_USER_ORDERS", payload: data.orders });

          navigate("/shop");
        } else {
          showToast("error", "", "Invalid credentials");
        }
      })
      .catch((err) => {
        showToast("error", "", err.response?.data?.message || "Error logging in. Please try again");
      });
  }

  return (
    <div className="user-auth-content-container">
      <form onSubmit={loginUser} className="user-auth-form">
        <h2>Login</h2>

        <div className="user-auth-input-container">
          <label htmlFor="user-auth-input-email"><h4>Email address</h4></label>
          <input
            id="user-auth-input-email"
            className="user-auth-form-input"
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
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
            value={userPassword}
            onChange={(event) => setUserPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="solid-success-btn form-user-auth-submit-btn">
          Login
        </button>

        <div className="new-user-container">
          <Link to="/signup" className="links-with-blue-underline" id="new-user-link">
            Create new account &nbsp;
          </Link>
        </div>
      </form>
    </div>
  );
}

export { Login };
