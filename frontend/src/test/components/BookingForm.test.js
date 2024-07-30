import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingForm from '../../routes/BookingForm';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Mock AuthService and axios
jest.mock('axios');

const renderWithRouter = (ui, { route = '/booking' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(<Router>{ui}</Router>);
};

describe('BookingForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders BookingForm form', () => {
    renderWithRouter(<BookingForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message to hotel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create booking/i })).toBeInTheDocument();
  });

  test('validates form inputs for missing name', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for invalid card number', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '123abc' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/card number must be numeric/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for missing card number', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/card number is required/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for card number length not 16', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '123456789012345' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/card number must be 16 digits/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for invalid expiry date', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '13/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/expiry date must be valid numbers in MM\/YY format/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for missing expiry date', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/expiry date is required/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for invalid cvv', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '12a' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/cvv must be numeric/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for missing cvv', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '12/25' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/cvv is required/i)).toBeInTheDocument();
    });
  });

  test('validates form inputs for cvv length not 3', async () => {
    renderWithRouter(<BookingForm />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /create booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/cvv number must be 3 digits/i)).toBeInTheDocument();
    });
  });
  
});
