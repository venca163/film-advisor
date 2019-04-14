require('dotenv').config()

const chalk = require('chalk')
const express = require('express')
const path = require('path')

const config = require('./config')
const port = config.app.port

process.on('unhandledRejection', error => {
	console.log(chalk.red('ERROR: unhandledRejection'))
	console.log(error.message)
	console.log('exiting...')
	process.exit(1)
})

// Services ↓↓
const FilmAdvisor = require('./service/film-advisor')(config)

const init = () => {
	console.log('initing server...')
	const app = express()

	app.use('/client/src', express.static(__dirname + '/../client/src'));

	app.get('/client', (req, res) => {
		res.sendFile(path.join(__dirname + '/../client/index.html'))
	})

	app.get('/api/get-movies', async (req, res) => {
		if (!req.query.userId) {
			res.json({
				error: 'Validation Error: missing userId',
				statusCode: 400,
			})
		}

		const movies = await FilmAdvisor.getMovies(req.query.userId, {})
		res.json(movies)
	})

	app.listen(port, () => {
		console.log(chalk.cyan(`Server listening on port ${port}`))
	})
}

module.exports = {
	init,
}
