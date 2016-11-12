// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LeyendasSchema = new Schema({
  Nombre:             { type: String },
  image:              { data: Buffer, contentType: String },
  Descripcion:        { type: String },
});

mongoose.model('Leyenda', LeyendasSchema);
