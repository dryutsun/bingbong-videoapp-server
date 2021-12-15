const requestLogger = function (req, res, next) {
	console.log('\n===== Incoming Request =====\n')
	console.log(`${new Date()}`)
	// console.log(`${req.method} ${req.url}`)
	console.log('\x1b[33m%s\x1b[0m', req.method +": " + req.url)
	console.log(`body ${JSON.stringify(req.body)}`)
	console.log('\n========= RESPONSE =========\n')
	console.log(`${new Date()}`)
	console.log(`Headers Sent? ${res.headersSent}`)
	console.log('\n=============================\n')
	next()
}

module.exports = requestLogger
