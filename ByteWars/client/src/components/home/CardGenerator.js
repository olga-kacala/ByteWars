import Card from "../classes/Card";

export const generateCards = (side) => {
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

  const cardNames = side === "human" ? humanCardNames : robotCardNames;
  return cardNames.map((name) => new Card(name, side));
};
