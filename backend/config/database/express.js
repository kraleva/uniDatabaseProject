const express = require('express');

module.exports = () => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  console.log('Express Ready ! ');
}