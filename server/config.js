const chalk = require('chalk')

if (!process.env.TMDB_API_KEY) {
	console.log(chalk.red('FATAL ERROR: missing env variable TMDB_API_KEY'))
	process.exit(1)
}

module.exports = {
	app: {
		port: 4000,
	},
	tmdb: {
		apiKey: process.env.TMDB_API_KEY,
		apiVersion: 3,
		baseUrl: 'https://api.themoviedb.org',
	}
}
