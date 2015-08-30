var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var courses = require('../modules/courses');

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/* GET search page. */
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search' });
});

/* GET course profile page. */
router.get('/course', function(req, res, next) {
  res.render('course', { title: 'Course' });
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
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login to Brutus' });
});

router.post('/login', function(req, res, next) {
   accounts.checkLogin({
       email : req.body['email'],
       password : req.body['password']
   }, function(e){
       if(e != 'success'){
           res.render('login', {error : e});
       }
       else{
           res.redirect('search');
       }
   }); 
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register for Brutus' });
});

router.post('/register', function(req, res){
    accounts.createAccount({
			fistName 	: req.body['firstName'],
            lastName 	: req.body['lastName'],
            email 	: req.body['email'],
            password	: req.body['password'],
            passwordConfirm : req.body['passwordConfirm']
		}, function(e){
			if (e){
				//res.status(400).send(e);
                res.render('register', { error: e });
			}	else{
				res.render('login', { registered: true });
			}
		});
});

/*GET index page, if cookie saved proceed to home, else go to login */
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

module.exports = router;
