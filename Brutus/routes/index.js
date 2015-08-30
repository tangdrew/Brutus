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
        res.render('login', { title: 'Login to Brutus', user: null });   
    }
    else
    {
        var courseId = req.query.course;
        courses.getCourseByCourseId(courseId, function(obj,e){
            if(obj){
                console.log(obj);
                res.render('course', {user: req.session.user, title: obj.title, instructor: obj.instructor, term: obj.term, meeting_days: obj.meeting_days, start_time: obj.start_time, end_time: obj.end_time, room: obj.room, seats: obj.seats});
            }
            if(e){
                res.status(400).send(e);
            } 
        });  
    }
});

/* GET course profile page. */
router.get('/addCourse', function(req, res, next) {
  res.render('addCourse', { title: 'Add courses to the database', user: req.session.user });
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
				res.render('addCourse', { title: 'Add courses to the database', user: req.session.user });
			}
		});
});

/* GET login page. */
router.get('/login', function(req, res, next) 
{
  // Check if user is already logged in. If they are, redirect them to their account page
  if (req.session.user == undefined)
  {
      res.render('login', { user: req.session.user, title: 'Login to Brutus' }); 
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
           res.render('login', { error : e, user: null });
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
                res.render('register', { emailTaken : e , user: null  });
			}
      else if (e == 'missingData')
      {				
                res.render('register', { missingData : e , user: null });
			}
      else if (e == 'invalidEmail')
      {
                res.render('register', { invalidEmail : e , user: null });
      }
      else if (e == 'passwordNotMatch')
      {				
                res.render('register', { passwordNotMatch : e , user: null });
			}	
      else
      {
				res.render('login', { registered: true , user: null });
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

/*GET course data and return as JSON */
router.post('/search', function(req, res){
   courses.getAllCourses(req.body, function(o){
       res.send(o);
   });
});
/*
/* GET course review page. 
router.get('/review', function(req, res, next) {
  res.render('review', { title: 'Review Classes', user: req.session.user});
});

/* POST course review data to the user collection in the db 
router.post('/review', function(req, res, next) {
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
				res.render('review', { title: 'Review Classes', user: req.session.user });
			}
		});
});
*/
module.exports = router;

