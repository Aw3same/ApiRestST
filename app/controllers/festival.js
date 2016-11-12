
var xmlify = require('xmlify');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var festivales = mongoose.model('Festival');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: './uploads' });
var cors = require('cors');

//Return  JSON
router.get('/json', function(req, res, next) {
  festivales.find({},{image:0},function(err, festivales){
    if(err) return next(err);
    res.json({festivales});
  });
});
//Devuelve el XML a pelo
router.get('/xml',isLoggedIn, function(req, res, next){
  festivales.find(function(err, festivales){
    if(err) return next(err);
    var xmlString = xmlify(festivales,{root:'festivales'});
    res.send(xmlify(xmlString,true));
  });
});

router.get('/guide',isLoggedIn, function(req, res, next) {
  festivales.find(function (err, festivales){
    if(err) return next(err);

    res.render('guidefestivales', {festivales:festivales});

  });

});
router.get('/anadir',isLoggedIn, function(req, res, next) {
  festivales.find(function (err, festivales){
    if(err) return next(err);

    res.render('anadirfestival', {festivales:festivales});

  });

});



router.get('/', function(req, res, next) {

  var q = req.query.q;
  if (q==null){
    festivales.find(function (err, festivales){
      if(err) return next(err);

      res.render('guidefestivales', {festivales:festivales});
    });
  } else {
    console.log('query: ',q);

    festivales.find({ "Nombre" : { $regex : new RegExp(q, "i") } },function (err, festivales){
      if(err) return next(err);
      res.render('guidefestivales', {festivales:festivales});
    });
  }
});

//Post
router.post('/',isLoggedIn,upload.single('imageupload'),function(req,res,next){

    console.log('El REQ.FILE:', req.file);

    var data = fs.readFileSync(req.file.path);

    var festival = new festivales({

      Nombre:    req.body.Nombre,
      Fecha:     req.body.Fecha,
      Descripcion:     req.body.Descripcion,


  });

  festival.image.data =  fs.readFileSync(req.file.path);
  festival.image.contentType = req.file.mimetype;
  festival.save(function (err) {
    if (err) return handleError(err);
  });
  res.redirect('/festivales/anadir');
});

router.get('/image/:ID', function(req, res,next) {
    var ID =  req.params.ID;
    console.log("Get image function");
    festivales.findOne({'_id':ID},function (err, festivales ){
        if (err) return next(err);
        res.contentType(festivales.image.contentType);
        res.send(festivales.image.data);
    });
});

router.delete('/:ID',isLoggedIn, function(req, res){

  festivales.remove({ _id: req.params.ID }, function (err) {
    if (err) return handleError(err);
    res.redirect('/');
  });
});

router.get('/:ID', function(req, res, next){

  festivales.findOne({ _id: req.params.ID }, function (err, festival) {
    if(err) return next(err);
    console.log("Hola:  ",festival);
      res.render('festival', {festivales:festival});
    });
});


router.get('/:ID/json', function(req, res, next) {
  festivales.findOne({ _id: req.params.ID },{image:0},function(err, festival){
    if(err) return next(err);
    res.json(festival);
  });
});


module.exports = function (app) {
  app.use('/festivales', router);

};

function isLoggedIn(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
