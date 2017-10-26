var express = require('express');
var router = express.Router();

var scraper_controller = require('../controllers/scraperController');

/* GET home page. */
router.get('/', scraper_controller.index);

module.exports = router;
