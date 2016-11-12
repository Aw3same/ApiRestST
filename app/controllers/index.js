var xmlify = require('xmlify');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = mongoose.model('usuario');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: './uploads' });
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {
  app.use('/', router);
};

passport.use(new LocalStrategy(
  function(username, password, done) {

    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      console.log("entro");
      if (!user) {
        console.log("no existe user");
        return done(null, false, { message: 'Incorrect username.' });

      }
      console.log("existe usuario");
      if (user.password != password) {
        console.log("contraseña erronea");
         return done(null, false, { message: 'Invalid password' });

       }
       console.log("existe");
      return done(null, user);
    });
  }
));


  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  router.post('/',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })
);


// esto hay q quitarlo

router.post('/anadir',function(req,res,next){


    var usuario = new User({

      username:    req.body.username,
      password:     req.body.password


  });

  usuario.save(function (err) {
    if (err) return handleError(err);
  });
  res.redirect('/');
});
router.get('/anadir', function(req, res, next) {

        res.render('anadirusuario');

});


//quitar hasta aqui




router.get('/',isLoggedIn, function(req, res, next) {

        res.render('index');

});
router.get('/login', function(req, res, next) {

        res.render('login');

});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req,res,next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
