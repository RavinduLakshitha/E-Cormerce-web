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

jest.mock("jwt-decode");
jest.mock("../../index");

describe("Navbar", () => {
  const mockSetUserLoggedIn = jest.fn();
  const mockShowToast = jest.fn();
  const mockDispatchUserWishlist = jest.fn();
  const mockDispatchUserCart = jest.fn();
  const mockDispatchUserOrders = jest.fn();
  const mockSetSearchBarTerm = jest.fn();

  beforeEach(() => {
    useUserLogin.mockReturnValue({
      setUserLoggedIn: mockSetUserLoggedIn,
    });
    useToast.mockReturnValue({
      showToast: mockShowToast,
    });
    useWishlist.mockReturnValue({
      userWishlist: [],
      dispatchUserWishlist: mockDispatchUserWishlist,
    });
    useCart.mockReturnValue({
      userCart: [],
      dispatchUserCart: mockDispatchUserCart,
    });
    useOrders.mockReturnValue({
      userOrders: [],
      dispatchUserOrders: mockDispatchUserOrders,
    });
    useSearchBar.mockReturnValue({
      searchBarTerm: "",
      setSearchBarTerm: mockSetSearchBarTerm,
    });

    localStorage.clear();
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

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(mockSetUserLoggedIn).toHaveBeenCalledWith(false);
    expect(mockDispatchUserWishlist).toHaveBeenCalledWith({
      type: "UPDATE_USER_WISHLIST",
      payload: [],
    });
    expect(mockDispatchUserCart).toHaveBeenCalledWith({
      type: "UPDATE_USER_CART",
      payload: [],
    });
    expect(mockDispatchUserOrders).toHaveBeenCalledWith({
      type: "UPDATE_USER_ORDERS",
      payload: [],
    });
    expect(mockShowToast).toHaveBeenCalledWith(
      "success",
      "",
      "Logged out successfully"
    );
  });

  test("handles invalid token", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    localStorage.setItem("token", "fakeToken");
    jwt_decode.mockReturnValue(null);

    expect(localStorage.getItem("token")).toBe("fakeToken");
    expect(mockSetUserLoggedIn).toHaveBeenCalledWith(false);
    expect(localStorage.getItem("token")).toBeNull();
  });

  test("handles valid token", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    localStorage.setItem("token", "validToken");
    jwt_decode.mockReturnValue({ user: "validUser" });

    expect(localStorage.getItem("token")).toBe("validToken");
    expect(mockSetUserLoggedIn).toHaveBeenCalledWith(true);
  });
});
