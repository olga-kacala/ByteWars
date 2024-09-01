import { generateCards } from "./CardGenerator";
import Card from "../classes/Card";

describe("generateCards", () => {
  it("generates 8 cards for the human side with correct names", () => {
    const humanCards = generateCards("human");

    expect(humanCards).toHaveLength(8);

    humanCards.forEach((card) => {
      expect(card.side).toBe("human");
    });

    const humanCardNames = [
      "Warrior",
      "Nerd",
      "Granny",
      "CEO",
      "Librarian",
      "Athlete",
      "Scientist",
      "Doctor",
    ];
    const generatedNames = humanCards.map((card) => card.name);
    expect(generatedNames).toEqual(humanCardNames);
  });

  it("generates 8 cards for the robot side with correct names", () => {
    const robotCards = generateCards("robot");

    expect(robotCards).toHaveLength(8);

    robotCards.forEach((card) => {
      expect(card.side).toBe("robot");
    });

    const robotCardNames = [
      "RoboCap",
      "Wally",
      "Fax Machine",
      "Tesla",
      "Flip Phone",
      "Internet Explorer",
      "Smartphone",
      "AI Assistant",
    ];
    const generatedNames = robotCards.map((card) => card.name);
    expect(generatedNames).toEqual(robotCardNames);
  });

  it("creates Card instances with expected properties", () => {
    const humanCards = generateCards("human");
    const robotCards = generateCards("robot");

    humanCards.forEach((card) => {
      expect(card).toBeInstanceOf(Card);
      expect(card).toHaveProperty("powerAttack");
      expect(card).toHaveProperty("speedAttack");
      expect(card).toHaveProperty("luck");
    });

    robotCards.forEach((card) => {
      expect(card).toBeInstanceOf(Card);
      expect(card).toHaveProperty("powerAttack");
      expect(card).toHaveProperty("speedAttack");
      expect(card).toHaveProperty("luck");
    });
  });
  
});
