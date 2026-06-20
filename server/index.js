const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const scoresRouter = require('./routes/scores');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/scores', scoresRouter);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
