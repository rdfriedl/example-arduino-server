vueMoment.install(Vue);

const socket = io.connect(location.protocol + "//" + location.host);

const app = new Vue({
	el: "#app",
	data: {
		switches: [],
		currentTime: new Date(),
		dashboard: false
	},
	methods: {
		toggleDashboard(){
			this.dashboard = !this.dashboard;
		},
		getCardStatusMessage(data){
			switch (data.state) {
				case "offline":
					return "Offline";
				case "inspection-needed":
					return "Inspection Needed";
				case "inspection-in-progress":
					return "Inspection In Progress";
				case "no-inspection-needed":
					return "No Inspection Needed";
			}
		},
		getCardStatus(data){
			switch (data.state) {
				case "offline":
					return "bg-secondary";
				case "inspection-needed":
					return "bg-danger";
				case "inspection-in-progress":
					return "bg-warning";
				case "no-inspection-needed":
					return "bg-success";
			}
		},
		getCardLastChangedMessage(data){
			switch (data.state) {
				case "offline":
					return "Lost Connection";
				case "inspection-needed":
					return "Time Requested";
				case "inspection-in-progress":
					return "Time Started";
				case "no-inspection-needed":
					return "Last Inspection";
			}
		}
	}
});

socket.on("switches", switches => {
	app.switches = switches;
});

setInterval(() => {
	app.currentTime = new Date();
}, 1000);

document.body.addEventListener("click", () => {
	if(app.dashboard){
		app.dashboard = false;
	}
});
