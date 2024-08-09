import "./App.css";
// import { useEffect, useLayoutEffect } from 'react';
// import axios from "axios"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Navbar,
  Toast,
  Home,
  Shop,
  ProductPage,
  Login,
  Signup,
  Cart,
  Orders,
  useUserLogin,
  useCart,
} from "./index";

function App() {
  const { userLoggedIn } = useUserLogin();
  const { dispatchUserCart } = useCart();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/shop" exact element={<Shop />} />
          <Route path="/shop/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        <Toast position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
