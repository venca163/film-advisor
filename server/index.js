const chalk = require('chalk')
const express = require('express')
const path = require('path')

const port = 4000


const init = () => {
	console.log('initing server...')
	const app = express()
	
	app.use('/client/src', express.static(__dirname + '/../client/src'));

	app.get('/client', (req, res) => {
		res.sendFile(path.join(__dirname + '/../client/index.html'))
	})

	app.get('/api/get-movies', function(req, res) {
		const films = [
			{name: 'HP1', genres: 'horror', score: 5}, 
			{name: 'HP2', genres: 'horror', score: 5}, 
			{name: 'HP3', genres: 'drama', score: 5}, 
			{name: 'HP4', genres: 'drama', score: 4},
			{name: 'HP1', genres: 'scifi', score: 5}, 
			{name: 'HP2', genres: 'scifi', score: 5}, 
			{name: 'HP3', genres: 'horror', score: 5}, 
			{name: 'HP4', genres: 'horror', score: 4},
			{name: 'HP1', genres: 'drama', score: 5}, 
			{name: 'HP2', genres: 'scifi', score: 5}, 
			{name: 'HP3', genres: 'scifi', score: 5}, 
			{name: 'HP4', genres: 'horror', score: 4},
		]
		res.end(JSON.stringify(films))
	})

	app.listen(port, () => {
		console.log(chalk.cyan(`Server listening on port ${port}`))
	})
}

module.exports = {
	init,
}
