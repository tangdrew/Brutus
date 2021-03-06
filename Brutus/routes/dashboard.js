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
        if (req.session.user == undefined) {
            res.redirect("/login");
        }
        else {
            dashboard.getUserGPA(req.session.user, function(gpa){
                res.render('dashboard/index', {title: 'Dashboard', user: req.session.user, gpa: gpa});
            });
        }
    })
    .post(function(req, res, next) {
        console.log(req.session.user);
        if (req.session.user) {
            if (req.body.getCurrentEvents) {
                dashboard.getCurrentCourses(req.session.user, function(o){
                    res.send(o);
                });    
            }   
        }
    });

module.exports = router;