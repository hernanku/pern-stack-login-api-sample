const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const userAuthRoutes = require('./routes/userAuthRoutes');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userAuthRoutes);
app.listen(port, () => console.log(`tekuniv-userdata-service is running on port ${port} `));

