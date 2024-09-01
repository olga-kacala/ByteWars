import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Home } from "./Home";
import { AuthContext } from "./AuthContext";
import { MemoryRouter } from "react-router-dom";

describe("Home Component", () => {
  const mockHandleLogin = jest.fn();
  const mockHandleLogout = jest.fn();
  const mockSetUsername = jest.fn();
  const mockSetMessage = jest.fn();

  const renderHome = (isLoggedIn, username = "", message = "") =>
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isLoggedIn,
            username,
            handleLogin: mockHandleLogin,
            handleLogout: mockHandleLogout,
            setUsername: mockSetUsername,
            setMessage: mockSetMessage,
          }}
        >
          <Home />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    console.error = jest.fn();
  });

  it("calls handleLogin on successful login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "dummy-token" }),
      })
    );

    renderHome(false);

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testname" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockSetUsername).toHaveBeenCalledWith("testname");
      expect(mockHandleLogin).toHaveBeenCalledWith("dummy-token", "");
    });
  });

  it("handles login errors gracefully", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    renderHome(false);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testname" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error logging in:",
        expect.any(Error)
      );
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("calls handleLogout when logout button is clicked", () => {
    renderHome(true, "testname");

    fireEvent.click(screen.getByText("Logout"));

    expect(mockHandleLogout).toHaveBeenCalled();
  });

  it("handles registration errors gracefully", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Registration failed" }),
    });

    renderHome(false);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testname" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "testpass" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error registering:",
        expect.any(Error)
      );
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });
});
