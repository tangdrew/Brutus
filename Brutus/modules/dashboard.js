var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var util        = require('util');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'brutus';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
        if (e) {
            console.log(e);
        }
    });
    
var accounts = db.collection('accounts');
var courses = db.collection('courses');


// return array of all the user's current courses  
exports.getCurrentCourses = function(user, callback) {
    accounts.findOne({email: user.email}, function(e, o) {
        if (o) {
            var currentCourses = o.current_courses;
            for (var i = 0; i < currentCourses.length; i++) {
                currentCourses[i] = parseInt(currentCourses[i]);
            }
            
            // get current courses and components 
            var currentComponents = o.current_components;
            courses.find({_id: {$in: currentCourses}}).toArray(function(e, o) {
                if (o) {
                    var obj = {components: currentComponents, courses: o};
                    callback(obj);
                }
            });
        }
    })
       
}