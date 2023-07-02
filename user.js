const express = require('express');
const db = require('../db');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Retrieve the list of user's reports
router.get('/reports', authenticateUser, async (req, res) => {
  const { userId } = req.user;
  try {
    const reports = await db.any('SELECT * FROM reports WHERE userId = $1', userId);
    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve the details of a report by ID
router.get('/reports/:id', authenticateUser, async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  try {
    const report = await db.one('SELECT * FROM reports WHERE id = $1 AND userId = $2', [id, userId]);
    res.json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new report
router.post('/reports', authenticateUser, async (req, res) => {
  const { userId } = req.user;
  const { type, description, coordinates } = req.body;
  try {
    const newReport = await db.one(
      'INSERT INTO reports (userId, type, description, coordinates, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, type, description, coordinates, 'pending']
    );
    res.status(201).json({ report: newReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a report
router.put('/reports/:id', authenticateUser, async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { type, description, coordinates } = req.body;
  try {
    const updatedReport = await db.one(
      'UPDATE reports SET type = $1, description = $2, coordinates = $3, status = $4 WHERE id = $5 AND userId = $6 RETURNING *',
      [type, description, coordinates, 'pending', id, userId]
    );
    res.json({ report: updatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a report
router.delete('/reports/:id', authenticateUser, async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  try {
    await db.none('DELETE FROM reports WHERE id = $1 AND userId = $2', [id, userId]);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

const geolib = require('geolib');

// ...

// Retrieve the list of reports within a 30km radius of a location
router.get('/reports/nearby', authenticateUser, async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const reports = await db.any('SELECT * FROM reports WHERE status = $1', 'approved');

    const nearbyReports = reports.filter((report) => {
      const distance = geolib.getDistance(
        { latitude: report.coordinates.latitude, longitude: report.coordinates.longitude },
        { latitude: Number(latitude), longitude: Number(longitude) }
      );

      return distance <= 30000; // 30km
    });

    res.json({ reports: nearbyReports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ...

