var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ImageSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Image', ImageSchema);