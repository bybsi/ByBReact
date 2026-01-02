
const localDataStore = {
	save: (key, data) => {
		localStorage.setItem(key, JSON.stringify(data));
	},
	load: (key) => {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch ( err ) {
			console.log("Error loading local storage (" + key + ")... OK.");
		}
	}
};

export { localDataStore };
