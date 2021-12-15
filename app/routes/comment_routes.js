// Express docs: http://expressjs.com/en/api.html
const express = require("express");
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport");

// pull in Mongoose model for examples
const Comment = require("../models/comment");
const Video = require('../models/video')

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
// router.get('/comments', (req, res, next) => {
// 	Comment.find()
// 		.then((foundComments) => {
//             console.log(foundComments)
// 			// `examples` will be an array of Mongoose documents
// 			// we want to convert each one to a POJO, so we use `.map` to
// 			// apply `.toObject` to each one
// 			return foundComments.map((comment) => comment.toObject())
// 		})
// 		// respond with status 200 and JSON of the examples
// 		.then((comments) => res.status(200).json({ comments: comments }))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })
router.get('/comments/:videoId/:commentId', requireToken, (req, res, next) => {
	Video.findById(req.params.videoId)
		.then(video =>{
			return video.comments.id(req.params.commentId)
		})
		.then (comment => res.status(200).json(comment.toJSON()))
		.catch(next)
})

// router.get('/comments/:videoId', requireToken, (req, res, next) => {
// 	Video.findById(req.params.videoId)
// 		.then(video =>{
// 			return video.comments
// 		})
// 		.then (comments => res.status(200).json(comments.toJSON()))
// 		.catch(next)
// })
// // SHOW
// // GET /examples/5a7db6c74d55bc51bdf39793
// router.get('/comments/:id', (req, res, next) => {
// 	// req.params.id will be set based on the `:id` in the route
// 	Comment.findById(req.params.id)
// 		.then(handle404)
// 		// if `findById` is succesful, respond with 200 and "example" JSON
// 		.then((comment) => res.status(200).json({ Comment: comment.toObject() }))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })


//example post data
// {
//     "Comment":{
//         "commentText": "test post working",
//         "thumbnail": "jonathan" 
//     	}
// }

// ! 2021-12-14 We decided that we either need to change schemas or change what we are associating to comments...

// CREATE
// POST /examples

// Nested query 
router.post('/comments/:videoId', requireToken, (req, res, next) => {
	Video.findById(req.params.videoId)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then (video => {
			console.log("this is cur user in comment", req.user)
			req.body.comment.postedBy = req.user.id
			// .populate('Profile', 'username')
			req.body.comment.username = req.user.profile
			console.log("this is profile", req.user.profile)

			console.log(req.user.email)// this is where we are assinging the value of the object...could we assign it to another aspect of user..we could do email...
			// if attached to profile, it could be username...
			video.comments.push(req.body.comment)
			return video.save()
		})
		.then(video =>{
			res.status(201).json({video: video.toObject()})
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/comments/:videoId/:commentId', removeBlanks, requireToken, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	// delete req.body.example.owner

	Video.findById(req.params.videoId)
		.then(handle404)
		.then(video => {
			// req.body.comment.postedBy= req.user.id
			const comment = video.comments.id(req.params.commentId)
			const newComment = req.body.comment

			comment.commentText= newComment.commentText
			comment.thumbnail = newComment.thumbnail
			
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			// requireOwnership(req, example)
			// pass the result of Mongoose's `.update` to the next `.then`
			return video.save()
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})


// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/comments/:videoId/:commentId', (req,res,next)=>{
	Video.findById(req.params.videoId)
	.then(handle404)
		.then(video => {
			video.comments.pull(req.params.commentId)

			return video.save()
		})
		.then(() => res.sendStatus(204))
        .catch(next)
})

// router.delete('/comments/:id',  (req, res, next) => {
// 	Comment.findById(req.params.id)
// 		.then(handle404)
// 		.then((deleteComment) => {
// 			// throw an error if current user doesn't own `example`
// 			// requireOwnership(req, example)
// 			// delete the example ONLY IF the above didn't throw
// 			deleteComment.deleteOne()
// 		})
// 		// send back 204 and no content if the deletion succeeded
// 		.then(() => res.sendStatus(204))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

module.exports = router