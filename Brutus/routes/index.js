var express = require('express');
var router = express.Router();
var accounts = require('../modules/accounts');
var cookieParser = require('cookie-parser');
var session = require('express-session')

router.use(cookieParser());
router.use(session({secret: '1234567890QWERTY',resave: false,saveUninitialized: true}));

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

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

/*GET index page, if cookie saved proceed to home, else go to login*/ 
router.get('/', function(req, res)
{
      res.redirect('index');
});

module.exports = router;