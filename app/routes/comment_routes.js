// Express docs: http://expressjs.com/en/api.html
const express = require("express");
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport");

// pull in Mongoose model for examples
const Comment = require("../models/comment");

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require("../../lib/custom_errors");

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require("../../lib/remove_blank_fields");
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate("bearer", { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();

// Individual Video / Comment Index Route
// GET / Video

// INDEX
// GET /examples
router.get('/comments', (req, res, next) => {
	Comment.find()
		.then((foundComments) => {
            console.log(foundComments)
			// `examples` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return foundComments.map((comment) => comment.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((comments) => res.status(200).json({ comments: comments }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/comments/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Comment.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON
		.then((comment) => res.status(200).json({ comment: comment.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})


//example post data
// {
//     "Comment":{
//         "commentText": "test post working",
//         "thumbnail": "jonathan" 
//     }
// }


// CREATE
// POST /examples
router.post('/comments', (req, res, next) => {
	// set owner of new example to be current user
	// req.body.comment.owner = req.user.id

	Comment.create(req.body.Comment)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((newComment) => {
			res.status(201).json({ Comment: newComment.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})


module.exports = router