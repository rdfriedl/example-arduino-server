const express = require('express');
const switches = require('./switches');
const logs = require('./logs');

const router = new express.Router();

router.get('/logs', (req, res) => {
	res.json(logs.getLogFiles());
});

router.get('/logs/:id', (req, res) => {
	res.json(logs.getParsedLog(req.params.id));
});

router.get('/switches', (req, res) => {
	res.json(switches.getSwitches());
});

router.get('/switches/:id', (req, res) => {
	let switchData = switches.getSwitch(req.params.id);

	if(!switchData){
		res.status(404).end();
	}
	else{
		res.json(switchData);
	}
});

router.post('/status', (req, res) => {
	let switchId = req.body.id;

	if(switchId){
		switches.updateSwitch(switchId, req.body);

		res.status(200).end("received\n");
	}
	else {
		res.status(400).end("no id provided\n");
	}
});

module.exports = router;