
var xmlify = require('xmlify');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var museos = mongoose.model('Museos');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: './uploads' });
var cors = require('cors');

//Return  JSON
router.get('/json', function(req, res, next) {
  museos.find({},{image:0},function(err, museos){
    if(err) return next(err);
    res.json({museos});
  });
});
//Devuelve el XML a pelo
router.get('/xml',isLoggedIn, function(req, res, next){
  museos.find(function(err, museos){
    if(err) return next(err);
    var xmlString = xmlify(museos,{root:'museos'});
    res.send(xmlify(xmlString,true));
  });
});

router.get('/guide',isLoggedIn, function(req, res, next) {
  museos.find(function (err, museos){
    if(err) return next(err);

    res.render('guidemuseos', {museos:museos});

  });

});
router.get('/anadir',isLoggedIn, function(req, res, next) {
  museos.find(function (err, museos){
    if(err) return next(err);

    res.render('anadirmuseo', {museos:museos});

  });

});



router.get('/', function(req, res, next) {

  var q = req.query.q;
  if (q==null){
    museos.find(function (err, museos){
      if(err) return next(err);

      res.render('guidemuseos', {museos:museos});
    });
  } else {
    console.log('query: ',q);

    museos.find({ "Nombre" : { $regex : new RegExp(q, "i") } },function (err, museos){
      if(err) return next(err);
      res.render('guidemuseos', {museos:museos});
    });
  }
});

//Post
router.post('/',isLoggedIn,upload.single('imageupload'),function(req,res,next){

    console.log('El REQ.FILE:', req.file);

    var data = fs.readFileSync(req.file.path);

    var museo = new museos({

      Nombre:    req.body.Nombre,
      Latitud:     req.body.Latitud,
      Longitud:     req.body.Longitud,
      Descripcion:     req.body.Descripcion,


  });

  museo.image.data =  fs.readFileSync(req.file.path);
  museo.image.contentType = req.file.mimetype;
  museo.save(function (err) {
    if (err) return handleError(err);
  });
  res.redirect('/museos/anadir');
});

router.get('/image/:ID', function(req, res,next) {
    var ID =  req.params.ID;
    console.log("Get image function");
    museos.findOne({'_id':ID},function (err, museos ){
        if (err) return next(err);
        res.contentType(museos.image.contentType);
        res.send(museos.image.data);
    });
});

router.delete('/:ID',isLoggedIn, function(req, res){

  museos.remove({ _id: req.params.ID }, function (err) {
    if (err) return handleError(err);
    res.redirect('/');
  });
});

router.get('/:ID', function(req, res, next){

  museos.findOne({ _id: req.params.ID }, function (err, museos) {
    if(err) return next(err);
    console.log("Hola:  ",museos);
      res.render('museum', {museos:museos});
    });
});


router.get('/:ID/json', function(req, res, next) {
  museos.findOne({ _id: req.params.ID },{image:0},function(err, museos){
    if(err) return next(err);
    res.json(museos);
  });
});


module.exports = function (app) {
  app.use('/museos', router);

};

function isLoggedIn(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
