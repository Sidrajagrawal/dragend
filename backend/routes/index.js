const express = require('express');
const route = express.Router();
const authRoute = require('./auth');
const projectRoute = require('./project');

route.use('/auth',authRoute);
route.use('/project',projectRoute);

module.exports = route;