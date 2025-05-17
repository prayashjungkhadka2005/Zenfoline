const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authenticationRoutes = require('./routes/AuthenticationRoutes');
const authenticatedAdminRoutes = require('./routes/AuthenticatedAdminRoutes');
const authenticatedUserRoutes = require('./routes/AuthenticatedUserRoutes');
const portfolioRoutes = require('./routes/publicViewPortfolioRoutes');
const portfolioSaveRoutes = require('./routes/portfolioDataRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3000; 
const MONGOURL = process.env.MONGOURL;

app.use(cors());

// Increase request size limit
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/auth', authenticationRoutes);
app.use('/authenticated-user', authenticatedUserRoutes);
app.use('/authenticated-admin', authenticatedAdminRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/portfolio-save', portfolioSaveRoutes);
app.use('/api/analytics', analyticsRoutes);

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
