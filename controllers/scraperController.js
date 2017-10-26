var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        scrape_data: function(callback) {
            var url = 'https://www.amazon.com/gp/product/B00CHSCJ7A/ref=s9u_simh_gw_i2?ie=UTF8&fpl=fresh&pd_rd_i=B00CHSCJ7A&pd_rd_r=4be7b76f-baa0-11e7-a78d-95e65c90c0fe&pd_rd_w=x8T6r&pd_rd_wg=CWGJm&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=&pf_rd_r=M09M8WJGBS93ZAJC20K6&pf_rd_t=36701&pf_rd_p=1dd2ffc3-992f-4bde-81b0-de270e0ead5a&pf_rd_i=desktop';
            request(url, function(err, res, body) {
                if (err) console.log(err);
                var $ = cheerio.load(body);
                var json = { title: "", release: "", rating: ""};
                /*
                $('#productTitle').filter(function() {
                    json.title = $(this).children().text();
                });
                */
                json.raw_html = body;
                json.title = $('#productTitle').text();
                console.log(json.title);
                $('#wayfinding-breadcrumbs_container').filter(function() {
                    json.release = $(this).text();
                });
                $('#averageCustomerReviews').filter(function() {
                    json.rating = $(this).text();
                });
                console.log(json);
                callback(null, json);
            });
        }
    }, function(err, results) {
        console.log("success");
        res.render('index', {
            title: 'Index', error: err, data: results,
            product_title: results.scrape_data.title,
            product_release: results.scrape_data.release,
            product_rating: results.scrape_data.rating
        });
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
