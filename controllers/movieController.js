var async = require('async');
var Movie = require('../models/movie');

var db = require('mongoose').connection;

exports.index = function(req, res, next) {
    async.parallel({
        movies: function(callback) {
            Movie.find({}).exec(callback);
        }
    }, function(err, results) {
        if (err) next(err);
        console.log(results.movies.length);
        res.render('index', {
            title: 'Index', error: err, movies: results.movies
        });
    });
};
