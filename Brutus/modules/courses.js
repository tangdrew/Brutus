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
var reviews = db.collection('reviews');

exports.addCourse = function(data, callback){
    courses.insert(data, {safe: true}, callback);
}

exports.getAllCourses = function(data, callback){
    courses.find().toArray(function (err, items) {
        callback(items);
    });
}

//Fuzzy search function for title+subject+catalog num
function fuzzySearch(courses, substr){
    var matches = [];
    substr = substr.toLowerCase();
    substr = substr.replace(/\s+/g, '');
    for(var i = 0; i < courses.length; i++){
        if(typeof courses[i].title != 'undefined' && typeof courses[i].subject != 'undefined' && typeof courses[i].catalog_num != 'undefined'){
            var fullString = courses[i].title.toLowerCase() + " " + courses[i].subject.toLowerCase() + " " + courses[i].catalog_num.toLowerCase()
            fullString = fullString.replace(/\s+/g, '');
            if(fullString.indexOf(substr) >= 0){
                matches.push(courses[i]);
            }
        }
    }
    console.log(matches.length);
    return matches;
}
        
//Function that returns the courses as specified by search parameters

exports.searchCourses = function(limit,searchVal, subjectVal, termVal, orderVal, sortByVal, callback){
    if(subjectVal == "ALL"){
        query = {term: termVal};
    }else{
        query = {subject: subjectVal, term: termVal};
    }
    if(sortByVal == "default"){
        sortQuery = { subject: 1, catalog_num: 1, title: 1, start_time: 1 };
    }else if(sortByVal == "rating"){
        sortQuery = { rating: parseInt(orderVal), subject: 1, catalog_num: 1, title: 1, start_time: 1 };
    }else if(sortByVal == "difficulty"){
        sortQuery = { difficulty: parseInt(orderVal), subject: 1, catalog_num: 1, title: 1, start_time: 1 };
    }else if(sortByVal == "avghours"){
        sortQuery = { rating: parseInt(orderVal), subject: 1, catalog_num: 1, title: 1, start_time: 1 };
    }
    courses.find(query).sort(sortQuery).toArray(function(err, result) {
        if (err) throw err;
        console.log(result.length);
        var matches = fuzzySearch(result, searchVal);
        if(limit != 'none'){
            matches = matches.slice(0,limit);
        }
        console.log('done');
        callback(matches);
    });
}

exports.getCourseByCourseId = function(value, callback){
    courses.find({_id:parseInt(value)}).toArray(function(e,o) {
        if (o){
            callback(o);
        }
        else{
            callback(e);
        }
    });
}

exports.addReview = function(course, req, userEmail, callback){
    //Add review to reviews collection in db
    reviews.insert({
        user_id: req.session.user._id,
        course_id_unique: course[0]._id,
        course_id: course[0].course_id,
        instructor: course[0].instructor.name,
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
        title: course[0].title,
        term: course[0].term,
        rating: req.body.rating,
        grade: req.body.grade,
        difficulty: req.body.difficulty,
        avghours: req.body.avghours,
        comments: req.body.comments
    });
    //Gets the review that was just written to the db to use
    reviews.find().sort({timestamps : -1}).limit(1).toArray(function(err,obj) { 
        //Add course to courses_taken for user
        accounts.findOne({email:userEmail}, function(e,o) {
            if (o){
                var courses_taken = o.courses_taken;
                var current_courses = o.current_courses;
                var index = current_courses.indexOf(course[0]._id.toString());
                if (index > -1) {
                    current_courses.splice(index, 1);
                }
                courses_taken.push({"review_id": obj[0]._id, "course_id_unique": course[0]._id});
                //Update users courses taken and current courses
                accounts.update ({email: userEmail}, {$set: {"courses_taken" : courses_taken} });
                accounts.update ({email: userEmail}, {$set: {"current_courses" : current_courses} });
                //Update the courses ratings for every course instance with same course_id+instructor combination
                reviews.find({"course_id": course[0].course_id, "instructor": course[0].instructor.name}).toArray(function(err, reviews) { 
                    var ratingSum = 0;
                    var gradeSum = 0;
                    var difficultySum = 0;
                    var avghoursSum = 0;
                    for(var i = 0; i < reviews.length; i++){
                        ratingSum += parseInt(reviews[i].rating);
                        gradeSum += parseInt(reviews[i].grade);
                        difficultySum += parseInt(reviews[i].difficulty);
                        avghoursSum += parseInt(reviews[i].avghours);
                    }
                    courses.find({"course_id": course[0].course_id, "instructor.name": course[0].instructor.name}).toArray(function(err, courseMatches){
                        //Updates all of the matches with the average scores
                        console.log(courseMatches);
                        for(var j = 0; j < courseMatches.length; j++){
                            courses.update ({_id: courseMatches[j]._id}, {$set: {
                                "rating" : ratingSum/reviews.length,
                                "grade" : gradeSum/reviews.length,
                                "difficulty" : difficultySum/reviews.length,
                                "avghours" : avghoursSum/reviews.length,
                                "numreviews" : courseMatches[j].numreviews + 1
                            } });
                        }   
                    });
                });
                callback(e, o);
            }
            else{
                callback(e, o);
            }
        });
    });
}

//Add class to user's account
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

//Returns all reviews about course_id
exports.getReviews = function(id, course_id, callback){
    reviews.find({"course_id": parseInt(course_id)}).sort({_id: -1}).toArray(function(err, reviews) { 
        callback(reviews, err);
    });
}