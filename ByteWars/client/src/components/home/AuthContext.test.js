import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthContext";

// Mock component to consume AuthContext
const TestComponent = () => {
  const { isLoggedIn, username, handleLogin, handleLogout } =
    useContext(AuthContext);

  return (
    <div>
      <p>Logged In: {isLoggedIn ? "Yes" : "No"}</p>
      <p>Username: {username}</p>
      <button onClick={() => handleLogin("testToken", "testUser")}>
        Login
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  it("should have initial state with isLoggedIn false and username empty", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/Logged In:/).textContent).toBe("Logged In: No");
    expect(screen.getByText(/Username:/).textContent).toBe("Username: ");
  });

  it("should update state and localStorage on login", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(screen.getByText(/Logged In:/).textContent).toBe("Logged In: Yes");
    expect(screen.getByText(/Username:/).textContent).toBe(
      "Username: testUser"
    );
    expect(localStorage.getItem("token")).toBe("testToken");
  });

  it("should clear state and localStorage on logout", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First, login to set the state
    fireEvent.click(screen.getByText("Login"));

    // Now, logout and check the state
    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByText(/Logged In:/).textContent).toBe("Logged In: No");
    expect(screen.getByText(/Username:/).textContent).toBe("Username: ");
    expect(localStorage.getItem("token")).toBeNull();
  });
  
});
