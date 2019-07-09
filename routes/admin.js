var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Dataraport = require('../model/dataraport')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('users/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

//dataraport
/* GET users listing. */
router.get('/dataraport', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Dataraport.find({}, function(err, dataraport) {
        //console.log(buku);
        res.render('users/dataraport/table', { session_store: session_store, dataraports: dataraport })
    }).select('_id no mapel kkm nilaiangka nilaihuruf kemampuanbelajar created_at')
});

/* GET users listing. */
router.get('/inputdataraport', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('users/dataraport/input_data', { session_store: session_store})
});

//input data buku
router.post('/inputdataraport', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Dataraport.find({ no: req.body.no }, function(err, dataraport) {
        if (dataraport.length == 0) {
            var raport = new Dataraport({
                no: req.body.no,
                mapel: req.body.mapel,
                kkm: req.body.kkm,
                nilaiangka: req.body.nilaiangka,
                nilaihuruf: req.body.nilaihuruf,
                kemampuanbelajar: req.body.kemampuanbelajar,
            })
            raport.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/dataraport')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/dataraport')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode data raport sudah ada....')
            res.render('users/dataraport/input_data', {
                session_store: session_store,
                no: req.body.no,
                mapel: req.body.mapel,
                kkm: req.body.kkm,
                nilaiangka: req.body.nilaiangka,
                nilaihuruf: req.body.nilaihuruf,
                kemampuanbelajar: req.body.kemampuanbelajar,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editdataraport', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Dataraport.findOne({ _id: req.params.id }, function(err, dataraport) {
        if (dataraport) {
            console.log("dataraportssss"+dataraport);
            res.render('users/dataraport/edit_data', { session_store: session_store, dataraports: dataraport })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/dataraport')
        }
    })
})

router.post('/:id/editdataraport', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Dataraport.findById(req.params.id, function(err, dataraport) {
        dataraport.no = req.body.no;
        dataraport.mapel = req.body.mapel;
        dataraport.kkm = req.body.kkm;
        dataraport.nilaiangka = req.body.nilaiangka;
        dataraport.nilaihuruf = req.body.nilaihuruf;
        dataraport.kemampuanbelajar = req.body.kemampuanbelajar;

        dataraport.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/dataraport');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Dataraport.findById(req.params.id, function(err, dataraport){
        dataraport.remove(function(err, dataraport){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data raport berhasil dihapus!');
            }
            res.redirect('/dataraport');
        })
    })
})

module.exports = router;
