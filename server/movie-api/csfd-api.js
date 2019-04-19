const _ = require('lodash')
const csfd = require('csfd-api')

class CsfdService {
	constructor () {}

	async getUserRatings (userId) {
		let userRatings
		try {
			userRatings = await csfd.user.ratings(userId)
		} catch (err) {
			console.log('Cannot get user ratings')
			console.log(err)
			return []
		}

		if (_.isEmpty(userRatings.ratings)) {
			return []
		}

		return userRatings.ratings
	}
}

module.exports = () => {
	return new CsfdService()
}
