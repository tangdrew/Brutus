var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'brutus';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) 
    {
		console.log(e);
	}	
    else
    {
		console.log('connected to database :: ' + dbName);
	}
});

// Creates a new collection 'accounts'

var accounts = db.collection('accounts');


// Creating new account for new users

exports.createAccount = function(data, callback)
{
    var index = data.email.indexOf("@");
    if (index == -1)
    {
        callback('invalidEmail');
        return;
    }
    var validEmail = data.email.substring(index + 1 , data.email.length);
    
    if(data.firstName == "" || data.lastName == "" || data.email == "" || data.password ==  "" || data.passwordConfirm == "")
    {
       callback('missingData');
    }
    else if(validEmail != "u.northwestern.edu" && validEmail != "northwestern.edu")
    {        
        callback('invalidEmail');             
    }           
    else if(data.password != data.passwordConfirm)
    {
       callback('passwordNotMatch');
    }
    else
    {     
        accounts.findOne({email:data.email}, function(e, o) 
        {
            if (o)
            {
                callback('email-taken');
            }       	
            else
            {
                saltAndHash(data.password, function(e, hash){
                    data.pass = hash;
                    // append date stamp when record was created 
                    data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                    
                    data = {
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "email": data.email,
                        "pass": data.pass,
                        "date": data.date,
                        "gpa": 0,
                        "reviewed": false,
                        "year": null,
                        "major": {},
                        "minor": {},
                        "school": null,
                        "credits": 0,
                        "courses_taken": [],
                        "current_courses": []
                    };
                    
                    accounts.insert(data, {safe: true}, callback);
                });
            }
        });
    }
}

// Returns object of courses user is currently enrolled in
exports.getCurrentCourses = function(userEmail, callback){
    accounts.findOne({email: userEmail}, function(e,o){
        if(o){
            callback(o, null);
        }
        else if(e){
            callback(null, 'fail');
        }
    });
}

// Check login for existing users

exports.checkLogin = function(data, callback)
{  
    accounts.findOne({email:data.email}, function(e, o) 
    {       
        if (o)
        {
            validatePassword(data.password, o.pass, function(e, match) {
               if (match === true) {
                   callback(null, o);
               }
               else {
                   callback('fail');
               } 
            });
        }	
        else
        {
            callback('fail');
        }
    });
}


/* private encryption & validation methods */

var saltAndHash = function(pass, callback)
{
        // generate a salt for pbkdf2
    crypto.randomBytes(16, function(err, salt) {
        if (err) {
            return callback(err);
        }
    
        salt = new Buffer(salt).toString('hex');
        crypto.pbkdf2(pass, salt, 4096, 32, function(err, hash) {
            if (err) {
                return callback(err);
            }
            var combined = salt;
            combined = salt + new Buffer(hash).toString('hex');
            callback(null, combined);
        });
    });
}

var validatePassword = function(plainPass, combined, callback)
{
	// extract the salt and hash from the combined buffer
    var salt = combined.substr(0, 32);

    // verify the salt and hash against the password
    crypto.pbkdf2(plainPass, salt, 4096, 32, function(err, verify) {
        if (err) {
        return callback(err, false);
        }
        console.log("in pbkdf2");
        callback(null, salt + new Buffer(verify).toString('hex') === combined);
    });
}

exports.checkEnrollment = function(userEmail, courseId, callback){
    accounts.findOne({email:userEmail}, function(e, o) 
    {       
        if (o)
        {
            if(o.current_courses.indexOf(courseId) >= 0){
                callback(true);
                return;
            }
            callback(false);
        }	
        else
        {
            callback(false);
        }
    });
}

exports.updateUserPassword = function(user, oldPass, newPass, confirmPass, callback) {
    var data = {};
    data.email = user.email;
    data.password = oldPass;
    exports.checkLogin(data, function(e) {
        if (e != 'fail')
        {
            console.log("new: " + newPass);
            console.log("confirm: " + confirmPass);
            if (newPass == undefined || newPass == '') {
                callback('missing');
                return;
            }
            
            if (newPass != confirmPass) {
                callback('nomatch')
                return;
            }
            saltAndHash(newPass, function(e, hash) {
                accounts.update(
                    {email: user.email},
                    {
                        $set: {
                            pass: hash
                        },
                        $currentDate: {
                            lastModified: true
                        }
                    },
                    function(e, c, s) {
                        callback('done');    
                    }  
                );
            });
            
        }
        else {
            callback('invalid');
        }  
    });
}