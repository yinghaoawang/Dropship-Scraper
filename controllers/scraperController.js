var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var domain = "http://www.imdb.com";
var list = "http://www.imdb.com/search/title?groups=top_250&sort=user_rating";

function scrape_list(url, callback) {
    var json = {};

    async.waterfall([
        function(callback) {
            request(url, function(err, res, body) {
                if (err) console.error(err);
                var $ = cheerio.load(body);
                $('.lister-item-content').each(function(i, elem) {
                    var title = $(this).children('.lister-item-header').children('a').text();
                    title += ' ' + $(this).children('.lister-item-header').children('span').last().text();
                    var link = $(this).children('.lister-item-header').children('a').attr('href');
                    var rating = $(this).children('.ratings-bar').children('.ratings-imdb-rating').attr('data-value');
                    json[i] = {
                        'title': title,
                        'link': domain + link,
                        'rating': rating
                    }
                });
                json['raw_html'] = body;
                var next_url = $('.lister-page-next').attr('href');
                json['next_url'] = {'link': domain + '/search/title' + next_url, 'title': 'next'}

                callback(null, json);
            });
        },
        function(prevJson, callback) {
            var newUrl = prevJson['next_url']['link'];
            const prevCount = Object.keys(prevJson).length;
            request(newUrl, function(err, res, body) {
                if (err) console.error(err);
                var $ = cheerio.load(body);
                $('.lister-item-content').each(function(i, elem) {
                    var title = $(this).children('.lister-item-header').children('a').text();
                    title += ' ' + $(this).children('.lister-item-header').children('span').last().text();
                    var link = $(this).children('.lister-item-header').children('a').attr('href');
                    var rating = $(this).children('.ratings-bar').children('.ratings-imdb-rating').attr('data-value');
                    prevJson[i + prevCount] = {
                        'title': title,
                        'link': domain + link,
                        'rating': rating
                    }
                });
                json['raw_html'] = body;
                var next_url = $('.lister-page-next').attr('href');
                json['next_url'] = {'link': domain + '/search/title' + next_url, 'title': 'next'}

                callback(null, prevJson);
            });
        }
    ], function(err, result) {
        callback(null, result);
    });
}

function scrape_page(url, callback) {
    request(url, function(err, res, body) {
        if (err) console.error(err);
        var $ = cheerio.load(body);
        var json = {
            'raw_html': body,
            'Title': $('.title_wrapper').children('h1').text(),
            'Release': $('.subtext').children().last().text(),
            'Rating': $('.ratingValue').text(),
            'Rating Count': $('span[itemprop="ratingCount"]').text(),
            'Genre': function() {
                var line = $('div[itemprop="genre"]').children().not('.inline').text();
                var values = line.split("| ");
                return values;
            }(),
            'Content Rating': function() {
                var line = $('.subtext').text();
                var value = line.substring(0, line.indexOf('|'));
                return value;
            }(),
        };
        // Get directors, writers, and actors from /fullcredits
        if (callback) callback(null, json);
        //callback(null, json);
    });
}

exports.index = function(req, res, next) {
    async.parallel({
        scrape_data: function(callback) {
            scrape_page("http://www.imdb.com/title/tt0111161/", callback);
        },
        scrape_list: function(callback) {
            //scrape_list(list, console.log);
            scrape_list(list, callback);
        }
    }, function(err, results) {
        res.render('index', {
            title: 'Index', error: err, data: results,
        });
    });
};
