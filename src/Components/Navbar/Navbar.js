import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Navbar from './Navbar';

jest.mock('jwt-decode', () => jest.fn());

const mockUseWishlist = jest.fn().mockReturnValue({
  userWishlist: [],
  dispatchUserWishlist: jest.fn(),
});

const mockUseCart = jest.fn().mockReturnValue({
  userCart: [],
  dispatchUserCart: jest.fn(),
});

const mockUseOrders = jest.fn().mockReturnValue({
  userOrders: [],
  dispatchUserOrders: jest.fn(),
});

const mockUseUserLogin = jest.fn().mockReturnValue({
  setUserLoggedIn: jest.fn(),
});

const mockUseToast = jest.fn().mockReturnValue({
  showToast: jest.fn(),
});

const mockUseSearchBar = jest.fn().mockReturnValue({
  searchBarTerm: '',
  setSearchBarTerm: jest.fn(),
});

jest.mock('../../index', () => ({
  useWishlist: () => mockUseWishlist(),
  useCart: () => mockUseCart(),
  useOrders: () => mockUseOrders(),
  useUserLogin: () => mockUseUserLogin(),
  useToast: () => mockUseToast(),
  useSearchBar: () => mockUseSearchBar(),
}));

describe('Navbar', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login button when user is not logged in', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('renders logout button when user is logged in', () => {
    localStorage.setItem('token', 'dummyToken');
    jwt_decode.mockReturnValue({ user: 'testUser' });

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('handles logout correctly', () => {
    localStorage.setItem('token', 'dummyToken');
    jwt_decode.mockReturnValue({ user: 'testUser' });

    const { getByText } = render(
      <Router>
        <Navbar />
      </Router>
    );

    fireEvent.click(getByText(/logout/i));

    expect(mockUseUserLogin().setUserLoggedIn).toHaveBeenCalledWith(false);
    expect(mockUseWishlist().dispatchUserWishlist).toHaveBeenCalledWith({
      type: 'UPDATE_USER_WISHLIST',
      payload: [],
    });
    expect(mockUseCart().dispatchUserCart).toHaveBeenCalledWith({
      type: 'UPDATE_USER_CART',
      payload: [],
    });
    expect(mockUseOrders().dispatchUserOrders).toHaveBeenCalledWith({
      type: 'UPDATE_USER_ORDERS',
      payload: [],
    });
    expect(mockUseToast().showToast).toHaveBeenCalledWith(
      'success',
      '',
      'Logged out successfully'
    );
  });
});
