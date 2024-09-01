import React, { useEffect, useState } from "react";
import classes from "./TopResults.module.css";

export const TopResults = () => {
  const [topResults, setTopResults] = useState([]);

  useEffect(() => {
    const fetchTopResults = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/topResults");
        if (!response.ok) {
          throw new Error("Failed to fetch top results");
        }
        const data = await response.json();
        setTopResults(data);
      } catch (error) {
        console.error("Error fetching top results:", error);
      }
    };

    fetchTopResults();
  }, []);

  const handleDeleteUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/v1/deleteUsers", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete users");
      }
      alert("All users deleted successfully");
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("Error deleting users");
    }
  };

  const handleDeleteGames = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/v1/deleteGames", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete games");
      }
      alert("All games deleted successfully");
      setTopResults([]);
    } catch (error) {
      console.error("Error deleting games:", error);
      alert("Error deleting games");
    }
  };

  return (
    <div className={classes.topResults}>
      <h2>Top 10 Results</h2>
      <ul>
        {topResults.map((result, index) => (
          <p key={index}>
            Total Attack: {result.totalAttack}, Side: {result.side}
          </p>
        ))}
      </ul>
      <button onClick={handleDeleteGames}>Delete all games</button>
      <button onClick={handleDeleteUsers}>Delete all users</button>
    </div>
  );
};
