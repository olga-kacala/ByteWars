import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NewGame } from "./NewGame";
import { SingleCard } from "./SingleCard";
import "@testing-library/jest-dom/extend-expect";

// Mocking localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  window.localStorage.setItem("token", "test-token"); // Mock token
});

describe("NewGame Component", () => {
  it("renders character selection screen initially", () => {
    render(<NewGame />);
    expect(screen.getByText("Choose your character:")).toBeInTheDocument();
    expect(screen.getByAltText("robot")).toBeInTheDocument();
    expect(screen.getByAltText("human")).toBeInTheDocument();
  });

  it("starts the game as human and renders the game screen", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ gameId: "12345" }),
    });

    render(<NewGame />);
    fireEvent.click(screen.getByAltText("human"));

    await waitFor(() => {
      expect(screen.getByText("FIGHT Human!")).toBeInTheDocument();
    });

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Robot")).toBeInTheDocument();
    expect(screen.getByText("Total Attack: 0")).toBeInTheDocument();
  });

  it("handles API failure when starting the game", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "Failed to start game" }),
    });

    console.error = jest.fn(); // Mock console error

    render(<NewGame />);
    fireEvent.click(screen.getByAltText("robot"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error starting game:",
        new Error("Failed to start game")
      );
    });
  });

  it("handles attack and updates state correctly", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        attackHP: 20,
        opponentAttackPower: 15,
        userHealth: 80,
        opponentHealth: 75,
        gameStatus: "ongoing",
      }),
    });

    render(<NewGame />);
    fireEvent.click(screen.getByAltText("human"));

    await waitFor(() => screen.getByText("FIGHT Human!"));

    const cardElements = await screen.findAllByTestId("card");

    // Ensure at least one card is found before clicking
    expect(cardElements.length).toBeGreaterThan(0);

    // Click the first card element
    fireEvent.click(cardElements[0]);

    await waitFor(() => {
      expect(screen.getByText("HP: 80")).toBeInTheDocument();
      expect(screen.getByText("Attack: 20")).toBeInTheDocument();
    });
  });

  it("restarts the game correctly", async () => {
    // Mocking the fetch call to simulate a game status of "won"
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        attackHP: 20,
        opponentAttackPower: 15,
        userHealth: 80,
        opponentHealth: 0, // Opponent has 0 health, implying the player has won
        gameStatus: "won", // Set the status to "won" or "lost" to display the "New Game" button
      }),
    });

    render(<NewGame />);

    fireEvent.click(screen.getByAltText("human"));

    await waitFor(() => screen.getByText("FIGHT Human!"));

    const cardElement = await screen.findAllByTestId("card");
    fireEvent.click(cardElement[0]);

    await waitFor(() => screen.getByText("New Game"));

    const button = screen.getByText("New Game");
    fireEvent.click(button);

    expect(screen.getByText("Choose your character:")).toBeInTheDocument();
    expect(screen.getByAltText("robot")).toBeInTheDocument();
    expect(screen.getByAltText("human")).toBeInTheDocument();
  });

  it("calls onClick when the card is clicked", () => {
    const mockOnClick = jest.fn();

    const goodLuck = {
      name: "goodLuck",
      powerAttack: 50,
      speedAttack: 2,
      luck: 8,
    };

    render(<SingleCard card={goodLuck} onClick={mockOnClick} />);
    const cardElement = screen.getByText(/goodLuck/i);
    fireEvent.click(cardElement);

    expect(mockOnClick).toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("handles card clicks appropriately with different luck values", () => {
    const mockOnClick = jest.fn();

    const cards = [
      { name: "badLuck", powerAttack: 10, speedAttack: 1, luck: 1 },
      { name: "goodLuck", powerAttack: 50, speedAttack: 2, luck: 8 },
      { name: "middleLuck", powerAttack: 25, speedAttack: 1.5, luck: 4 },
    ];

    cards.forEach((card) =>
      render(<SingleCard card={card} onClick={mockOnClick} />)
    );

    cards.forEach((card) => {
      const cardElement = screen.getByText(new RegExp(card.name, "i"));
      fireEvent.click(cardElement);
    });

    expect(mockOnClick).toHaveBeenCalledTimes(cards.length);
  });
});
