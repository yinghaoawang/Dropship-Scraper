var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var domain = "http://www.imdb.com";
var list = "http://www.imdb.com/search/title?groups=top_250&sort=user_rating";

function scrape_cast(json, callback) {
    async.each(json['movies'], function(item, callback) {
        item['actors'] = [];
        item['directors'] = [];
        item['writers'] = [];
        var url = item['cast_link'];
        request(url, function(err, res, body) {
            if (err) console.error(err);
            var $ = cheerio.load(body);
            $('.cast_list').children('tbody').children('tr').each(function(i, elem) {
                if (i != 0) { // first listing is a blank on imdb
                    var actor = {
                        'name': $(this).children('td[itemprop="actor"]').text(),
                    }
                    item['actors'].push(actor);
                }
            });
            $('.simpleCreditsTable').first().children('tbody').children('tr').each(function(i, elem) {
                var director = {
                    'name': $(this).children('.name').text(),
                }
                item['directors'].push(director);
            });
            $('.simpleCreditsTable').eq(1).children('tbody').children('tr').each(function(i, elem) {
                if ($(this).children('.name').length != 0) {
                    var writer = {
                        'name': $(this).children('.name').text(),
                        'credit': $(this).children('.credit').text()
                    }
                    item['writers'].push(writer);
                }
            });
            callback(null, json);
        });
    }, function(err) {
        if (err) console.log(err);
        callback(null, json);
    });
}

function scrape_movie(json, callback) {
    async.each(json['list'], function (item, callback) {
        var url = item['link'];
        request(url, function(err, res, body) {
            if (err) console.error(err);
            var $ = cheerio.load(body);
            var movie = {
                //'raw_html': body,
                'link': url,

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
            // Get directors, writers, and actors from /fullcredits
            json['movies'].push(movie);
            callback(null, json);
        });
        //callback(null, json);
    }, function(err) {
        if (err) console.error(err);
        callback(null, json);
    });
}

// helper: turns www.google.com/hello to www.google.com/
function remove_link_ending(link) {
    return link.substring(0, link.lastIndexOf('/') + 1);
}

function scrape_list(json, callback) {
    var url = json['next_url'];
    const prevCount = Object.keys(json['list']).length;
    request(url, function(err, res, body) {
        if (err) console.error(err);
        var $ = cheerio.load(body);
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
            if (i == 1) json['list'].push(movie);
        });
        //json['raw_html'] = body;
        var next_url = $('.lister-page-next').attr('href');
        json['next_url'] = domain + '/search/title' + next_url;

        callback(null, json);
    });
}

function start_scrape_list(json, callback) {
    async.waterfall([
        function(callback) {
            callback(null, json);
        },
        scrape_list,
        scrape_movie,
        scrape_cast
    ], function(err, result) {
        callback(null, result);
    });
}


exports.index = function(req, res, next) {
    var json = {'next_url':  list, 'movies': [], 'list': []};
    async.parallel({
        scrape_data: function(callback) {
            //scrape_list(json, console.log);
            start_scrape_list(json, callback);
        }
    }, function(err, results) {
        res.render('index', {
            title: 'Index', error: err, data: results,
        });
    });
};
