const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

// SETTINGS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send({ "msg": "This has CORS enabled 🎈" })
  })

app.use(cors({ origin: "*" }));

// ROUTES
app.use('/auth', require('./routes/auth'));
app.use('/characters', require('./routes/characters'));
app.use('/films', require('./routes/films'));
app.use('/genders', require('./routes/genders'));

module.exports = app;
