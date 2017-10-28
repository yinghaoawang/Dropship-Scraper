var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

//var domain = "www.imdb.com";
var list = "http://www.imdb.com/search/title?groups=top_250&sort=user_rating";

/*
function scrape_list(url) {

}
*/

function scrape_page(url, callback) {
    request(url, function(err, res, body) {
        if (err) console.log(err);
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
    });
}

exports.index = function(req, res, next) {
    async.parallel({
        scrape_data: function(callback) {
            /*
            var hello = {"a": "nope"};
            scrape_page("http://www.imdb.com/title/tt0111161/", function(err, value) {
                hello = value;
            });
            console.log(hello);
            */
            scrape_page("http://www.imdb.com/title/tt0111161/", callback);
        }
    }, function(err, results) {
        console.log("success");
        res.render('index', {
            title: 'Index', error: err, data: results,
        });
    });
};
