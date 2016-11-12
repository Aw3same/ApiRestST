// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MonumentoSchema = new Schema({
  Nombre:             { type: String },
  Latitud:            { type: Number },
  Longitud:           { type: Number },
  image:              { data: Buffer, contentType: String },
  Descripcion:        { type: String },
});

mongoose.model('Monumento', MonumentoSchema);
