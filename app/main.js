vueMoment.install(Vue);

const socket = io.connect(location.protocol + "//" + location.host);

const app = new Vue({
	el: "#app",
	data: {
		switches: [],
		historyEntries: [],
		historyModalOpen: false,
		historyDate: moment().format("YYYY-MM-DD"),
		historySelectedSwitch: null,
		currentTime: new Date(),
		dashboard: false
	},
	watch: {
		historyModalOpen(open) {
			$("#historyModal").modal(open ? "show" : "hide");
		}
	},
	methods: {
		openSwitchHistory(switchId){
			this.historyEntries = [];
			this.historySelectedSwitch = switchId;
			this.historyModalOpen = true;
			this.getSwitchHistory();
		},
		toggleDashboard(){
			this.dashboard = !this.dashboard;
		},
		getCardStatusMessage(data){
			switch (data.state) {
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
				case "inspection-needed":
					return "Time Requested";
				case "inspection-in-progress":
					return "Time Started";
				case "no-inspection-needed":
					return "Last Inspection";
			}
		},
		getSwitchHistory(){

		}
	}
});

$('#historyModal').on('hidden.bs.modal', (e) => {
	app.historyModalOpen = false;
})

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
