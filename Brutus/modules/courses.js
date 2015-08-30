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
            var newReviewJSON = "{ '" + data.course_id + "' : " +
                                    "{ 'grade': '" + data.grade + "' , 'rating': '" + data.rating + "'," +
                                    "'difficulty':'" + data.difficulty + "' , 'comments': '" + data.comments + "' } }";
            var newCoursesTakenJSON = '{' + o.courses_taken.slice(1,o.courses_taken.length-1) + ',' + newReviewJSON + '}'
            accounts.update ({email: userEmail}, {$set: {"courses_taken" : newCoursesTakenJSON} });
            callback(e, o);
        }
        else{
            callback(e, o);
        }
    });
}