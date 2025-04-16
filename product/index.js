// index.js

const express = require('express');
const cassandra = require('cassandra-driver');

const app = express();
const port = 8080;

// Connect to Cassandra
const client = new cassandra.Client({
  contactPoints: ['cassandra'],  // Docker container name for Cassandra
  localDataCenter: 'datacenter1',
  keyspace: 'ecommerce',         
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to Cassandra', err);
  } else {
    console.log('Connected to Cassandra');
  }
});


app.post('/products', express.json(), (req, res) => {
  const { id, name, price } = req.body;

  const query = 'INSERT INTO products (id, name, price) VALUES (?, ?, ?)';
  client.execute(query, [id, name, price], { prepare: true }, (err) => {
    if (err) {
      res.status(500).send('Error adding product');
    } else {
      res.status(200).send('Product added');
    }
  });
});

app.get('/products/:id', (req, res) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  client.execute(query, [req.params.id], { prepare: true }, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching product');
    } else {
      if (result.rows.length) {
        res.json(result.rows[0]);
      } else {
        res.status(404).send('Product not found');
      }
    }
  });
});

app.get('/products', async (req, res) => {
  const query = 'SELECT * FROM products LIMIT 100';

  try {
    const result = await client.execute(query);
    res.json(result.rows); // Send the products as JSON
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(port, () => {
  console.log(`Product service running at http://localhost:${port}`);
});

