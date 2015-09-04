var express = require('express');
var router = express.Router();

var accounts = require('../modules/accounts')
var cookieParser = require('cookie-parser');
var session = require('express-session');

router.use(cookieParser());
router.use(session({secret: '1234567890QWERTY',resave: false,saveUninitialized: true}));

/* GET course review page. */ 
router.route('/')
    .get(function(req, res, next) {
        if (req.session.user == undefined) {
            res.redirect("/login");
        }
        else {
            console.log("lol");
            res.render('account/settings', {title: 'Account', user: req.session.user, updated: false, wrongConfirm: false, wrongPass: false, missing: false})
        }
    })
    .post(function(req, res, next) {
        console.log(req.session.user);
        if (req.session.user) {
            if (req.body.general) {
                accounts.updateUser(req.session.user);
            }
            else if (req.body.password) {
                accounts.updateUserPassword(req.session.user, req.body.old, req.body.new, req.body.confirm, function(o) {
                    if (o == 'done') {
                        res.render('account/settings', {title: 'Account', user: req.session.user, updated: true, wrongConfirm: false, wrongPass: false, missing: false});
                    }
                    else if (o == 'nomatch') {
                        res.render('account/settings', {title: 'Account', user: req.session.user, wrongConfirm: true, updated: false, wrongPass: false, missing: false});
                    }
                    else if (o == 'invalid') {
                        res.render('account/settings', {title: 'Account', user: req.session.user, wrongPass: true, updated: false, wrongConfirm: false, missing: false});
                    }
                    else if (o == 'missing') {
                        res.render('account/settings', {title: 'Account', user: req.session.user, wrongPass: false, updated: false, wrongConfirm: false, missing: true});
                    }
                });
            }
        }
    });

module.exports = router;