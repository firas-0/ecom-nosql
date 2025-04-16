# Use official Node.js runtime as base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy all source files to the working directory
COPY . .

# Expose port for the application to listen on
EXPOSE 8083

# Run the app
CMD ["node", "index.js"]
