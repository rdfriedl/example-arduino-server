const socket = io.connect(location.protocol + '//' + location.host);

const app = new Vue({
	el: '#app',
	data: {
		arduinos: [],
		showRaw: {}
	},
	methods: {
		formatJson(data){
			return JSON.stringify(data, null, 2);
		},
		highlight(string){
			return Prism.highlight(string, Prism.languages.json);
		},
		toggleShowRaw(id){
			return this.$set(this.showRaw, id, !this.showRaw[id]);
		}
	}
});

socket.on('arduinos', arduinos => {
	app.arduinos = arduinos;
});
