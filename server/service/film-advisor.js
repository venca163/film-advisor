const _ = require('lodash')
const async = require('promise-async')

const CsfdService = require('../movie-api/csfd-api')
const TmdbService = require('../movie-api/tmdb-api')

class FilmAdvisor {
	constructor (config) {
		this.CsfdService = CsfdService()
		this.TmdbService = TmdbService(config)
	}

	async _getMovieDetails (userRatings) {
		const movieDetails = []
		let movieDetailError = 0

		await async.eachOfLimit(userRatings, 10, async (movie, id, next) => {
			if (id % 10 === 0) {
				console.log(`in progress: ${Math.ceil((id * 100) / userRatings.length)}%`)
			}

			const movieDetail = await this.TmdbService.searchMulti(movie.name)
			if (_.isEmpty(movieDetail)) {
				movieDetailError++
			}

			movieDetails[id] = movieDetail
			next()
		})
		console.log('total miss (not found):', movieDetailError)

		return movieDetails
	}

	_getGenreDistribution (movieDetails) {
		let genres = {}

		_.each(movieDetails, movie => {
			_.each(movie.genre_ids, genreId => {
				genres[genreId] = genres[genreId] || {
					genreId,
					sum: 0
				}
				genres[genreId].sum++
			})
		})
		genres = _.orderBy(genres, ['sum'], ['desc'])

		return genres
	}

	async _getBestByGenre (genreDistribution) {
		const top3genres = _(genreDistribution)
			.map(genre => genre.genreId)
			.take(3)
			.value()

		const topByGenre = await this.TmdbService.searchByGenre(top3genres)
		return topByGenre
	}

	_transformResults (bestByGenres) {
		return _(bestByGenres)
			.map((movie) => {
				return {
					name: movie.title,
					genres: movie.genre_ids,
					score: movie.vote_average,
				}
			})
			.take(10)
			.value()

	}

	async getMovies (userId, options) {
		let userRatings = await this.CsfdService.getUserRatings(userId)
		if (_.isEmpty(userRatings)) {
			return []
		}
		// TODO remove limit for faster development
		userRatings = userRatings.slice(0, 39)

		const movieDetails = await this._getMovieDetails(userRatings)
		if (_.isEmpty(movieDetails)) {
			return []
		}

		const genreDistribution = this._getGenreDistribution(movieDetails)

		const bestByGenres = await this._getBestByGenre(genreDistribution)

		const out = this._transformResults(bestByGenres)
		return out
	}
}


module.exports = (config) => {
	return new FilmAdvisor(config)
}
