const responseSerializer = {
	format(isSuccessful, message = "", data = null, errors = []) {
		const response = {
			isSuccessful,
			message,
			data,
		};

		// Add errors field only if errors array is not empty
		if (errors.length > 0) {
			response.errors = errors;
		}

		return response;
	},
};

module.exports = responseSerializer;
