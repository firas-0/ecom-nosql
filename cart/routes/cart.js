const express = require('express');
const router = express.Router();
const redis = require('redis');

// Set up Redis client with promises
const redisClient = redis.createClient({
  url: `redis://redis:6379`,  // Redis service container name and port
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

// Add an item to the cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Ensure Redis connection before proceeding
    if (!redisClient.isOpen) {
      await connectRedis();
    }

    // Fetch the cart for the user
    let cart = await redisClient.hGetAll(`cart:${userId}`);

    if (!cart) {
      cart = {}; // Initialize an empty cart if none exists
    }

    // Update or add the product to the cart
    cart[productId] = (cart[productId] || 0) + quantity;

    // Save the updated cart back to Redis
    await redisClient.hSet(`cart:${userId}`, cart);
    res.status(200).send('Item added to cart');
  } catch (err) {
    console.error('Error fetching or updating cart:', err);
    res.status(500).send('Error accessing Redis');
  }
});

// Get cart items for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Ensure Redis connection before proceeding
    if (!redisClient.isOpen) {
      await connectRedis();
    }

    const cart = await redisClient.hGetAll(`cart:${userId}`);

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(404).send('Cart is empty or not found');
    }

    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart data:', err);
    res.status(500).send('Error accessing Redis');
  }
});

// Remove an item from the cart
router.delete('/remove', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Ensure Redis connection before proceeding
    if (!redisClient.isOpen) {
      await connectRedis();
    }

    const response = await redisClient.hDel(`cart:${userId}`, productId);

    if (response === 0) {
      return res.status(404).send('Product not found in cart');
    }

    res.status(200).send('Product removed from cart');
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).send('Error removing item from cart');
  }
});

module.exports = router;
