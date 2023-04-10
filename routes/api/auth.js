const express = require('express')
const bcrypt = require('bcryptjs')
var cookie = require('cookie-parser')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')

// getting setting
const settings = require('../../config/settings')

const router = express.Router()

const Sales = require('./../../models/Person')

router.use(cookie())

// Route to register a user. URL : /api/auth/register
router.post('/register', (req, res) => {
    // check if username is already in collection.
    Sales
        .findOne({ name: req.body.name })
        .then(sale => {
            if (sale) {
                res.render(
                    'hbs_register', {
                        username_already_exists: 'Username already exists!'
                    }
                )
            } else {
                const sale = Sales({
                    date: req.body.date,
                    name: req.body.name,
                    tags: req.body.tags,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    storeLocation: req.body.storeLocation,
                    gender: req.body.gender,
                    age: req.body.age,
                    email: req.body.email,
                    satisfaction: req.body.satisfaction,
                    couponUsed: req.body.couponUsed,
                    purchaseMethod: req.body.purchaseMethod,
                })

                // encrypting the password using bcryptjs
                bcrypt.genSalt(10, (err, salt) => {
                    // salt is provided in salt variable.
                    bcrypt.hash(sale.password, salt, (err, hash) => {
                        if (err) {
                            return res.status(400).send('Not Registered, Contact Admin!')
                        } else {
                            // hashed password
                            person.password = hash

                            // add new person with hashed password.
                            person
                                .save()
                                .then(person => res.render(
                                    'hbs_register', {
                                        output: 'Successfully added!'
                                    }
                                ))
                                .catch(err => res.send(err.message))
                        }
                    })
                })
            }
        })
        .catch(err => res.send(err))
})

// Route to login a user. URL : /api/auth/login
router.post('/login', (req, res) => {
    username = req.body.username
    password = req.body.password

    // check if username is already in collection.
    Person
        .findOne({ username: req.body.username })
        .then(person => {
            if (person) {
                // compare the password
                bcrypt
                    .compare(password, person.password)
                    .then(
                        (isCompared) => {
                            if (isCompared) {
                                // res.cookie('session_id', '123')
                                // res.send('Login Success')

                                // generate JWT
                                const payload = {
                                    id: person.id,
                                    name: person.name,
                                    username: person.username
                                }

                                // jsonwebtoken method used to create token.
                                jsonwt.sign(payload, settings.secret, { expiresIn: 3600 },
                                    (err, token) => {
                                        console.log(err)
                                        console.log(token)
                                        res.render(
                                            'hbs_login', {
                                                output: 'Login Successfull!',
                                                jwt_token: token
                                            }
                                        )

                                    }
                                )
                            } else {
                                res.render(
                                    'hbs_login', {
                                        output: 'Password incorrect!'
                                    }
                                )
                            }
                        }
                    )
                    .catch()
            } else {
                res.render(
                    'hbs_login', {
                        output: 'User does not exist!'
                    }
                )
            }
        })

})

// function validateCookie(req, res, next) {
//     const {cookies} = req;

//     if('session_id' in cookies) {
//         if(cookies.session_id == 123) {
//             next()
//         }else{
//             res.status(403).send('Not Authorized')
//         }
//     }
// }

// Private route to get all user details
router.post('/get', passport.authenticate('jwt', { session: false }), async(req, res) => { // middleware from passport-jwt
    let people_un = []
    jwt_token = req.body.jwt_token
    res.set('Authorization', `Bearer ${jwt_token}`);
    const cursor = await Person.find()
    cursor.forEach((person) => {
        people_un.push(person.username)
    })
    res.send(people_un)
})

router.get("/hbs_validate", async(req, res) => {
    res.render(
        'hbs_validate'
    )
});

router.get("/hbs_login", async(req, res) => {
    res.render(
        'hbs_login'
    )
});

router.get("/hbs_register", async(req, res) => {
    res.render(
        'hbs_register'
    )
});



module.exports = router