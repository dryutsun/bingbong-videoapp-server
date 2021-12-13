const express = require('express')
const passport = require('passport')
const follower = require('../models/follower')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

//middleware
const removeBlanks = require('../../lib/remove_blank_fields')


const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router();

// GET route
router.get('/follower', (req, res, next) => {
    Follower.find()
    .then((follower) => {
        console.log(follower)

        return follower.map((follower) => follower.toObject())
    })
    .then((follower) => res.status(200).json({ follower: follower }))
    .catch(next)
})
// SHOW route
router.get('./follower/ :id', (req, res, next) => {
    follower.findById(req.params.id)
    .then(handle404)

    .then((follower) => res.status(200).json({ Follower: follower.toObject() }))

    .catch(next)
})

router.post('./follower', (req, res, next) => {
    Follower.create(req.body.Follower)
    
    .then((newFollower) => {
        res.status(201).json({ Follower: newFollower.toObject() })
    })

    .catch(next)
})

router.patch('/follower/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.follower.owner

	Follower.findById(req.params.id)
		.then(handle404)
		.then((follower) => {
			
			requireOwnership(req, follower)

		
			return follower.updateOne(req.body.follower)
		})
	
		.then(() => res.sendStatus(204))
	
		.catch(next)
})
router.delete('/follower/:id', requireToken, (req, res, next) => {
	Follower.findById(req.params.id)
		.then(handle404)
		.then((follower) => {

			requireOwnership(req, follower)

			follower.deleteOne()
		})
		
		.then(() => res.sendStatus(204))
		
        .catch(next)
})

module.exports = router


