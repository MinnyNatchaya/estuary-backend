// const { sequelize } = require('./models');
// sequelize.sync({ force: true });

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const errorController = require('./controller/errorController');

const authRoute = require('./routes/authRoute');

app.use(cors());
app.use(express.json());

app.use('/', authRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: 'resource not found on this server' });
});

app.use(errorController);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
