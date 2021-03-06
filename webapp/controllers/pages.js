var ethAdapter = require('../eth/adapter');

exports.home = function (req, res) {
	res.render('pages/home', {
		title: 'Home'
	})
}

exports.deploy = function (req, res) {
	res.render('pages/deploy', {
		title: 'Deploy Contract',
		bank: ethAdapter.accounts[1],
		borrower: ethAdapter.accounts[2],
		depository:	ethAdapter.accounts[3],
		registry: ethAdapter.accounts[4],
	})
}

exports.execution = function (req, res) {
	res.render('pages/execution', {
		title: 'Execution Status',
		address: req.params.address
	})
}

exports.finalization = function (req, res) {
	res.render('pages/finalization', {
		title: 'Finalization Status',
		address: req.params.address
	})
}

exports.end = function (req, res) {
	res.render('pages/end', {
		title: 'Completed',
		address: req.params.address
	})
}