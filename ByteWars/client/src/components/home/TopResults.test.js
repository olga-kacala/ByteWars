import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { TopResults } from "./TopResults";

// Mock global fetch and localStorage
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("topResults")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { totalAttack: 100, side: "human" },
            { totalAttack: 200, side: "robot" },
          ]),
      });
    }
    if (url.includes("deleteGames")) {
      return Promise.resolve({ ok: true });
    }
    if (url.includes("deleteUsers")) {
      return Promise.resolve({ ok: true });
    }
    return Promise.reject(new Error("Not Found"));
  });

  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => "test-token"),
    },
    writable: true,
  });

  // Mock window.alert
  window.alert = jest.fn();

  // Mock console.error
  console.error = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

it("fetches and displays top results", async () => {
  render(<TopResults />);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/topResults"
    );
  });

  await waitFor(() => {
    expect(
      screen.getByText("Total Attack: 100, Side: human")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Total Attack: 200, Side: robot")
    ).toBeInTheDocument();
  });
});

it("handles fetch errors gracefully", async () => {
  // Mock fetch to return an error
  fetch.mockRejectedValueOnce(new Error("Failed to fetch top results"));

  render(<TopResults />);

  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching top results:",
      expect.any(Error)
    );
  });

  expect(screen.queryByText(/Total Attack:/)).not.toBeInTheDocument();
});

it("displays an empty state when no results are returned", async () => {
  // Mock fetch to return an empty array
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  });

  render(<TopResults />);

  await waitFor(() => {
    expect(screen.queryByText(/Total Attack:/)).not.toBeInTheDocument();
  });
});

it("deletes all games when 'Delete all games' button is clicked", async () => {
  render(<TopResults />);

  const deleteGamesButton = screen.getByText("Delete all games");
  fireEvent.click(deleteGamesButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/deleteGames",
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer test-token",
        },
      }
    );
  });

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("All games deleted successfully");
  });
});

it("deletes all users when 'Delete all users' button is clicked", async () => {
  render(<TopResults />);

  const deleteUsersButton = screen.getByText("Delete all users");
  fireEvent.click(deleteUsersButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/v1/deleteUsers",
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer test-token",
        },
      }
    );
  });

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("All users deleted successfully");
  });
});
