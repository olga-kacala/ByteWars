import React, { useState } from "react";
import ImgHuman from "../../assets/img/human.png";
import ImgRobot from "../../assets/img/robot.png";
import { SingleCard } from "./SingleCard";
import { generateCards } from "./CardGenerator";
import classes from "./NewGame.module.css";

export const NewGame = () => {
  const [userRobot, setUserRobot] = useState(false);
  const [userHuman, setUserHuman] = useState(false);
  const [gameId, setGameId] = useState("");
  const [userHP, setUserHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [cards, setCards] = useState([]);
  const [attack, setAttack] = useState(0);
  const [opponentAttack, setOpponentAttack] = useState(0);
  const [opponentHit, setOpponentHit] = useState(false);
  const [status, setStatus] = useState("");
  const [totalAttack, setTotalAttack] = useState(0);

  const handleHuman = async () => {
    setUserHuman(true);
    await handleNewGame("human");
  };

  const handleRobot = async () => {
    setUserRobot(true);
    await handleNewGame("robot");
  };

  const handleNewGame = async (side) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await fetch("http://localhost:3000/api/v1/startGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ side }),
      });
      if (!response.ok) {
        throw new Error("Failed to start game");
      }

      const data = await response.json();
      setGameId(data.gameId);
      setUserHP(100);
      setOpponentHP(100);
      setTotalAttack(0);

      let generatedCards = generateCards(side);
      generatedCards = shuffleArray(generatedCards);

      const selectedCards = generatedCards.slice(0, 6);
      setCards(selectedCards);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleRestartGame = async () => {
    setUserRobot(false);
    setUserHuman(false);
    setGameId("");
    setUserHP(100);
    setOpponentHP(100);
    setCards([]);
    setAttack(0);
    setOpponentAttack(0);
    setTotalAttack(0);
  };

  const handleAttack = async (attackValue) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/attack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gameId, attackHP: attackValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to make attack");
      }

      const data = await response.json();
      setAttack(data.attackHP);
      setOpponentAttack(data.opponentAttackPower);
      setUserHP(data.userHealth);
      setOpponentHP(data.opponentHealth);
      setStatus(data.gameStatus);

      setTotalAttack((prevTotal) => {
        const updatedTotal = prevTotal + attackValue;

        if (data.gameStatus !== "ongoing") {
          saveTotalAttack(updatedTotal, data.gameStatus);
        }

        return updatedTotal;
      });

      setOpponentHit(true);
      setTimeout(() => setOpponentHit(false), 300);
    } catch (error) {
      console.error("Error making a move:", error);
    }
  };

  const saveTotalAttack = async (totalAttack, gameStatus) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/saveAttack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gameId, totalAttack, gameStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to save total attack");
      }
    } catch (error) {
      console.error("Error saving total attack:", error);
    }
  };

  return (
    <div className={classes.newGame}>
      {userHuman || userRobot ? (
        <div>
          {userHP <= 0 || opponentHP <= 0 ? (
            <div className={classes.endGameContainer}>
              <button type="button" onClick={handleRestartGame}>
                New Game
              </button>
              <div>
                {status === "won" ? (
                  <h1>Congrats you have won!</h1>
                ) : (
                  <h1>You have lost</h1>
                )}
              </div>
            </div>
          ) : (
            <>
              <p>
                {userHuman
                  ? "FIGHT Human!"
                  : "01100110 01101001 01100111 01101000 01110100"}
              </p>
              <div className={classes.cardsContainer}>
                {cards.map((card, index) => (
                  <SingleCard key={index} card={card} onClick={handleAttack} />
                ))}
              </div>
            </>
          )}

          <div className={classes.resultsContainer}>
            <section className={classes.fightResults}>
              <h3>You</h3>
              <div>HP: {userHP}</div>
              <div>Attack: {attack}</div>
              <div>Total Attack: {totalAttack}</div>
            </section>
            {userHuman ? (
              <img
                title="robot"
                alt="robot"
                src={ImgRobot}
                className={`${classes.opponentImg} ${
                  opponentHit ? classes.redEffect : ""
                }`}
              />
            ) : (
              <img
                title="human"
                alt="human"
                src={ImgHuman}
                className={`${classes.opponentImg} ${
                  opponentHit ? classes.redEffect : ""
                }`}
              />
            )}
            <section className={classes.fightResults}>
              <h3>{userHuman ? "Robot" : "Human"}</h3>
              <div>HP: {opponentHP}</div>
              <div>Attack: {opponentAttack}</div>
            </section>
          </div>
        </div>
      ) : (
        <div className={classes.chooseContainer}>
          <h2>Choose your character:</h2>
          <p>
            Will you harness the raw power of a robot’s lightning-fast attacks,
            or trust in the unpredictable luck of the human spirit? The fate of
            the battle rests in your hands—choose wisely!
          </p>
          <img title="robot" alt="robot" src={ImgRobot} onClick={handleRobot} />
          <img title="human" alt="human" src={ImgHuman} onClick={handleHuman} />
        </div>
      )}
    </div>
  );
};
