const express = require("express");
const switches = require("./switches.js");

const router = new express.Router();

router.get("/switches", (req, res) => {
	res.json(switches.getSwitches());
});

router.get("/switches/:id", (req, res) => {
	let switchData = switches.getSwitch(req.params.id);

	if(!switchData){
		res.status(404).end();
	}
	else{
		res.json(switchData);
	}
});

router.post("/status", (req, res) => {
	let switchId = req.body.id;

	if(switchId){
		let didUpdate = switches.updateSwitch(switchId, req.body);

		if(didUpdate){
			// import server file here to avoid circular dependencies
			let server = require("./server.js");

			server.sendSwitchesToClients();
		}

		// and the response and send a message back
		res.status(200).end("received\n");
	}
	else {
		res.status(400).end("no id provided\n");
	}
});

module.exports = router;