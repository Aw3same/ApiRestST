// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FestivalesSchema = new Schema({
  Nombre:             { type: String },
  Fecha:              { type: String },
  image:              { data: Buffer, contentType: String },
  Descripcion:        { type: String },
});

mongoose.model('Festival', FestivalesSchema);
