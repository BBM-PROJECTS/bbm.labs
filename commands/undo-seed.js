const { exec } = require("child_process");

exec("npx sequelize-cli db:seed:undo:all", (error, stdout, stderr) => {
	if (error) {
		console.error(`Error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`stderr: ${stderr}`);
		return;
	}
	console.log(`stdout: ${stdout}`);
});
