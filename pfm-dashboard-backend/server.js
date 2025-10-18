require('dotenv').config(); // MUST be first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const plaidRoutes = require('./routes/plaid');
const summaryRoutes = require('./routes/summary');
const budgetsRoutes = require('./routes/budgets');
const txRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connect (with clearer diagnostics)
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.reason?.message || err.message);
    console.error('Details:', err.reason || err);
    process.exit(1);
  }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/budgets', budgetsRoutes);
app.use('/api/tx', txRoutes);

app.get('/', (_, res) => res.send('PFM API Running'));

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
