class Card {
  constructor(name, side) {
    this.name = name;
    this.side = side;
    this.powerAttack = this.generatePowerAttack();
    this.speedAttack = this.generateSpeedAttack();
    this.luck = this.generateLuck();
  }

  generatePowerAttack() {
    if (this.side === "human") {
      switch (this.name) {
        case "Warrior":
          return 20;
        case "Nerd":
          return 10;
        case "Granny":
          return 5;
        case "CEO":
          return 20;
        case "Librarian":
          return 15;
        case "Athlete":
          return 18;
        case "Scientist":
          return 12;
        case "Doctor":
          return 14;
        default:
          return 10;
      }
    } else if (this.side === "robot") {
      switch (this.name) {
        case "RoboCap":
          return 28;
        case "Wally":
          return 15;
        case "Fax Machine":
          return 12;
        case "Tesla":
          return 25;
        case "Flip Phone":
          return 10;
        case "Internet Explorer":
          return 8;
        case "Smartphone":
          return 18;
        case "AI Assistant":
          return 22;
        default:
          return 10;
      }
    }
    return 10;
  }

  generateSpeedAttack() {
    if (this.side === "human") {
      switch (this.name) {
        case "Warrior":
          return 6;
        case "Nerd":
          return 1;
        case "Granny":
          return 2;
        case "CEO":
          return 4;
        case "Librarian":
          return 3;
        case "Athlete":
          return 5;
        case "Scientist":
          return 4;
        case "Doctor":
          return 3;
        default:
          return 5;
      }
    } else if (this.side === "robot") {
      switch (this.name) {
        case "RoboCap":
          return 10;
        case "Wally":
          return 12;
        case "Fax Machine":
          return 5;
        case "Tesla":
          return 9;
        case "Flip Phone":
          return 3;
        case "Internet Explorer":
          return 2;
        case "Smartphone":
          return 12;
        case "AI Assistant":
          return 11;
        default:
          return 5;
      }
    }
    return 5;
  }

  generateLuck() {
    if (this.side === "human") {
      switch (this.name) {
        case "Warrior":
          return 2;
        case "Nerd":
          return 7;
        case "Granny":
          return 9;
        case "CEO":
          return 5;
        case "Librarian":
          return 8;
        case "Athlete":
          return 3;
        case "Scientist":
          return 1;
        case "Doctor":
          return 7;
        default:
          return 5;
      }
    } else if (this.side === "robot") {
      switch (this.name) {
        case "RoboCap":
          return 2;
        case "Wally":
          return 4;
        case "Fax Machine":
          return 4;
        case "Tesla":
          return 1;
        case "Flip Phone":
          return 3;
        case "Internet Explorer":
          return 1;
        case "Smartphone":
          return 4;
        case "AI Assistant":
          return 4;
        default:
          return 4;
      }
    }
    return 2;
  }
}

export default Card;
