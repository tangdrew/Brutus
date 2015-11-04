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
var reviews = db.collection('reviews');

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

// return array of all reviews the user has submitted 
exports.getUserGPA = function(user, callback) {
    reviews.find({user_id: user.id}).toArray(function(e, o){
        if(o){
            var gpa = calcuateGPA(o);
            callback(gpa);
        }
    });     
}

function calcuateGPA(reviews){
    var sum = 0;
    for(var i = 0; i < reviews.length; i++){
        sum = sum + parseInt(reviews[i].grade);
    }    
    console.log(sum);
    console.log(reviews.length);
    var gpa = sum/reviews.length;
    return gpa;
}