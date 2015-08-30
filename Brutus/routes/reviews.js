var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var courses = require('../modules/courses');

var cookieParser = require('cookie-parser');
var session = require('express-session')

router.use(cookieParser());
router.use(session({secret: '1234567890QWERTY',resave: false,saveUninitialized: true}));



/* GET course review page. */ 
router.route('/')
    .get(function(req, res, next) {
        res.render('reviews/index', { title: 'Review Classes', user: req.session.user});
    })
    .post(function(req, res, next) {
        courses.addReview({
            user_email : req.session.user.email,
			course_id : req.body['couse_id'],
            grade : req.body['grade'],
            rating : req.body['rating'],
            difficulty : req.body['difficulty'],
            comments : req.body['comments']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.render('reviews/index', { title: 'Review Classes', user: req.session.user });
			}
		});
});

module.exports = router;