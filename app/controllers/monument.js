
var xmlify = require('xmlify');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var monumentos = mongoose.model('Monumento');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: './uploads' });
var cors = require('cors');

//Return  JSON
router.get('/json', function(req, res, next) {
  monumentos.find({},{image:0},function(err, monumentos){
    if(err) return next(err);
    res.json({monumentos});
  });
});
//Devuelve el XML a pelo
router.get('/xml',isLoggedIn, function(req, res, next){
  monumentos.find(function(err, monumentos){
    if(err) return next(err);
    var xmlString = xmlify(monumentos,{root:'monumentos'});
    res.send(xmlify(xmlString,true));
  });
});

router.get('/guide',isLoggedIn, function(req, res, next) {
  monumentos.find(function (err, monumentos){
    if(err) return next(err);

    res.render('guidemonumentos', {monumentos:monumentos});

  });

});
router.get('/anadir',isLoggedIn, function(req, res, next) {
  monumentos.find(function (err, monumentos){
    if(err) return next(err);

    res.render('anadirmonumento', {monumentos:monumentos});

  });

});



router.get('/', function(req, res, next) {

  var q = req.query.q;
  if (q==null){
    monumentos.find(function (err, monumentos){
      if(err) return next(err);

      res.render('guidemonumentos', {monumentos:monumentos});
    });
  } else {
    console.log('query: ',q);

    monumentos.find({ "Nombre" : { $regex : new RegExp(q, "i") } },function (err, monumentos){
      if(err) return next(err);
      res.render('guidemonumentos', {monumentos:monumentos});
    });
  }
});

//Post
router.post('/',isLoggedIn,upload.single('imageupload'),function(req,res,next){

    console.log('El REQ.FILE:', req.file);

    var data = fs.readFileSync(req.file.path);

    var monumento = new monumentos({

      Nombre:    req.body.Nombre,
      Latitud:     req.body.Latitud,
      Longitud:     req.body.Longitud,
      Descripcion:     req.body.Descripcion,


  });

  monumento.image.data =  fs.readFileSync(req.file.path);
  monumento.image.contentType = req.file.mimetype;
  monumento.save(function (err) {
    if (err) return handleError(err);
  });
  res.redirect('/monumentos/anadir');
});

router.get('/image/:ID', function(req, res,next) {
    var ID =  req.params.ID;
    console.log("Get image function");
    monumentos.findOne({'_id':ID},function (err, monumentos ){
        if (err) return next(err);
        res.contentType(monumentos.image.contentType);
        res.send(monumentos.image.data);
    });
});

router.delete('/:ID', function(req, res){

  monumentos.remove({ _id: req.params.ID }, function (err) {
    if (err) return handleError(err);
    res.redirect('/');
  });
});

router.get('/:ID', function(req, res, next){

  monumentos.findOne({ _id: req.params.ID }, function (err, monumento) {
    if(err) return next(err);
    console.log("Hola:  ",monumento);
      res.render('monument', {monumentos:monumento});
    });
});


router.get('/:ID/json', function(req, res, next) {
  monumentos.findOne({ _id: req.params.ID },{image:0},function(err, monumento){
    if(err) return next(err);
    res.json(monumento);
  });
});


module.exports = function (app) {
  app.use('/monumentos', router);

};

function isLoggedIn(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
