

var express    = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080;

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/image');
var Image     = require('./app/models/image');


var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


router.route('/images')

    .post(function(req, res) {

        var image = new Image();
        image.name = req.body.name;

        image.save(function(err,data) {
            if (err)
                res.send(err);
            console.log(data);
            res.json(data);
        });


    })

    .get(function(req, res) {
        Image.find(function(err, images) {
            if (err)
                res.send(err);

            res.json(images);
        });
    });


router.route('/images/:image_id')

    // get the bear with that id
    .get(function(req, res) {
        Image.findById(req.params.image_id, function(err, image) {
            if (err)
                res.send(err);
            res.json(image);
        });
    })

    // update the bear with this id
    .put(function(req, res) {
        Image.findById(req.params.image_id, function(err, image) {

            if (err)
                res.send(err);

            image.name = req.body.name;
            image.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'image updated!' });
            });

        });
    })

    .delete(function(req, res) {
        Image.remove({
            _id: req.params.image_id
        }, function(err, image) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


app.use('/api', router);


app.listen(port);
console.log('Magic happens on port ' + port);