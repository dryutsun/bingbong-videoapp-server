const express = require("express");
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
const crypto = require("crypto");
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport");
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js

const bcrypt = require('bcrypt')
const removeBlanks = require("../../lib/remove_blank_fields")
const customErrors = require("../../lib/custom_errors")
const handle404 = customErrors.handle404

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10;

// pull in error types and the logic to handle them and set status codes
const errors = require("../../lib/custom_errors");

const BadParamsError = errors.BadParamsError;
const BadCredentialsError = errors.BadCredentialsError;

const User = require("../models/user");
const Video = require("../models/video");

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate("bearer", { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();

// INDEX
// GET /examples
router.get("/videos", (req, res, next) => {
  Video.find()
    .then((foundVideos) => {
      console.log(foundVideos);
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return foundVideos.map((video) => video.toObject());
    })
    // respond with status 200 and JSON of the examples
    .then((videos) => res.status(200).json({ videos: videos }))
    // if an error occurs, pass it to the handler
    .catch(next);
});

// CREATE
// POST /examples
router.post('/videos', (req, res, next) => {
	// set owner of new example to be current user
	// req.body.Video.owner = req.user.id
	Video.create(req.body.Video)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((createdVideo) => {
			res.status(201).json({ createdVideo: createdVideo.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/videos/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Video.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON
		.then((Video) => res.status(200).json({ Video: Video.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})


router.patch("/videos/:id", removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
//   delete req.body.example.owner

  Video.findById(req.params.id)
    .then(handle404)
    .then((editedVideo) => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
    //   requireOwnership(req, example)

      // pass the result of Mongoose's `.update` to the next `.then`
      console.log(req.body.editedVideo)
      return editedVideo.updateOne(req.body.editedVideo)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/videos/:id',  (req, res, next) => {
	Video.findById(req.params.id)
		.then(handle404)
		.then((deletedVid) => {
			// throw an error if current user doesn't own `example`
			// requireOwnership(req, example)
			// delete the example ONLY IF the above didn't throw
			deletedVid.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router 

