import React, { useState, useContext } from "react";
import classes from "./Home.module.css";
import { NewGame } from "./NewGame";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export function Home() {
  const { isLoggedIn, handleLogin, handleLogout, username, setUsername } =
    useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      handleLogin(data.token, username);
      setMessage("");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(error.message);
    }
  };

  const register = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await response.json();
      login();
    } catch (error) {
      console.error("Error registering:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className={classes.App}>
      {isLoggedIn ? (
        <>
          <nav>
            <p>Hello, {username}!</p>
            <Link to="/TopResults" className={classes.results}>
              Top results
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          <NewGame />
        </>
      ) : (
        <>
          <h1>Welcome Player</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={login}>
              Login
            </button>
            <div>
              <h4>Not a player yet?</h4>
              <button type="button" onClick={register}>
                Register
              </button>
            </div>
            <div>{message}</div>
          </form>
        </>
      )}
    </div>
  );
}
