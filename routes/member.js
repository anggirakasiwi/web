var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Dataraport = require('../model/dataraport')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('users/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/dataraport', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Dataraport.find({}, function(err, dataraport) {
        console.log(dataraport);
        res.render('users/dataraport/table', { session_store: session_store, dataraports: dataraport })
    }).select('_no mapal kkm nilaiangka nilaihuruf kemampuanbelajar created_at')
});

module.exports = router;
