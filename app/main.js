vueMoment.install(Vue);

const socket = io.connect(location.protocol + '//' + location.host);

const app = new Vue({
	el: '#app',
	data: {
		arduinos: [],
		showRaw: {}
	},
	methods: {
		getCardStatusMessage(data){
			if(data.inspectionNeeded){
				return "Inspection Needed";
			}
			else if(data.inspectionInProgress){
				return "Inspection In Progress";
			}
			else {
				return "No Inspection Needed";
			}
		},
		getCardStatus(data){
			if(data.inspectionNeeded){
				return "bg-danger";
			}
			else if(data.inspectionInProgress){
				return "bg-warning";
			}
			else {
				return "bg-success";
			}
		},
		getCardLastChangedMessage(data){
			if(data.inspectionNeeded){
				return "Time Requested";
			}
			else if(data.inspectionInProgress){
				return "Time Started";
			}
			else {
				return "Last Inspection";
			}
		}
	}
});

socket.on('arduinos', arduinos => {
	app.arduinos = arduinos;
});
