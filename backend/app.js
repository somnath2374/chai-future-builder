require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const walletRoutes = require('./routes/walletRoutes');
const eduScoreRoutes = require('./routes/eduScoreRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3001;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    // Optionally, you might want to exit the process if DB connection is critical
    // process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api/wallet', walletRoutes);
app.use('/api/edu-score', eduScoreRoutes);
app.use('/webhook', webhookRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 