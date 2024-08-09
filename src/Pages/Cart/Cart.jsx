import "./Cart.css";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Fix: Use named import for jwtDecode
import axios from "axios";
import { Link } from "react-router-dom";
import {
  useCart,
  HorizontalProductCard,
  ShoppingBill,
} from "../../index";
import Lottie from "react-lottie";
import CartLottie from "../../Assets/Icons/cart.json";

function Cart() {
  const { userCart, dispatchUserCart } = useCart();

  let cartObj = {
    loop: true,
    autoplay: true,
    animationData: CartLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        localStorage.removeItem("token");
      } else {
        if (userCart.length === 0) {
          (async function getUpdatedCart() {
            let updatedUserInfo = await axios.get(
              "https://bookztron-server.vercel.app/api/user",
              {
                headers: {
                  "x-access-token": localStorage.getItem("token"),
                },
              }
            );

            if (updatedUserInfo.data.status === "ok") {
              dispatchUserCart({
                type: "UPDATE_USER_CART",
                payload: updatedUserInfo.data.user.cart,
              });
            }
          })();
        }
      }
    } else {
      dispatchUserCart({ type: "UPDATE_USER_CART", payload: [] });
    }
  }, [userCart, dispatchUserCart]);

  return (
    <div className="cart-content-container">
      <h2>{userCart.length} items in Cart</h2>
      {userCart.length === 0 ? (
        <div className="empty-cart-message-container">
          <Lottie
            options={cartObj}
            height={150}
            width={150}
            isStopped={false}
            isPaused={false}
          />
          <h2>Your cart is empty 🙃</h2>
          <Link to="/shop">
            <button className="solid-primary-btn">Go to shop</button>
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items-grid">
            {userCart.map((productDetails, index) => (
              <HorizontalProductCard
                key={index}
                productDetails={productDetails}
              />
            ))}
          </div>
          <ShoppingBill />
        </div>
      )}
    </div>
  );
}

export { Cart };
