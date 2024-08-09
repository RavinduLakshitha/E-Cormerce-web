import { useEffect } from "react";
import "./ProductPage.css";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useToast, useCart } from "../../index";

const jwt_decode = jwtDecode;
function ProductPage() {
  const navigate = useNavigate();

  const { dispatchUserCart } = useCart();
  const { showToast } = useToast();
  const { id } = useParams();
  const productDetailsOnStorage = localStorage.getItem(`${id}`);
  const productdetails = JSON.parse(productDetailsOnStorage);
  const {
    _id,
    bookName,
    author,
    originalPrice,
    discountedPrice,
    discountPercent,
    imgSrc,
    imgAlt,
    badgeText,
    outOfStock,
    rating,
    description,
  } = productdetails;

  
  async function addItemToCart() {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt_decode(token);

      if (!user) {
        localStorage.removeItem("token");
        showToast("warning", "", "Kindly Login");
        navigate("/login");
      } else {
        let cartUpdateResponse = await axios.patch(
          "https://bookztron-server.vercel.app/api/cart",
          {
            productdetails,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        );
        if (cartUpdateResponse.data.status === "ok") {
          dispatchUserCart({
            type: "UPDATE_USER_CART",
            payload: cartUpdateResponse.data.user.cart,
          });
          showToast("success", "", "Item successfully added to cart");
        }
      }
    } else {
      showToast("warning", "", "Kindly Login");
    }
  }

  return (
    <div className="product-page-container">
      <div className="product-page-item">
        <img className="bookcover-image" src={imgSrc} alt={imgAlt}></img>
        <div className="item-details">
          <h2>{bookName}</h2>
          <hr></hr>
          <p>
            <b>Author : </b> &nbsp;&nbsp; <span>{author}</span>{" "}
          </p>
          <p className="item-description">
            <b>Description : </b> &nbsp;&nbsp; <span>{description}</span>{" "}
          </p>
          <p className="item-rating">
            <b>Rating : </b> &nbsp;&nbsp; <span>{rating}</span>{" "}
          </p>
          <h3 className="item-price-details">
            Rs. {discountedPrice} &nbsp;&nbsp;<del>Rs. {originalPrice}</del>{" "}
            &nbsp;&nbsp;
            <span className="discount-on-item">({discountPercent}% off)</span>
          </h3>
          {outOfStock === true && (
            <p className="out-of-stock-text">Item is currently out of stock</p>
          )}
          {outOfStock === true ? (
            <div className="item-buttons">
              <button className="item-notify-me-btn solid-primary-btn">
                Notify Me
              </button>
            </div>
          ) : (
            <div className="item-buttons">
              
              <button
                onClick={() => {
                  addItemToCart();
                }}
                className="solid-warning-btn"
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { ProductPage };
