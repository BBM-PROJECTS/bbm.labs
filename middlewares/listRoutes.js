const listEndpoints = require("express-list-endpoints");

const listRoutes = (app) => {
	const endpoints = listEndpoints(app);
	console.log("REGISTERED ROUTES:");
	endpoints.forEach((endpoint) => {
		endpoint.methods.forEach((method) => {
			console.log(`${method} ${endpoint.path}`);
		});
	});
};

module.exports = listRoutes;
