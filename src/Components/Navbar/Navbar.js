import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./Navbar";
import "@testing-library/jest-dom/extend-expect";

// Mock hooks and functions used in Navbar
jest.mock("../../index", () => ({
  useUserLogin: () => ({
    setUserLoggedIn: jest.fn()
  }),
  useToast: () => ({
    showToast: jest.fn()
  }),
  useWishlist: () => ({
    userWishlist: [],
    dispatchUserWishlist: jest.fn()
  }),
  useCart: () => ({
    userCart: [],
    dispatchUserCart: jest.fn()
  }),
  useOrders: () => ({
    userOrders: [],
    dispatchUserOrders: jest.fn()
  }),
  useSearchBar: () => ({
    searchBarTerm: "",
    setSearchBarTerm: jest.fn()
  })
}));

describe("Navbar Component", () => {
  test("renders BookBreeze brand name", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("BookBreeze")).toBeInTheDocument();
  });

  test("shows login button when token is not present", () => {
    localStorage.removeItem("token");
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows logout button when token is present", () => {
    localStorage.setItem("token", "dummy-token");
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("handles logout button click", () => {
    const setUserLoggedIn = jest.fn();
    const dispatchUserWishlist = jest.fn();
    const dispatchUserCart = jest.fn();
    const dispatchUserOrders = jest.fn();
    const showToast = jest.fn();

    jest.mock("../../index", () => ({
      useUserLogin: () => ({
        setUserLoggedIn
      }),
      useToast: () => ({
        showToast
      }),
      useWishlist: () => ({
        userWishlist: [],
        dispatchUserWishlist
      }),
      useCart: () => ({
        userCart: [],
        dispatchUserCart
      }),
      useOrders: () => ({
        userOrders: [],
        dispatchUserOrders
      }),
      useSearchBar: () => ({
        searchBarTerm: "",
        setSearchBarTerm: jest.fn()
      })
    }));

    localStorage.setItem("token", "dummy-token");
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(dispatchUserWishlist).toHaveBeenCalledWith({
      type: "UPDATE_USER_WISHLIST",
      payload: []
    });
    expect(dispatchUserCart).toHaveBeenCalledWith({
      type: "UPDATE_USER_CART",
      payload: []
    });
    expect(dispatchUserOrders).toHaveBeenCalledWith({
      type: "UPDATE_USER_ORDERS",
      payload: []
    });
    expect(setUserLoggedIn).toHaveBeenCalledWith(false);
    expect(showToast).toHaveBeenCalledWith("success", "", "Logged out successfully");
  });
});
