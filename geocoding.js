const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/cities', async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=bcafaa8ccc24bab48357967185a0d044`);

    const city = response.data[0]?.name || 'Unknown';

    res.json({ city });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
