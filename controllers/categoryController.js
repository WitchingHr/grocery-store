const express = require('express');

exports.index = function(req, res) {
  res.render('categories', { title: 'Categories' });
}
