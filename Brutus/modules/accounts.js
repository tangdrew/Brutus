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
    var validEmail = data.email.substring(index + 1 , data.email.length);
    
    if(data.firstName == "" || data.lastName == "" || data.email == "" || data.password ==  "" || data.passwordConfirm == "")
    {
       callback('missingData');
    }
    else if(validEmail != "u.northwestern.edu" || validEmail != "northwestern.edu")
    {
        callback('invalidEmail');
    }     
    else if(data.password != data.passwordConfirm)
    {
       callback('passwordNotMatch');
    }    
    accounts.findOne({email:data.email}, function(e, o) 
    {
        if (o)
        {
            callback('email-taken');
        }       	
        else
        {
            saltAndHash(data.password, function(hash){
                data.pass = hash;
                // append date stamp when record was created 
                data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                accounts.insert(data, {safe: true}, callback);
            });
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
            if(o.password == data.password)
            {
                callback(null, o);
            }
            else
            {
                callback('fail');
            }
        }	
        else
        {
            callback('fail');
        }
    });
}


/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str)
{
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}