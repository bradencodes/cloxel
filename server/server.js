require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { DB_URI, PORT } = process.env;

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
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running...'));

// Define Routes

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
