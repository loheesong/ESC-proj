import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from "react-router-dom";
import Login from "../../routes/Login";
import AuthService from "../../services/AuthService";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

// Mock AuthService
jest.mock("../../services/AuthService");
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
  googleLogout: jest.fn()
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders Login form", () => {
    render(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test("validates form inputs", async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getAllByText(/this field is required!/i)).toHaveLength(2);
    });
  });

  test("handles form submission", async () => {
    AuthService.login.mockResolvedValueOnce();

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith("testuser", "password");
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  test("handles Google login", async () => {
    const googleLoginMock = jest.fn();
    useGoogleLogin.mockReturnValue(googleLoginMock);

    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    expect(googleLoginMock).toHaveBeenCalled();
  });
});
