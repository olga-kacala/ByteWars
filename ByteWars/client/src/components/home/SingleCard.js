import React, { useState } from "react";
import classes from "./SingleCard.module.css";

export const SingleCard = ({ card, onClick }) => {
  const [isUsed, setIsUsed] = useState(false);
  let luckyFactor;

  // Calculate luckyFactor based on luck value
  if (card.luck <= 4) {
    luckyFactor = card.luck * (Math.random() * 0.2 + 0.1); // Lower impact
  } else if (card.luck <= 6) {
    luckyFactor = card.luck * (Math.random() * 0.3 + 0.2); // Moderate impact
  } else {
    luckyFactor = card.luck * (Math.random() * 0.4 + 0.3); // Higher impact
  }

  // Calculate the attack using a combination of power, speed, and luck
  let attack =
    card.powerAttack * (1 + luckyFactor / 2) - (1 / card.speedAttack) * 10;
  attack = Math.ceil(attack); // Round up to the nearest whole number

  const handleClick = () => {
    if (!isUsed) {
      onClick(attack);
      setIsUsed(true);
    }
  };

  return (
    <div className={classes.card} onClick={handleClick}>
      {isUsed ? (
        <div className={classes.covered}>
          <div>Byte Wars</div>
        </div>
      ) : (
        <div className={classes.front}>
          <div className={classes.cardName} data-testid="card">
            <h3>{card.name}</h3>
          </div>
          <div className={classes.valuesContainer}>
            <p>Power: {card.powerAttack}</p>
            <p>Speed: {card.speedAttack}</p>
            <p>Luck: {card.luck}</p>
          </div>
        </div>
      )}
    </div>
  );
};
