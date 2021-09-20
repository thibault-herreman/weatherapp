var mongoose = require('./bdd');

var usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
  });
  
var UserModel = mongoose.model('users', usersSchema);

module.exports = UserModel;