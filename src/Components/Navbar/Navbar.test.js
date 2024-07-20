// Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { Navbar } from './Navbar';

// Mock dependencies
jest.mock('jwt-decode', () => jest.fn());
jest.mock('../../index', () => ({
  useUserLogin: () => ({
    setUserLoggedIn: jest.fn(),
  }),
  useToast: () => ({
    showToast: jest.fn(),
  }),
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
    searchBarTerm: '',
    setSearchBarTerm: jest.fn(),
  }),
}));

describe('Navbar', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('BookBreeze')).toBeInTheDocument();
  });

  test('displays Login button when not logged in', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('displays Logout button when logged in', () => {
    localStorage.setItem('token', 'fake-token');
    
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls logout function and updates UI when Logout button is clicked', () => {
    localStorage.setItem('token', 'fake-token');

    render(
      <Router>
        <Navbar />
      </Router>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('shows search bar on shop page', () => {
    window.history.pushState({}, 'Shop Page', '/shop');

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
});
