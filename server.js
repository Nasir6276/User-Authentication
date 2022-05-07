const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Passport config
require('./config/passport')(passport);

// Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); 

// Connect Flash
app.use(flash());

// DB configuration
const db = require('./config/keys').mongoURI;

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Mongo is connected...'))
    .catch(err => console.log(err));

// Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'))

const port = process.env.PORT || 5000;

app.listen(port, console.log(`server is running on port ${port}`));