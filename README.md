# Byte Wars: AI vs Humans Documentation

In _Byte Wars: AI vs Humans_ 🤖, players engage in a whimsical conflict between artificial intelligence and humanity. Whether you choose to command advanced technology or lead the quirky human resistance, this game offers a strategic showdown in a digital battleground. Will you outwit the algorithms or rely on classic human ingenuity to win? Dive into this pixelated adventure where the fate of the digital realm is at stake! 🎮💥

## Contents

- [Byte Wars: AI vs Humans Documentation](#byte-wars-ai-vs-humans-documentation)
  - [Contents](#contents)
  - [Description](#description)
  - [Technical Requirements](#technical-requirements)
    - [Technologies Used](#technologies-used)
    - [Development Tools](#development-tools)
  - [API Documentation](#api-documentation)
    - [Endpoints](#endpoints)
  - [Database Schema](#database-schema)
    - [Relationships](#relationships)
    - [Users Table](#users-table)
    - [Games Table](#games-table)
    - [Schema Notes](#schema-notes)
  - [Start ByteWars App](#start-bytewars-app)
    - [Clone this Repository](#clone-this-repository)
    - [Navigate to the Project Folder](#navigate-to-the-project-folder)
    - [Create the .env File](#create-the-env-file)
    - [Install dependencies](#install-dependencies)
    - [Run in Docker Container](#run-in-docker-container)
    - [Access the Application](#access-the-application)
  - [Testing](#testing)
    - [How to test the client side](#how-to-test-the-client-side)
    - [How to test the server side](#how-to-test-the-server-side)

## Description

_Byte Wars: AI vs Humans_ is a strategic game where a human player battles against an AI opponent. Players can choose to be either human or robot, each with unique characters and abilities. The game involves drawing cards with varying attributes to perform attacks and utilize special abilities. The goal is to defeat the opponent by strategically managing health points and maximizing attack power.

## Technical Requirements

### Technologies Used

        - **Frontend:** React.js
        - **Backend:** Node.js
        - **Database:** PostgreSQL
        - **Containerization:** Docker

### Development Tools

      - **IDE:** Visual Studio Code
      - **Version Control:** Git

    ### Base URL

    The base URL for API local:  http://localhost:3001.

## API Documentation

### Endpoints

1. **Register User**

   - **URL:** `/register`
   - **Method:** POST
   - **Headers:**
     - `Content-Type: application/json`
   - **Body:**
     {
     "username": "string",
     "password": "string"
     }
   - **Response:**
     {
     "message": "User registered successfully"
     }

2. **Login User**

   - **URL:** `/login`
   - **Method:** POST
   - **Headers:**
     - `Content-Type: application/json`
   - **Body:**
     {
     "username": "string",
     "password": "string"
     }
   - **Response:**
     {
     "token": "string"
     }

3. **Start Game**

   - **URL:** `/startGame`
   - **Method:** POST
   - **Headers:**
     - `Content-Type: application/json`
     - `Authorization: Bearer [token]`
   - **Body:**
     {
     "side": "human" or "robot"
     }
   - **Response:**
     {
     "gameId": "string",
     "status": "string"
     }

4. **Attack Move**

   - **URL:** `/attack`
   - **Method:** POST
   - **Headers:**
     - `Content-Type: application/json`
     - `Authorization: Bearer [token]`
   - **Body:**
     {
     "gameId": "string",
     "attackHP": "number"
     }
   - **Response:**
     {
     "attackHP": "number",
     "opponentAttackPower": "number",
     "userHealth": "number",
     "opponentHealth": "number",
     "gameStatus": "string"
     }

5. **Save Total Attack**

   - **URL:** `/saveAttack`
   - **Method:** POST
   - **Headers:**
     - `Content-Type: application/json`
     - `Authorization: Bearer [token]`
   - **Body:**
     {
     "gameId": "string",
     "totalAttack": "number",
     "gameStatus": "string"
     }
   - **Response:**
     {
     "message": "Total attack saved successfully"
     }

6. **Get Top Results**

   - **URL:** `/topResults`
   - **Method:** GET
   - **Response:**
     [
     {
     "totalAttack": "number",
     "side": "string"
     }
     ]

7. **Delete All Users**

   - **URL:** `/deleteUsers`
   - **Method:** DELETE
   - **Headers:**
     - `Authorization: Bearer [token]`
   - **Response:**
     {
     "message": "All users deleted successfully"
     }

8. **Delete All Games**
   - **URL:** `/deleteGames`
   - **Method:** DELETE
   - **Headers:**
     - `Authorization: Bearer [token]`
   - **Response:**
     {
     "message": "All games deleted successfully"
     }

## Database Schema

### Relationships

- **Users and Games:**
  - There is no direct foreign key relationship between `Users` and `Games` in the current schema. However, each game can be associated with a user via application logic (e.g., a user might start or play a game).

### Users Table

- **id:** INTEGER, PRIMARY KEY, AUTOINCREMENT
  - The unique identifier for each user. Auto-incremented.
- **username:** TEXT, NOT NULL, UNIQUE
  - The username of the user. Must be unique.
- **password:** TEXT, NOT NULL
  - The hashed password of the user.

### Games Table

- **gameId:** TEXT, PRIMARY KEY
  - The unique identifier for each game.
- **status:** TEXT
  - The status of the game (e.g., "ongoing", "won", "lost").
- **side:** TEXT
  - The side chosen by the user (e.g., "human", "robot").
- **turn:** INTEGER
  - The current turn number in the game.
- **userHealth:** INTEGER
  - The current health of the user.
- **opponentHealth:** INTEGER
  - The current health of the opponent.
- **attackHP:** INTEGER
  - The attack power used in the most recent move.
- **totalAttack:** INTEGER, DEFAULT 0
  - The total attack power accumulated over the course of the game. Defaults to 0.

### Schema Notes

- **Users Table:**

  - The `id` column is an auto-incrementing primary key that uniquely identifies each user.
  - The `username` column is unique and required.
  - The `password` column stores the user's hashed password.

- **Games Table:**

  - The `gameId` serves as a unique identifier for each game session.
  - The `status` column indicates the current state of the game.
  - The `side` column tracks whether the player is on the "human" or "robot" side.
  - The `turn` column keeps track of the current turn in the game.
  - The `userHealth` and `opponentHealth` columns track the health status of the user and the opponent, respectively.
  - The `attackHP` column records the attack power used in the last move.
  - The `totalAttack` column accumulates the total attack power across the game.

- **Normalization:**  
  The schema is designed to be simple and normalized for the purposes of this game. Future extensions might include additional tables or fields to better track user-game relationships, such as adding a foreign key to link users to games they start or participate in.

- **Indexes:**  
  Indexes on `username` in the `Users` table and `gameId` in the `Games` table help improve query performance.

- **Security Considerations:**  
  Passwords are stored hashed, which is crucial for maintaining user security.

## Start ByteWars App

### Clone this Repository

Clone the entire repository using the command:

git clone https://github.com/olga-kacala/Node_JS.git

### Navigate to the Project Folder

cd Node_JS/Homework_12/ByteWars

### Create the .env File

cd server
touch .env

Copy the contents from .env.example into the .env file and replace the secret key placeholder with:

a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

### Install dependencies

Install the necessary dependencies for the server and client:

cd ..
npm install
cd client
npm install

### Run in Docker Container

To run the application in a Docker container, ensure you have Docker installed on your system. Use the following commands:

Start the application:
docker-compose up --build

Stop the application:
docker-compose down

### Access the Application

Open your browser and navigate to:

http://localhost:3001/

to interact with the app and start the battle! 💥💥

## Testing

### How to test the client side

Navigate to the client directory:

Homework_12/ByteWars/client

Run tests using npm or yarn:

npm test

or

yarn test

### How to test the server side

Navigate to the server directory:

Homework_12/ByteWars/server

Run tests using npm or yarn:

npm test

or

yarn test
