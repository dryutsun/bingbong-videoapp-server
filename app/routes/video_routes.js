const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const User = require('../models/user')
const Video = require('../models/video')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
router.get('/videos',  (req, res, next) => {
	Video.find()
		.then((foundVideos) => {
            console.log(foundVideos)
			// `examples` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return foundVideos.map((video) => video.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((videos) => res.status(200).json({ videos: videos }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /examples
router.post('/videos', (req, res, next) => {
	// set owner of new example to be current user
	// req.body.Video.owner = req.user.id

	Video.create(req.body.Video)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((createdVideo) => {
			res.status(201).json({ createdVidoe: createdVideo.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})


module.exports = router 
