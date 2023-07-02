const express = require('express');
const db = require('../db');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Retrieve the list of reports to be approved
router.get('/reports/pending', authenticateUser, async (req, res) => {
  try {
    const reports = await db.any('SELECT * FROM reports WHERE status = $1', 'pending');
    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve the list of approved reports
router.get('/reports/approved', authenticateUser, async (req, res) => {
  try {
    const reports = await db.any('SELECT * FROM reports WHERE status = $1', 'approved');
    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Retrieve the list of rejected reports
router.get('/reports/rejected', authenticateUser, async (req, res) => {
  try {
    const reports = await db.any('SELECT * FROM reports WHERE status = $1', 'rejected');
    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Approve a report
router.put('/reports/:id/approve', authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedReport = await db.one('UPDATE reports SET status = $1 WHERE id = $2 RETURNING *', ['approved', id]);
    res.json({ report: updatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject a report
router.put('/reports/:id/reject', authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedReport = await db.one('UPDATE reports SET status = $1 WHERE id = $2 RETURNING *', ['rejected', id]);
    res.json({ report: updatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a report
router.delete('/reports/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    await db.none('DELETE FROM reports WHERE id = $1', id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
