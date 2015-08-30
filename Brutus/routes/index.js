var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var courses = require('../modules/courses');

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

/* GET course profile page. */
router.get('/course', function(req, res, next) 
{
  if(req.session.user == undefined)
  {
      res.render('login', { title: 'Login to Brutus' });   
  }
  else
  {
      res.render('course', { user: req.session.user, title: 'Course' });  
  }  
});

/* GET course profile page. */
router.get('/addCourse', function(req, res, next) {
  res.render('addCourse', { title: 'Add courses to the database' });
});

/* POST course data to the database courses collection */
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
				res.render('addCourse');
			}
		});
});

/* GET login page. */
router.get('/login', function(req, res, next) 
{
  // Check if user is already logged in. If they are, redirect them to their account page
  if (req.session.user == undefined)
  {
      res.render('login', { title: 'Login to Brutus' }); 
  }
  else
  {
      res.redirect('accountSummary');
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
           res.render('login', { error : e });
       }       
       else
       {
           req.session.user = o;
           if (req.body['remember-me'] == 'true')
           {
					   res.cookie('user', o.email, { maxAge: 900000 });
					   res.cookie('pass', o.password, { maxAge: 900000 });
				   }
           res.redirect('search');
       }
   }); 
});

/* GET registration page. */
router.get('/register', function(req, res, next) 
{
  res.render('register', { title: 'Register for Brutus' });
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
                res.render('register', { emailTaken : e });
			}
      else if (e == 'missingData')
      {				
                res.render('register', { missingData : e });
			}
      else if (e == 'invalidEmail')
      {
                res.render('register', { invalidEmail : e });
      }
      else if (e == 'passwordNotMatch')
      {				
                res.render('register', { passwordNotMatch : e });
			}	
      else
      {
				res.render('login', { registered: true });
			}
	});
});

// GET logout page
router.get('/logout', function(req, res, next)
{
    res.render('index');
});

router.post('/logout', function(req, res)
{
    res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy();
});


/*
// GET index page, if cookie saved proceed to home, else go to login
router.get('/', function(req, res){
// check if the user's credentials are saved in a cookie //
   if (req.cookies.user == undefined || req.cookies.pass == undefined){
      res.render('login', 
         { locals: 
            { title: 'Hello - Please Login To Your Account' }
         }
      );
   }
});
*/
module.exports = router;