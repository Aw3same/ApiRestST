
var xmlify = require('xmlify');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var leyendas = mongoose.model('Leyenda');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: './uploads' });
var cors = require('cors');

//Return  JSON
router.get('/json', function(req, res, next) {
  leyendas.find({},{image:0},function(err, leyendas){
    if(err) return next(err);
    res.json({leyendas});
  });
});
//Devuelve el XML a pelo
router.get('/xml',isLoggedIn, function(req, res, next){
  leyendas.find(function(err, leyendas){
    if(err) return next(err);
    var xmlString = xmlify(leyendas,{root:'leyendas'});
    res.send(xmlify(xmlString,true));
  });
});

router.get('/guide',isLoggedIn, function(req, res, next) {
  leyendas.find(function (err, leyendas){
    if(err) return next(err);

    res.render('guideleyendas', {leyendas:leyendas});

  });

});
router.get('/anadir',isLoggedIn, function(req, res, next) {
  leyendas.find(function (err, leyendas){
    if(err) return next(err);

    res.render('anadirleyenda', {leyendas:leyendas});

  });

});



router.get('/', function(req, res, next) {

  var q = req.query.q;
  if (q==null){
    leyendas.find(function (err, leyendas){
      if(err) return next(err);

      res.render('guideleyendas', {leyendas:leyendas});
    });
  } else {
    console.log('query: ',q);

    leyendas.find({ "Nombre" : { $regex : new RegExp(q, "i") } },function (err, leyendas){
      if(err) return next(err);
      res.render('guideleyendas', {leyendas:leyendas});
    });
  }
});

//Post
router.post('/',isLoggedIn,upload.single('imageupload'),function(req,res,next){

    console.log('El REQ.FILE:', req.file);

    var data = fs.readFileSync(req.file.path);

    var leyenda = new leyendas({

      Nombre:    req.body.Nombre,
      Descripcion:     req.body.Descripcion,

  });

  leyenda.image.data =  fs.readFileSync(req.file.path);
  leyenda.image.contentType = req.file.mimetype;
  leyenda.save(function (err) {
    if (err) return handleError(err);
  });
  res.redirect('/leyendas/anadir');
});

router.get('/image/:ID', function(req, res,next) {
    var ID =  req.params.ID;
    console.log("Get image function");
    leyendas.findOne({'_id':ID},function (err, leyendas ){
        if (err) return next(err);
        res.contentType(leyendas.image.contentType);
        res.send(leyendas.image.data);
    });
});

router.delete('/:ID',isLoggedIn, function(req, res){

  leyendas.remove({ _id: req.params.ID }, function (err) {
    if (err) return handleError(err);
    res.redirect('/');
  });
});

router.get('/:ID', function(req, res, next){

  leyendas.findOne({ _id: req.params.ID }, function (err, leyenda) {
    if(err) return next(err);
    console.log("Hola:  ",leyenda);
      res.render('leyenda', {leyendas:leyenda});
    });
});


router.get('/:ID/json', function(req, res, next) {
  leyendas.findOne({ _id: req.params.ID },{image:0},function(err, leyenda){
    if(err) return next(err);
    res.json(leyenda);
  });
});


module.exports = function (app) {
  app.use('/leyendas', router);

};

function isLoggedIn(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
