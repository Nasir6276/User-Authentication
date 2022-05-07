const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const req = require('express/lib/request');

// Import User Model
const User = require('../model/User');

// Exporting Strategy
module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done (null, false, { message: 'the email is not registered' })
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'password incorrect' })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    // Serializing User
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
    
    // Deserilizing user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });   
}