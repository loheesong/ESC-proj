import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import Profile from "../../routes/Profile";
import AuthService from "../../services/AuthService";

// Mock AuthService
jest.mock("../../services/AuthService");

describe("Profile Component", () => {
  const currentUser = {
    username: "testuser",
    email: "testuser@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    AuthService.getCurrentUser.mockReturnValue(currentUser);
  });

  test("renders Profile form", () => {
    render(<Profile />);
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test("validates form inputs", async () => {
    render(<Profile />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "ab" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalidemail" } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/The username must be between 3 and 20 characters./i)).toBeInTheDocument();
      expect(screen.getByText(/This is not a valid email./i)).toBeInTheDocument();
    });
  });

  test("handles profile update", async () => {
    AuthService.updateProfile.mockResolvedValueOnce({ data: { message: "Profile updated successfully" } });
    
    render(<Profile />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "newuser@example.com" } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(AuthService.updateProfile).toHaveBeenCalledWith({ username: "newuser", email: "newuser@example.com" });
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });
  });

  test("invalid username", async () => {
    
    render(<Profile />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "a" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "newuser@example.com" } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/The username must be between 3 and 20 characters./i)).toBeInTheDocument();
    });
  });

  test("invalid email", async () => {
    
    render(<Profile />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "notanemail" } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/This is not a valid email./i)).toBeInTheDocument();
    });
  });

  test("required username", async () => {
    
    render(<Profile />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "newuser@example.com" } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/This field is required!/i)).toBeInTheDocument();
    });
  });

  test("required email", async () => {
    
    render(<Profile />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "" } });
    
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/This field is required!/i)).toBeInTheDocument();
    });
  });

  test("handles account deletion", async () => {
    AuthService.deleteaccount.mockResolvedValueOnce({ data: { message: "Account deleted successfully" } });
    
    render(<Profile />);
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    await waitFor(() => {
      expect(AuthService.deleteaccount).toHaveBeenCalledWith({ username: "testuser", email: "testuser@example.com" });
      expect(screen.getByText(/Account deleted successfully/i)).toBeInTheDocument();
    });
  });
});
