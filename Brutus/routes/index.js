var express = require('express');
var router = express.Router();
var AM = require('./modules/account-manager');

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

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login to Brutus' });
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register for Brutus' });
});

router.post('/register', function(req, res){
    AM.addNewAccount({
        fistName 	: req.body['firstName'],
        lastName 	: req.body['lastName'],
        email 	: req.body['email'],
        password	: req.body['password'],
        passwordConfirm : req.body['passwordConfirm']
    }, function(e){
        if (e){
            res.status(400).send(e);
        }	else{
            res.status(200).send('ok');
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
   }/* else{
   // attempt automatic login //
      AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
         if (o != null){
            req.session.user = o;
            res.redirect('/home');
         }  else{
            res.render('login', 
               { locals: 
                  { title: 'Hello - Please Login To Your Account' }
               }
            );
         }
      });
   }*/
});

module.exports = router;
