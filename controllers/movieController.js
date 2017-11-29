var async = require('async');
var Movie = require('../models/movie');

var db = require('mongoose').connection;

exports.index = function(req, res, next) {
    async.parallel({
        movies: function(callback) {
            Movie.find().exec(callback);
        },
    }, function(err, results) {
        if (err) next(err);
        var movie_names = [];
        for (var i = 0; i < results.movies.length; ++i) {
            //movie_names += '\'' + results.movies[i].title + '\',';
            movie_names.push(results.movies[i].title);
        }
        //var movie_names_json = JSON.stringify(movie_names);
        //console.log(movie_names_json);
        res.render('index', {
            title: 'Index', error: err, movies: results.movies, movie_names: movie_names
        });
    });
};

exports.movies = function(req, res, next) {
    async.parallel({
        movies: function(callback) {
            Movie.find().exec(callback);
        },
    }, function(err, results) {
        if (err) next(err);
        res.render('movies', {
            title: 'Movies', error: err, movies: results.movies
        });
    });
};
