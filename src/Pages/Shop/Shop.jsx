import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import "./Shop.css";
import {
  Sidebar,
  ProductCard,
  useWishlist,
  useCart,
  useSearchBar,
  Pagination,
} from "../../index.js";
import { useProductAvailable } from "../../Context/product-context";

const jwt_decode = jwtDecode;

function Shop(props) {
  let {
    productsAvailableList,
    dispatchSortedProductsList,
    productFilterOptions,
  } = useProductAvailable();

  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { pathname } = useLocation();
  const { searchBarTerm } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, currentPage]);

  useEffect(() => {
    // Assuming productsAvailableList and productFilterOptions are provided via context
    if (
      JSON.stringify(productsAvailableList) === JSON.stringify([]) &&
      JSON.stringify(productFilterOptions) ===
        JSON.stringify({
          includeOutOfStock: true,
          onlyFastDeliveryProducts: false,
          minPrice: 0,
          maxPrice: 1200,
          fiction: true,
          thriller: true,
          tech: true,
          philosophy: true,
          romance: true,
          manga: true,
          minRating: 1,
        })
    ) {
      
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem("token");
      } else {
        
      }
    }
  }, []);

  let searchedProducts = productsAvailableList.filter((productdetails) => {
    return (
      productdetails.bookName
        .toLowerCase()
        .includes(searchBarTerm.toLowerCase()) ||
      productdetails.author.toLowerCase().includes(searchBarTerm.toLowerCase())
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  let currentSearchedProducts = searchedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  let currentProductsAvailableList = productsAvailableList.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div>
      <div className="shop-container">
        <Sidebar />
        <div className="products-container">
          <h2>
            Showing{" "}
            {searchBarTerm === ""
              ? productsAvailableList.length
              : searchedProducts.length}{" "}
            products
          </h2>
          <div className="products-card-grid">
            {productsAvailableList &&
              (searchBarTerm === ""
                ? currentProductsAvailableList.map((productdetails) => (
                    <ProductCard
                      key={productdetails._id}
                      productdetails={productdetails}
                    />
                  ))
                : currentSearchedProducts.map((productdetails) => (
                    <ProductCard
                      key={productdetails._id}
                      productdetails={productdetails}
                    />
                  )))}
          </div>
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={
              searchBarTerm === ""
                ? productsAvailableList.length
                : searchedProducts.length
            }
            paginate={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export { Shop };
