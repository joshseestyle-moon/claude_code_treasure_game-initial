const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
  const { userId, score } = req.body;
  if (userId == null || score == null) {
    return res.status(400).json({ error: 'userId and score are required' });
  }

  const stmt = db.prepare('INSERT INTO scores (user_id, score) VALUES (?, ?)');
  const result = stmt.run(userId, score);
  const saved = db.prepare('SELECT * FROM scores WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ id: saved.id, userId: saved.user_id, score: saved.score, playedAt: saved.played_at });
});

router.get('/leaderboard', (req, res) => {
  const rows = db.prepare(`
    SELECT
      ROW_NUMBER() OVER (ORDER BY s.score DESC, s.played_at ASC) AS rank,
      u.username,
      s.score,
      s.played_at AS playedAt
    FROM scores s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.score DESC, s.played_at ASC
    LIMIT 10
  `).all();
  res.json(rows);
});

module.exports = router;
