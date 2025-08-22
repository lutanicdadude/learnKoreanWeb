const express = require('express');
const cors = require('cors');

const koreanRoute = require('./routers/korean');

const app = express();
app.use(express.json()); // to process JSON in request body

app.use(express.static('public'));

app.use('/korean', koreanRoute);

module.exports = app;
