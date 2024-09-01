# Use the official Node.js image as the base image
FROM node:19.9.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container (from the context, which is already ./server)
COPY package*.json ./

# Install the server dependencies
RUN npm install

# Copy the rest of the server application code to the container
COPY . .

# Expose the port that the server runs on
EXPOSE 3000

# Command to run the server
CMD ["npm", "start"]
