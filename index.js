const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user_routes = require('./routes/user');

const app = express();

const PORT = 3000;
const MONGOURL = "mongodb://localhost:27017/User";


app.use(cors());
app.use(express.json());

// Use routes
app.use('', user_routes);


// Connect to MongoDB and start the server
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
 