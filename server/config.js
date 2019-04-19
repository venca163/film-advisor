const chalk = require('chalk')

const mandatoryVars = ['TMDB_API_KEY', 'RAPID_API_KEY']
mandatoryVars.forEach((key) => {
	if (!process.env[key]) {
		console.log(chalk.red(`FATAL ERROR: missing env variable '${key}'`))
		console.log(chalk.red('exiting...'))
		process.exit(1)
	}
})

module.exports = {
	app: {
		port: 4000,
	},
	movieApi: {
		rapid: {
			apiKey: process.env.RAPID_API_KEY,
			baseUrl: 'https://movie-database-imdb-alternative.p.rapidapi.com',
		},
		tmdb: {
			apiKey: process.env.TMDB_API_KEY,
			apiVersion: 3,
			baseUrl: 'https://api.themoviedb.org',
		}
	}
}
