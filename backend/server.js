require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/feedback', require('./routes/feedback'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/velan_tailor')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
