const _ = require('lodash')
const rq = require('request-promise')
const URL = require('url').URL

class RapidApi {
	constructor (config) {
		this.apiKey = config.movieApi.rapid.apiKey
		this.baseUrl = config.movieApi.rapid.baseUrl
	}

	async _request (searchStr, qs = {}) {
		const allQs = _.merge({
			page: 1,
			r: 'json',
			s: searchStr,
		}, qs)

		const uri = new URL(this.baseUrl)
		_.each(allQs, (val, key) => {
			uri.searchParams.set(key, val)
		})

		const options = {
			uri: uri,
			headers: {
				'X-RapidAPI-Host': 'movie-database-imdb-alternative.p.rapidapi.com',
				'X-RapidAPI-Key': this.apiKey,
			},
			json: true,
		}

		let apiRes
		try {
			apiRes = await await rq(options)
		} catch (err) {
			// All errors
			console.log('error: rapid api: error getting data', searchStr)
			console.log(filmTitle)
			console.log(err)
			return {}
		}

		return apiRes
	}

	async searchMovie (movieTitle, qs) {
		return await this._request(movieTitle)
	}
}

module.exports = (config) => {
	return new RapidApi(config)
}
