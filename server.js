// server.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const healthCheckRoutes = require('./routes/healthCheckRoutes'); 
const userAuthRoutes = require('./routes/userAuthRoutes');
const { sequelize } = require('./models');
const { logger } = require('./utils/logger');


const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(healthCheckRoutes);
app.use('/api/v1', userAuthRoutes);


sequelize.authenticate()
	.then(() => {
			logger.info('Connection has been established successfully.');
			app.listen(port, () => logger.info(`tekuniv-userdata-service is running on port ${port} `));
	})
	.catch(err => {
    logger.error('Unable to connect to the database:', err);
    process.exit(1);
  });

