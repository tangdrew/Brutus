var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var courses = require('../modules/courses');
var terms = require('../modules/terms');

var cookieParser = require('cookie-parser');
var session = require('express-session')

router.use(cookieParser());
router.use(session({secret: '1234567890QWERTY',resave: false,saveUninitialized: true}));



/* GET course review page. */ 
router.route('/')
    .get(function(req, res, next) {
        
        if (req.session.user == undefined) {
            res.redirect('/');
        }
        else {
            res.render('reviews/index', { title: 'Review Classes', user: req.session.user});
        }
    })
    .post(function(req, res, next) {
        if(req.body.query == 'current'){
            accounts.getCurrentCourses(req.session.user.email, function(obj, e){
                if(obj){
                    res.send(obj);
                }
                else if(e == 'fail'){
                    res.status(400).send(e);    
                }
            });
        }
        else if(req.body.query == 'oneCourse'){
            courses.getCourseByCourseId(req.body._id, function(obj, e){
                if(obj){
                    res.send(obj);
                }
                else if(e == 'fail'){
                    res.status(400).send(e);    
                }
            });
        }
        else if (req.body.query == 'terms')
        {
            terms.getAllTerms(function(o) {
                res.send(o); 
            });
        }
        else if (req.body.query == 'subjects')
        {
            terms.getAllSubjects(req.body.term, function(o) {
                res.send(o); 
            });
        }
        else if (req.body.query == 'search')
        {
            courses.searchCourses('none', req.body.search, req.body.subject, req.body.term, req.body.order, req.body.sortBy, function(o){
                res.send(o);
            });   
        }
        else{
            var course_id_unique;
            if(req.body.myCourseID != ''){
                course_id_unique = req.body.myCourseID;
            }
            else{
                course_id_unique = req.body.myCourseID;
            }
            courses.getCourseByCourseId(course_id_unique, function(obj, e){
                if(obj){
                    courses.addReview(obj, req, req.session.user.email, function(e){
                        if (e){
                            console.log('Error');
                            res.status(400).send(e);
                        }	else{
                            res.render('reviews/index', { title: 'Review Classes', user: req.session.user });
                        }
                    });
                }
            });
            } 
        });


module.exports = router;