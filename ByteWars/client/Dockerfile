# Use the official Node.js image as the base image
FROM node:19.9.0

# Set the working directory in the container
WORKDIR /app

# Copy the client package.json and package-lock.json to the container
COPY package*.json ./

# Install the client dependencies
RUN npm install

# Copy the rest of the client application code to the container
COPY . .

# Expose the port that the client runs on
EXPOSE 3001

# Command to run the client
CMD ["npm", "start"]
