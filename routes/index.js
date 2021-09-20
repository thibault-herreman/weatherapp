var express = require('express');
var router = express.Router();
var request = require('sync-request');

const CitieModel = require('../models/model-cities');

const myApiKey = process.env.OPENWEATHERMAP;
let error = '';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login WeatherApp', errorConnect: req.session.errorConnect, errorInsc: req.session.errorInsc });
});

/* GET page avec nos villes recherchées */
router.get('/weather', async function(req, res, next) {
  if(req.session.user === null) {
     res.redirect('/');
  } else {
    const cityList = await CitieModel.find();
    res.render('weather', { title: 'WeatherApp', cityList, error});
  }
});

/* POST ajout d'une ville */
router.post('/add-city', async function(req, res, next){
  
  const city = req.body.enterCity;
  const requete = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&lang=fr&units=metric&appid=${myApiKey}`);
  const resultWS = JSON.parse(requete.body);

  if ((resultWS.cod < 300) && (city.toLowerCase() != '')) {

    const weatherData = await CitieModel.find();

    const alreadyExist = await CitieModel.findOne({ city: resultWS.name });

    if (alreadyExist == null) {
      error = '';

      const newCity = new CitieModel ({
        city: resultWS.name,
        image: `http://openweathermap.org/img/wn/${resultWS.weather[0].icon}.png`,
        desc: resultWS.weather[0].description,
        weatherMin : resultWS.main.temp_min,
        weatherMax : resultWS.main.temp_max,
        lat: resultWS.coord.lat,
        long: resultWS.coord.lon
      });
        
      const orderSaved = await newCity.save();

    } 
    else {
      error = 'City already exist';
    }
  } else {
    error = 'Error ! City not found';
  }

  res.redirect('/weather');
});

/* GET suppression d'une ville */
router.get('/delete-city', async function(req, res, next){
  error = '';
  
  await CitieModel.deleteOne(
    { _id: req.query.id }
  );

  res.redirect('/weather');
});

/* GET mis à jour des données avec l'API weather */
router.get('/update-data', async function(req, res, next) {
  
  error = '';
  const weatherData = await CitieModel.find();

  for (let i=0; i < weatherData.length; i++) {
    const requete = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${weatherData[i].city.toLowerCase()}&lang=fr&units=metric&appid=${myApiKey}`);
    const resultWS = JSON.parse(requete.body);

    await CitieModel.updateOne(
      { city: resultWS.name },
      { 
        image: `http://openweathermap.org/img/wn/${resultWS.weather[0].icon}.png`,
        desc: resultWS.weather[0].description,
        weatherMin : resultWS.main.temp_min,
        weatherMax : resultWS.main.temp_max
      }
    );
  }

  res.redirect('/weather');
});

module.exports = router;