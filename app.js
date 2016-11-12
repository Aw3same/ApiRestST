

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

  // mongoose.connect(config.db);
  // var db = mongoose.connection;
  // db.on('error', function () {
  //   throw new Error('unable to connect to database at ' + config.db);
  // });

var mongoURI = 'mongodb://admin_heroku:database1234@ds039427.mlab.com:39427/heroku_xw198h7t';
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) { console.log(err.message);
console.log("no rulo"); });
MongoDB.once('open', function() {
  console.log("mongodb connection open");
});
mongoose.connect(mongoURI);

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

MongoClient.connect('mongodb://admin_heroku:database1234@ds039427.mlab.com:39427/heroku_xw198h7t', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {
        collection.count(function(err, count) {
            console.log(format("count = %s", count));
        });
    });

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
    });
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
