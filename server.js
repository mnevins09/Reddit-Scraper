var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

///initializing the app
var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.use(logger('dev'));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))

// set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(path.join(__dirname, 'public')))


//setting up routes
var index = require('./routes/index')
var articles = require('./routes/articles')
var notes = require('./routes/notes')
var scrape = require('./routes/scrape')

app.use('/', index)
app.use('/articles', articles);
app.use('/notes', notes);
app.use('/scrape', scrape);

//starting server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`)
});


