var mongoose = require('./bdd');

var citiesSchema = mongoose.Schema({
    city: String,
    image: String,
    desc: String,
    weatherMin: Number,
    weatherMax: Number,
    lat: Number,
    long: Number
  });
  
var CitieModel = mongoose.model('cities', citiesSchema);

module.exports = CitieModel;