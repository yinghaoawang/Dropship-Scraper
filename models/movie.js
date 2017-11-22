var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MovieSchema = Schema(
    {
        title: { type: String, required: true, max: 255 },
        link: { type: String, required: true, max: 255 },
        rating:{ type: Number, required: true, max: 10 },
        actors: { type: [{ name: String }], required: true },
        directors: { type: [{ name: String }], required: true },
        writers: { type: [{ name: String, credit: String }], required: true }
    }
);

module.exports = mongoose.model('Movie', MovieSchema);
