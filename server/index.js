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
	
	app.listen(port, () => {
		console.log(chalk.cyan(`Server listening on port ${port}`))
	})
}

module.exports = {
	init,
}
