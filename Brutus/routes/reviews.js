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
			course_id : req.body['course_id'],
            grade : req.body['grade'],
            rating : req.body['rating'],
            difficulty : req.body['difficulty'],
            comments : req.body['comments']
		}, req.session.user.email, function(e){
			if (e){
                console.log('Error');
				res.status(400).send(e);
			}	else{
                res.render('reviews/index', { title: 'Review Classes', user: req.session.user });
			}
		});
});

module.exports = router;