import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthContext } from "./components/home/AuthContext"; // 

// Utility to render with AuthContext
const renderWithAuthProvider = (ui, { isLoggedIn = false, username = "" } = {}) => {
  return render(
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        setUsername: jest.fn(),
        handleLogin: jest.fn(),
        handleLogout: jest.fn(),
      }}
    >
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("App Component", () => {
  it("renders the Header and Footer", () => {
    renderWithAuthProvider(<App />);

    expect(screen.getByRole("link", { name: /Byte/i })).toBeInTheDocument();
    expect(screen.getByText(/Created by:/i)).toBeInTheDocument();
  });

  it("renders the Home component by default (at root path)", () => {
    renderWithAuthProvider(<App />, { isLoggedIn: false });

    expect(screen.getByText(/Welcome Player/i)).toBeInTheDocument();
  });

  it("does not render TopResults when not logged in", () => {
    renderWithAuthProvider(<App />, { isLoggedIn: false });

    expect(screen.queryByRole("link", { name: /top results/i })).not.toBeInTheDocument();
  });
});
