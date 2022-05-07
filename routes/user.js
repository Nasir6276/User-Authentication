const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

// Import User Model
const User = require('../model/User');

// Register
router.get('/register', (req, res) => {
    res.send('Register')
})
// Login
router.get('/login', (req, res) => {
    res.send('Login')
})

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, phone, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !phone || !password || !password2 ) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check password match
    if(password !== password2) {
        errors.push({ msg: 'passwords do not match' })
    }

    // Check password length
    if(password.lenght < 6) {
        errors.push({ msg: 'Password should be at least 6 charachters' });
    }

    if(errors.length > 0) {
        res.status(401).send('retry');
    } else {
        // Validation Passed
        User.findOne({ email: email})
            .then(user => {
                if(user) {
                    errors.push({ msg: 'You already have an account' })
                    res.status(401).send('user already exist')
                } else {
                    const newUser = new User({
                        name,
                        email,
                        phone,
                        password
                    })

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;

                            // Set password to hashed
                            newUser.password = hash;

                            // Save User
                            newUser.save()
                                .then(user => {
                                    res.status(200).send('user created')
                                    console.log('redirect to login page');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
    console.log('you have successfully logged out');
})

module.exports = router; 