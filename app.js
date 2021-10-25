// const { sequelize } = require('./models');
// sequelize.sync({ force: true });

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const errorController = require('./controller/errorController');

const postRoute = require('./routes/postRoute');
const profileRoute = require('./routes/profileRoute');
const authRoute = require('./routes/authRoute');

const passport = require('passport');
require('./config/passport');
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

//////////////////omise/////////////////////////////////////

// let omise = require('omise')({
//   publicKey: process.env.OMISE_PUBLIC_KEY,
//   secretKay: process.env.OMISE_SECRET_KEY
// });
// app.post('/checkout-credit-card', (req, res, next) => {});

///////////////////////////////////////////////////////

app.use('/post', postRoute);
app.use('/profile', profileRoute);
app.use('/', authRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: 'resource not found on this server' });
});

app.use(errorController);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
