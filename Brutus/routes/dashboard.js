var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var courses = require('../modules/courses');
var dashboard = require('../modules/dashboard');

var cookieParser = require('cookie-parser');
var session = require('express-session');

router.use(cookieParser());
router.use(session({secret: '1234567890QWERTY',resave: false,saveUninitialized: true}));

/* GET course review page. */ 
router.route('/')
    .get(function(req, res, next) {
        res.send("test");
    })
    .post(function(req, res, next) {
        res.send("test");
});

module.exports = router;