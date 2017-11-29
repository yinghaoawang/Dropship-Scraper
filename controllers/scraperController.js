var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var Movie = require('../models/movie');

var db = require('mongoose').connection;

var domain = "http://www.imdb.com";
var list = "http://www.imdb.com/search/title?groups=top_250&sort=user_rating";

// scrapes directors, writers, and actors from json['movies'], stored in json['movies']['directors'], etc.
function scrape_cast(json, callback) {
    async.each(json['movies'], function(item, callback) {
        // initialize empty arrays
        item['actors'] = [];
        item['directors'] = [];
        item['writers'] = [];
        var url = item['cast_link'];
        request(url, function(err, res, body) {
            if (err) callback(err);
            var $ = cheerio.load(body);
            // get actors info
            $('.cast_list').children('tbody').children('tr').each(function(i, elem) {
                if (i != 0) { // first listing is a blank on imdb
                    var actor = {
                        'name': $(this).children('td[itemprop="actor"]').text().trim(),
                    }
                    item['actors'].push(actor);
                }
            });
            // get directors info
            $('.simpleCreditsTable').first().children('tbody').children('tr').each(function(i, elem) {
                var director = {
                    'name': $(this).children('.name').text().trim(),
                }
                item['directors'].push(director);
            });
            // get writers info
            $('.simpleCreditsTable').eq(1).children('tbody').children('tr').each(function(i, elem) {
                if ($(this).children('.name').length != 0) { // sometimes theres a blank <tr>
                    var writer = {
                        'name': $(this).children('.name').text().trim(),
                        'credit': $(this).children('.credit').text().trim()
                    }
                    item['writers'].push(writer);
                }
            });
            callback(null, json);
        });
    }, function(err) {
        if (err) callback(err);
        callback(null, json);
    });
}

// scrapes all the movie links in json['list'], movies stored in json['movies']
function scrape_movie(json, callback) {
    async.each(json['list'], function (item, callback) {
        var url = item['link'];
        request(url, function(err, res, body) {
            if (err) callback(err);
            var $ = cheerio.load(body);
            // get movie info
            var movie = {
                'link': url, // important- needed for cast scraping
                'title': $('.title_wrapper').children('h1').text(),
                'release': $('.subtext').children().last().text(),
                'rating': $('.ratingValue').text(),
                'rating count': $('span[itemprop="ratingCount"]').text(),
                'genre': function() {
                    var line = $('div[itemprop="genre"]').children().not('.inline').text();
                    var values = line.split("| ");
                    return values;
                }(),
                'content rating': function() {
                    var line = $('.subtext').text();
                    var value = line.substring(0, line.indexOf('|'));
                    return value;
                }(),
                // besides the url, this is the same for every page, but i didn't want to hardcode (Maybe i should)
                'cast_link': url + $('#titleCast').children('.see-more').children('a').attr('href'),
            };
            json['movies'].push(movie);
            callback(null, json);
        });
        //callback(null, json);
    }, function(err) {
        if (err) callback(err);
        callback(null, json);
    });
}

// helper: turns www.google.com/hello to www.google.com/
function remove_link_ending(link) {
    return link.substring(0, link.lastIndexOf('/') + 1);
}

// scrapes a list given url in json['next_url'], list of movies goes into json['list]
function scrape_list(json, callback) {
    var url = json['next_url'];
    const prevCount = Object.keys(json['list']).length;
    request(url, function(err, res, body) {
        if (err) callback(err);
        var $ = cheerio.load(body);
        // get each movie info from list
        $('.lister-item-content').each(function(i, elem) {
            var title = $(this).children('.lister-item-header').children('a').text();
            title += ' ' + $(this).children('.lister-item-header').children('span').last().text();
            var link = $(this).children('.lister-item-header').children('a').attr('href');
            link = remove_link_ending(link);
            var rating = $(this).children('.ratings-bar').children('.ratings-imdb-rating').attr('data-value');
            var movie = {
                'title': title,
                'link': domain + link,
                'rating': rating
            };
            json['list'].push(movie);
        });
        // gets the "next" button on the list (because a list only shows 50 at a time)
        var next_url = $('.lister-page-next').attr('href');
        json['next_url'] = domain + '/search/title' + next_url;

        callback(null, json);
    });
}

// the system for scraping: a series of callbacks for consecutive http requests
function start_scrape_list(json, callback) {
    async.waterfall([
        function(callback) {
            callback(null, json);
        },
        scrape_list,
        scrape_movie,
        scrape_cast,
    ], function(err, result) {
        callback(null, result);
    });
}

// get page for /add
exports.index = function(req, res, next) {
    // Render page, send scrape_data as results
    res.render('add', {
        title: 'Add Movies'
    });
};

// for post request of a list on /add
exports.scrape = function(req, res) {
    // important json initial empty arrays or else will crash
    var json = {'next_url':  list, 'movies': [], 'list': []};
    async.parallel({
        // data is stored into scrape_data
        scrape_data: function(callback) {
            start_scrape_list(json, callback);
        }
    }, function(err, results) {
        // CLEAR DB
        db.dropCollection('movies', function(err, res) {
            if (err) console.error(err);
            //console.log(res);
        });
        // Store the movies into the db
        var movies = results.scrape_data['movies'];

        for (var i = 0; i < movies.length; ++i) {
            var movie = movies[i];
            var movie_db = new Movie({
                title: movie['title'].trim(),
                link: movie['link'],
                rating: parseFloat(movie['rating']),
                actors: function() {
                    var actors = [];
                    var as = movie['actors'];
                    for (var i = 0; i < as.length; ++i) actors.push({
                        'name' : as[i]['name']
                    });
                    return actors;
                }(),
                writers: function() {
                    var writers = [];
                    var ws = movie['writers'];
                    for (var i = 0; i < ws.length; ++i) writers.push({
                        'name': ws[i]['name'],
                        'credit': ws[i]['credit']
                    });
                    return writers;
                }(),
                directors: function() {
                    var directors = [];
                    var ds = movie['directors'];
                    for (var i = 0; i < ds.length; ++i) directors.push({
                        'name': ds[i]['name'],
                    });
                    return directors;
                }()

            });

            //console.log(movie_db);

            // Store into the DB
            movie_db.save(function(err) {
                if (err) console.error(err);
            });
        }
        res.send({
            msg: 'done',
            data: results
        });
    });
};
