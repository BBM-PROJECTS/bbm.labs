const db = require("../models/index.js");
const { validationResult } = require("express-validator");
const { responseSerializer } = require("../helpers/index.js");

const NewsletterController = {
	async subscribe(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json(
					responseSerializer.format(
						false,
						"Validation unsuccessful. Please check your input and try again.",
						null,
						errors.array(),
					),
				);
		}

		const { email, platform } = req.body;

		try {
			const [subscriber, created] = await db.Subscriber.findOrCreate({
				where: { email },
				defaults: { platform },
			});

			if (!created) {
				return res
					.status(409)
					.json(responseSerializer.format(false, "Email already subscribed to the newsletter."));
			}

			return res
				.status(201)
				.json(
					responseSerializer.format(
						true,
						"Subscription successful! You've been added to our newsletter.",
					),
				);
		} catch (error) {
			console.error("Error in subscribe:", error);
			return res
				.status(500)
				.json(
					responseSerializer.format(
						false,
						"Subscription unsuccessful. Please try again or contact support for assistance.",
						null,
						[{ msg: error.message }],
					),
				);
		}
	},
};

module.exports = NewsletterController;
