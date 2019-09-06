require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/cloxel';

const app = express();

// Connect Database
(async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();

// Init Middleware
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running...'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/weeks', require('./routes/api/weeks'));
app.use('/api/activities', require('./routes/api/activities'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
