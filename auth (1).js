const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Fetch user from the database
  const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, 'your_secret_key');

  res.json({ token });
});

module.exports = router;
