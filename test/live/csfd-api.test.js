const csfd = require('csfd-api')

const vencaId = 304220

describe('csfd api basic user tests', () => {
	test('get user ratings', async () => {
		const user = await csfd.user.ratings(vencaId)

		expect(Array.isArray(user.ratings)).toBe(true)
		user.ratings.map((rating) => {
			expect(rating).toHaveProperty('name')
			expect(rating).toHaveProperty('rating')
		})
	})
})
