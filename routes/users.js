var express = require('express');
var router = express.Router();

const UserModel = require('../models/model-users');
var bcrypt = require("bcrypt");

// POST enregistrement user bdd
router.post('/sign-up', async function(req, res, next){

  if (req.body.username != '' && req.body.email != '' && req.body.password != '') {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var verifExist = await UserModel.findOne({ email: email });

    if (verifExist != null) {

      req.session.errorInsc = 'Cet email est déjà enregistré';
      res.redirect('/');
      
    } else {
      const hash = bcrypt.hashSync(password, 10);

      const newUser = new UserModel ({
        username: username,
        email: email,
        password: hash
      });
        
      let orderSaved = await newUser.save();

      req.session.user = {
        email: orderSaved.email,
        id: orderSaved.id
      };

      res.redirect('/weather');

    }
  } else {
    req.session.errorInsc = 'Veuillez remplir tous les champs';
    res.redirect('/');
  }

});

// POST connexion
router.post('/sign-in', async function(req, res, next){

  if (req.body.email != '' && req.body.password != '') {
    const email = req.body.email;
    const password = req.body.password;

    var user = await UserModel.findOne({ email: email});

    if (user !== null && bcrypt.compareSync(password, user.password) ) {
      
      req.session.user = {
        email: user.email,
        id: user.id
      };

      res.redirect('/weather');
    } else {

      req.session.errorConnect = "L'email ou le mot de passe n'existe pas";
      res.redirect('/');

    }

  } else {
    req.session.errorConnect = 'Veuillez remplir tous les champs';
    res.redirect('/');
  }

  
});

/* GET deco */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.errorInsc = null;
  req.session.errorConnect = null;

  res.redirect('/');
});

module.exports = router;
