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

var terms = db.collection('terms');

// get all terms in the db
exports.getAllTerms = function(callback){
    terms.find({}, {name: 1}).toArray(function (err, items) {
        console.log("finding terms");
        callback(items);
    });
}

// get all the subjects associated with a term
exports.getAllSubjects = function(term, callback){
    terms.findOne({name: term}, function (err, items) {        
        callback(items.subjects);
    });
}
