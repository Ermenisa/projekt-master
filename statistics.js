const express = require('express');
const db = require('../db');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Retrieve users with the highest number of reports
router.get('/users/highest_reports', authenticateUser, async (req, res) => {
  try {
    const highestReportsUsers = await db.any(`
      SELECT u.username, COUNT(r.id) as report_count
      FROM users AS u
      LEFT JOIN reports AS r ON u.id = r.userId
      GROUP BY u.id
      ORDER BY report_count DESC
      LIMIT 10
    `);

    res.json({ users: highestReportsUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve users with the highest number of approved reports
router.get('/users/highest_approved_reports', authenticateUser, async (req, res) => {
  try {
    const highestApprovedReportsUsers = await db.any(`
      SELECT u.username, COUNT(r.id) as approved_report_count
      FROM users AS u
      LEFT JOIN reports AS r ON u.id = r.userId
      WHERE r.status = 'approved'
      GROUP BY u.id
      ORDER BY approved_report_count DESC
      LIMIT 10
    `);

    res.json({ users: highestApprovedReportsUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve users with the highest number of rejected reports
router.get('/users/highest_rejected_reports', authenticateUser, async (req, res) => {
  try {
    const highestRejectedReportsUsers = await db.any(`
      SELECT u.username, COUNT(r.id) as rejected_report_count
      FROM users AS u
      LEFT JOIN reports AS r ON u.id = r.userId
      WHERE r.status = 'rejected'
      GROUP BY u.id
      ORDER BY rejected_report_count DESC
      LIMIT 10
    `);

    res.json({ users: highestRejectedReportsUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
