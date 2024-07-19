import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./Navbar";
import "@testing-library/jest-dom/extend-expect";

// Mocking context hooks
jest.mock("../../index", () => ({
  useUserLogin: () => ({ setUserLoggedIn: jest.fn() }),
  useToast: () => ({ showToast: jest.fn() }),
  useWishlist: () => ({
    userWishlist: [],
    dispatchUserWishlist: jest.fn(),
  }),
  useCart: () => ({
    userCart: [],
    dispatchUserCart: jest.fn(),
  }),
  useOrders: () => ({
    userOrders: [],
    dispatchUserOrders: jest.fn(),
  }),
  useSearchBar: () => ({
    searchBarTerm: "",
    setSearchBarTerm: jest.fn(),
  }),
}));

describe("Navbar Component", () => {
  const renderNavbar = () =>
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

  test("renders BookBreeze brand name", () => {
    renderNavbar();
    expect(screen.getByText("BookBreeze")).toBeInTheDocument();
  });

  test("renders login button when user is not logged in", () => {
    renderNavbar();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("renders logout button when user is logged in", () => {
    localStorage.setItem("token", "test-token");
    renderNavbar();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    localStorage.removeItem("token");
  });

  test("calls logout function when logout button is clicked", () => {
    localStorage.setItem("token", "test-token");
    renderNavbar();
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(screen.getByText("Login")).toBeInTheDocument();
    localStorage.removeItem("token");
  });

  test("renders wishlist icon with badge when user has wishlist items", () => {
    // Adjust mock to simulate wishlist items
    jest.mock("../../index", () => ({
      useWishlist: () => ({
        userWishlist: [{ id: 1 }],
        dispatchUserWishlist: jest.fn(),
      }),
    }));
    renderNavbar();
    const wishlistBadge = screen.getByText("1");
    expect(wishlistBadge).toBeInTheDocument();
  });

  test("renders cart icon with badge when user has cart items", () => {
    // Adjust mock to simulate cart items
    jest.mock("../../index", () => ({
      useCart: () => ({
        userCart: [{ id: 1 }],
        dispatchUserCart: jest.fn(),
      }),
    }));
    renderNavbar();
    const cartBadge = screen.getByText("1");
    expect(cartBadge).toBeInTheDocument();
  });

  test("renders orders icon with badge when user has orders", () => {
    // Adjust mock to simulate orders
    jest.mock("../../index", () => ({
      useOrders: () => ({
        userOrders: [{ id: 1 }],
        dispatchUserOrders: jest.fn(),
      }),
    }));
    renderNavbar();
    const ordersBadge = screen.getByText("1");
    expect(ordersBadge).toBeInTheDocument();
  });
});
