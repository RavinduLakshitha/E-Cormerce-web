import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";
import {
  useUserLogin,
  useToast,
  useWishlist,
  useCart,
  useOrders,
  useSearchBar,
} from "../../index";
import jwt_decode from "jwt-decode";

jest.mock("../../index");
jest.mock("jwt-decode");

describe("Navbar", () => {
  beforeEach(() => {
    useWishlist.mockReturnValue({
      userWishlist: [],
      dispatchUserWishlist: jest.fn(),
    });
    useCart.mockReturnValue({
      userCart: [],
      dispatchUserCart: jest.fn(),
    });
    useOrders.mockReturnValue({
      userOrders: [],
      dispatchUserOrders: jest.fn(),
    });
    useUserLogin.mockReturnValue({
      setUserLoggedIn: jest.fn(),
    });
    useToast.mockReturnValue({
      showToast: jest.fn(),
    });
    useSearchBar.mockReturnValue({
      searchBarTerm: "",
      setSearchBarTerm: jest.fn(),
    });
  });

  test("renders Navbar component", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("BookBreeze")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("logs out user", () => {
    localStorage.setItem("token", "fakeToken");
    const setUserLoggedIn = jest.fn();
    const dispatchUserWishlist = jest.fn();
    const dispatchUserCart = jest.fn();
    const dispatchUserOrders = jest.fn();
    const showToast = jest.fn();

    useUserLogin.mockReturnValue({ setUserLoggedIn });
    useWishlist.mockReturnValue({
      userWishlist: [],
      dispatchUserWishlist,
    });
    useCart.mockReturnValue({
      userCart: [],
      dispatchUserCart,
    });
    useOrders.mockReturnValue({
      userOrders: [],
      dispatchUserOrders,
    });
    useToast.mockReturnValue({ showToast });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(setUserLoggedIn).toHaveBeenCalledWith(false);
    expect(dispatchUserWishlist).toHaveBeenCalledWith({
      type: "UPDATE_USER_WISHLIST",
      payload: [],
    });
    expect(dispatchUserCart).toHaveBeenCalledWith({
      type: "UPDATE_USER_CART",
      payload: [],
    });
    expect(dispatchUserOrders).toHaveBeenCalledWith({
      type: "UPDATE_USER_ORDERS",
      payload: [],
    });
    expect(showToast).toHaveBeenCalledWith(
      "success",
      "",
      "Logged out successfully"
    );
  });
});
