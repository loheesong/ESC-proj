// Register.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import Register from "../../routes/Register";
import AuthService from "../../services/AuthService";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

// Mock AuthService
jest.mock("../../services/AuthService");
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
  googleLogout: jest.fn()
}));

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Register form", () => {
    render(<Register />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument();
  });

  test("validates form inputs", async () => {
    render(<Register />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Check for individual validation messages
    await waitFor(() => {
      expect(screen.getByText(/the username must be between 3 and 20 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/this is not a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/the password must be between 6 and 40 characters/i)).toBeInTheDocument();
    });
  });

  test("handles form submission", async () => {
    AuthService.register.mockResolvedValueOnce({ data: { message: "Registration successful" } });

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "testuser@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith("testuser", "testuser@example.com", "password");
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  test("handles Google login", async () => {
    const googleLoginMock = jest.fn();
    useGoogleLogin.mockReturnValue(googleLoginMock);

    render(<Register />);
    fireEvent.click(screen.getByText(/Google/i));
    expect(googleLoginMock).toHaveBeenCalled();
  });
});
