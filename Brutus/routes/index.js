var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var courses = require('../modules/courses');
var terms = require('../modules/terms');

var cookieParser = require('cookie-parser');
var session = require('express-session')

router.use(cookieParser());
router.use(session({secret: '1234567890QWERTY',resave: false,saveUninitialized: true}));


/* GET home page. */ 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Brutus', user: req.session.user});
});

/* GET search page. */
router.get('/search', function(req, res, next) 
{
    res.render('search', { user: req.session.user, title: 'Search' });
});

/*Return course data as JSON*/
router.post('/search', function(req, res){
    
    if (req.body.search != undefined)
    {
        courses.searchCourses(10, req.body.search, req.body.subject, req.body.term, req.body.order, req.body.sortBy, function(o){
            res.send(o);
        });    
    }
    else if (req.body.findTerms)
    {
        terms.getAllTerms(function(o) {
            console.log("in finding terms");
            res.send(o); 
        });
    }
    else if (req.body.findSubjects)
    {
        terms.getAllSubjects(req.body.term, function(o) {
            res.send(o); 
        });
    }
});

/* GET course profile page. */
router.get('/course', function(req, res, next) 
{
    if(req.session.user == undefined)
    {
        res.redirect('/login');
    }
    else
    {
        var courseId = req.query.course;
        courses.getCourseByCourseId(courseId, function(obj, e){
            if(obj){
                //Send Course data and whether user is already enrolled
                accounts.checkEnrollment(req.session.user.email, courseId, function(enrolled){
                    res.render('course', {title: 'Review Class', enrolled: enrolled, user: req.session.user, courseObj: obj[0]});
                });
            }
            else if(e){
                res.status(400).send(e);
            } 
        });  
    }
});

//POST to course profile page when hit add class button, saves class to db
router.post('/course', function(req, res, next) { 
   if(req.body.id){
       courses.getCourseByCourseId(req.body.id, function(obj, e){
           res.send(obj);
       });
   }
   else if(req.body.course_id){
    courses.addClass(req.session.user.email, req.body.course_id, function(o){
        res.send(o);
    });
   }
});

/* GET course profile page. */
// make so only admin users can use this post request
router.get('/addCourse', function(req, res, next) {
  res.render('addCourse', { title: 'Add courses to the database', user: req.session.user });
});

/* POST course data to the database courses collection */
// make so only admin users can use this post request
router.post('/addCourse', function(req, res, next) {
     courses.addCourse({
			title 	: req.body['title'],
            term 	: req.body['term'],
            instructor 	: req.body['instructor'],
            subject	: req.body['subject'],
            catalog_num : req.body['catalog_num'],
            section : req.body['section'],
            room : req.body['room'],
            meeting_days : req.body['meeting_days'],
            start_time : req.body['start_time'],
            end_time : req.body['end_time'],
            seats : req.body['seats'],
            topic : req.body['topic'],
            component : req.body['component'],
            class_num : req.body['class_num'],
            course_id : req.body['course_id']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.render('addCourse', { title: 'Add courses to the database', user: req.session.user });
			}
		});
});

/* GET login page. */
router.get('/login', function(req, res, next) 
{
    if (req.query.registered)
    {
        res.render('login', {registered: true, user: null, title: 'Login to Brutus'});
    }
    // Check if user is already logged in. If they are, redirect them to their account page
    if (req.session.user == undefined)
    {
        res.render('login', { user: req.session.user, title: 'Login to Brutus' }); 
    }
    else
    {   
        res.redirect('/dashboard');
    }  
});

router.post('/login', function(req, res, next) 
{
   accounts.checkLogin({
       email : req.body['email'],
       password : req.body['password']
   }, 
   function(e, o){       
       if(e == 'fail')
       {
           res.render('login', {title: "Login to Brutus", error : e, user: null });
       }       
       else
       {
           req.session.user = o;
           if (req.body['remember-me'] == 'true')
           {
					   res.cookie('user', o.email, { maxAge: 86400000 });
					   res.cookie('pass', o.password, { maxAge: 86400000 });
				   }
           res.redirect('/dashboard');
       }
   }); 
});

/* GET registration page. */
router.get('/register', function(req, res, next) 
{
    res.render('register', { title: 'Register for Brutus', user: null });
});

router.post('/register', function(req, res)
{
    accounts.createAccount({
			firstName 	: req.body['firstName'],
            lastName 	: req.body['lastName'],
            email 	: req.body['email'],
            password	: req.body['password'],
            passwordConfirm : req.body['passwordConfirm']
	}, 
    function(e)
    {
        if (e == 'email-taken')
        {				
            res.render('register', { title: 'Register for Brutus', emailTaken : e , user: null  });
        }
        else if (e == 'missingData')
        {				
            res.render('register', { title: 'Register for Brutus', missingData : e , user: null });
        }
        else if (e == 'invalidEmail')
        {
            res.render('register', { title: 'Register for Brutus', invalidEmail : e , user: null });
        }
        else if (e == 'passwordNotMatch')
        {				
            res.render('register', { title: 'Register for Brutus', passwordNotMatch : e , user: null });
        }	
        else
        {
          
            res.redirect('/login?registered=true');
            //res.render('login', { registered: true , user: null });
        }
	});
});

// GET logout page
router.get('/logout', function(req, res, next)
{
    res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy();
    res.redirect('/');
});

module.exports = router;

