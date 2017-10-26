var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        raw_data: function(callback) {
            var url = 'http://imdb.com/title/tt1229340';
            request(url, function(err, res, body) {
                if (err) console.log(err);
                callback(null, body);
            });
        }
    }, function(err, results) {
        console.log("success");
        res.render('index', { title: 'Index', error: err, data: results.raw_data });
    });
};

/*
 * does not work
function scrapePage(callback) {
    var url = 'http://imdb.com/title/tt1229340';
    request(url, function(err, res, body) {
        if (err) console.log(err)
        //console.log(body);
        if (callback) {
            //callback("hello");
            console.log(body);
            callback(body);
        }
        return body.toString();
    });
}
*/
