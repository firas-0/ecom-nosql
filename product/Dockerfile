# Use an official Node.js runtime as a base image
FROM node:17

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . /app

# Install dependencies
RUN npm install

# Expose the app port
EXPOSE 8080

CMD ["node", "index.js"]


