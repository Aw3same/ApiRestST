var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var usuarioSchema = new Schema({

  username:    { type: String },
  password:     { type: String },
});


mongoose.model('usuario', usuarioSchema);
