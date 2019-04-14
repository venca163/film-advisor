const _ = require('lodash')
const rq = require('request-promise')

class TmdbService {
	constructor (config) {
		this.apiKey = config.tmdb.apiKey
		this.apiVersion = config.tmdb.apiVersion
		this.baseUrl = config.tmdb.baseUrl
	}

	_getApiUrl (queryString, attributes) {
		let url = `${this.baseUrl}/${this.apiVersion}/${queryString}?api_key=${this.apiKey}`
		_.each(attributes, (val, key) => {
			url += `&${key}=${encodeURIComponent(val)}`
		})
		return url
	}

	async getGenres () {
		const res = await rq({
			uri: this._getApiUrl('genre/movie/list'),
			json: true,
		})
		return res
	}

	async searchMulti (filmTitle, tryNum) {
		const attributes = {
			language: 'cs-CZ',
			query: filmTitle,
		}
		const rqOptions = {
			uri: this._getApiUrl('search/multi', attributes),
			json: true,
		}

		let apiRes
		try {
			apiRes = await rq(rqOptions)
		} catch (err) {
			// Rate limit detected
			// NOTE: rate limit: 40 requests per 10s window (lame)
			if (err.statusCode === 429) {
				tryNum = tryNum || 0
				if (tryNum < 3) {
					return new Promise(resolve => setTimeout(async () => {
						const resp = await this.searchMulti(filmTitle, ++tryNum)
						resolve(resp)
					}, 10 * 1000))
				}
			}

			// Other errors
			console.log('error: tmdb service: error getting data', filmTitle)
			console.log(filmTitle)
			console.log(err)
			return {}
		}

		// Check valid non-empty response
		if (_.isEmpty(apiRes.results)) {
			return {}
		}

		return apiRes.results[0]
	}

	async searchByGenre (genres, operator = 'or') {
		const attributes = {
			with_genres: operator ? genres.join('|') : genres.join(','),
		}
		const rqOptions = {
			uri: this._getApiUrl('discover/movie', attributes),
			json: true,
		}

		let apiRes
		try {
			apiRes = await rq(rqOptions)
		} catch (err) {
			console.log('error: tmdb service: search by genre', genres)
			console.log(err)
			return []
		}

		// Check valid non-empty response
		if (_.isEmpty(apiRes.results)) {
			return {}
		}

		return apiRes.results
	}
}

module.exports = (config) => {
	return new TmdbService(config)
}
