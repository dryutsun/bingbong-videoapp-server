const express = require('express')
const passport = require('passport')
const following = require('../models/following')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')


const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router();

// GET route
router.get('/following', (req, res, next) => {
    Following.find()
    .then((following) => {
        console.log(following)

        return following.map((following) => following.toObject())
    })
    .then((following) => res.status(200).json({ following: following }))
    .catch(next)
})
// SHOW route
router.get('./following/ :id', (req, res, next) => {
    following.findById(req.params.id)
    .then(handle404)

    .then((following) => res.status(200).json({ Following: following.toObject() }))

    .catch(next)
})

router.post('./following', (req, res, next) => {
    Following.create(req.body.Following)
    
    .then((newFollowing) => {
        res.status(201).json({ Following: newFollowing.toObject() })
    })

    .catch(next)
})

router.patch('/following/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.following.owner

	Following.findById(req.params.id)
		.then(handle404)
		.then((follower) => {
			
			requireOwnership(req, newFollowing)

		
			return following.updateOne(req.body.following)
		})
	
		.then(() => res.sendStatus(204))
	
		.catch(next)
})
router.delete('/following/:id', requireToken, (req, res, next) => {
	Following.findById(req.params.id)
		.then(handle404)
		.then((following) => {

			requireOwnership(req, following)

			following.deleteOne()
		})
		
		.then(() => res.sendStatus(204))
		
        .catch(next)
})

module.exports = router