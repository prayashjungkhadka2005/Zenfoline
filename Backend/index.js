const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authenticationRoutes = require('./routes/AuthenticationRoutes');
const authenticatedAdminRoutes = require('./routes/AuthenticatedAdminRoutes');
const authenticatedUserRoutes = require('./routes/AuthenticatedUserRoutes');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3000; 
const MONGOURL = process.env.MONGOURL;

app.use(cors());
app.use(express.json());

app.use('/auth', authenticationRoutes);
app.use('/authenticated-user', authenticatedUserRoutes);
app.use('/authenticated-admin', authenticatedAdminRoutes);

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
