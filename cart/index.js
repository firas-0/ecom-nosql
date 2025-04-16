const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create an Express app
const app = express();
const port = process.env.PORT || 8083;

// Set up Redis client with promises
const redisClient = redis.createClient({
  url: `redis://redis:6379`, // Redis service container name and port
});

async function connectRedis() {
  try {
    // Ensure the client is connected
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
}

// Ensure Redis connection before the app starts
connectRedis();

// Middleware
app.use(bodyParser.json());

// Routes for cart operations
const cartRoute = require('./routes/cart');
app.use('/cart', cartRoute);

// Start server
app.listen(port, () => {
  console.log(`Cart service running on http://localhost:${port}`);
});
