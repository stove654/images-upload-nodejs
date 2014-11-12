// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var app        = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/image'); // connect to our database
var Image     = require('./app/models/image');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/images')

    // create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {

        var image = new Image();		// create a new instance of the Bear model
        image.name = req.body.name;  // set the bears name (comes from the request)

        image.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Image created!' });
        });


    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Image.find(function(err, images) {
            if (err)
                res.send(err);

            res.json(images);
        });
    });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
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

    // delete the bear with this id
    .delete(function(req, res) {
        Image.remove({
            _id: req.params.image_id
        }, function(err, image) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);