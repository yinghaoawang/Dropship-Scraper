var express = require('express');
var router = express.Router();

var scraper_controller = require('../controllers/scraperController');
var movie_controller = require('../controllers/movieController');


/* GET home page. */
router.get('/', movie_controller.index);
router.get('/add', scraper_controller.index);

module.exports = router;
