const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const user_routes = require('./routes/user');

const app = express();

const PORT = 3000; 
const MONGOURL = process.env.MONGOURL; 

app.use(cors());
app.use(express.json());

// Use routes
app.use('/user', user_routes);

 mongoose.connect(MONGOURL)
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection failed:", error);
  });
