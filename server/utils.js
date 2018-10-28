const moment = require('moment');

// utility method that returns the current date
function now(){
	return moment();
}

module.exports = {
	now
};
