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
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});
var courses = db.collection('courses');
var accounts = db.collection('accounts');

exports.addCourse = function(data, callback){
    courses.insert(data, {safe: true}, callback);
}

exports.getAllCourses = function(data, callback){
    courses.find().toArray(function (err, items) {
        callback(items);
    });
}

exports.getCourseByCourseId = function(value, callback){
    courses.findOne({course_id:value}, function(e,o) {
        if (o){
            callback(o);
        }
        else{
            callback(e);
        }
    });
}

exports.addReview = function(data, userEmail, callback){
    accounts.findOne({email:userEmail}, function(e,o) {
        if (o){
            var courses_taken = o.courses_taken;
            courses_taken.push(data);
            accounts.update ({email: userEmail}, {$set: {"courses_taken" : courses_taken} });
            callback(e, o);
        }
        else{
            callback(e, o);
        }
    });
}

exports.addClass = function(userEmail, course_id, callback){
    accounts.findOne({email:userEmail}, function(e,o) {
        if (o){
            var current_courses = o.current_courses;
            current_courses.push(course_id);
            accounts.update ({email: userEmail}, {$set: {"current_courses" : current_courses} });
            callback('success');
        }
        else{
            callback(e);
        }
    });
};