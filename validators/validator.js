const { check, body } = require("express-validator");

const authValidationRules = {
	tokenManager: [
		check("emailOrUsername")
			.notEmpty()
			.withMessage(
				"Email or username is required. Please enter a valid email or username to proceed.",
			),
		check("password")
			.notEmpty()
			.withMessage("Password is required. Please enter a valid password to proceed."),
	],
	register: [
		check("email")
			.isEmail()
			.withMessage(
				"Valid email address required. Please enter a proper email format, like example@email.com.",
			),
		check("userName")
			.notEmpty()
			.withMessage("Username is required. Please enter a unique username to proceed."),
		check("password")
			.isLength({ min: 8 })
			.withMessage(
				"Password must be 8+ characters long. Please choose a stronger password for better security.",
			),
		check("firstName")
			.notEmpty()
			.withMessage("First name is required. Please enter your first name to proceed."),
		check("lastName")
			.notEmpty()
			.withMessage("Last name is required. Please enter your last name to proceed."),
		check("location").notEmpty().withMessage("Location is required"),
		check("ipAddress").isIP().withMessage("Valid IP address is required"),
	],
	forgotPassword: [
		check("emailOrUsername")
			.notEmpty()
			.withMessage(
				"Email or username is required. Please enter a valid email or username to proceed.",
			),
	],
	resetPassword: [
		check("token").not().isEmpty().withMessage("Reset token is required"),
		check("newPassword")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters long"),
	],
};

const newsletterValidationRules = {
	newsletter: [
		check("email")
			.isEmail()
			.withMessage(
				"Valid email address required. Please enter a proper email format, like example@email.com.",
			),
		check("platform").isIn(["BBM", "BBM Ace", "BBM Capitalis"]).withMessage("Invalid platform."),
	],
};

const contactValidationRules = {
	contactUs: [
		check("fullname").notEmpty().withMessage("Full name is required."),
		check("email").isEmail().withMessage("A valid email is required."),
		check("phone_number").notEmpty().withMessage("Phone number is required."),
		check("subject").notEmpty().withMessage("Subject is required."),
		check("message").notEmpty().withMessage("Message body is required."),
		check("platform").isIn(["BBM", "BBM Ace", "BBM Capitalis"]).withMessage("Invalid platform."),
	],
};

const accountSizeValidationRules = {
	create: [
		body("size").isInt({ gt: 0 }).withMessage("Size must be a positive integer"),
		body("fee").isInt({ gt: 0 }).withMessage("Fee must be a positive integer"),
	],
	update: [
		body("size").optional().isInt({ gt: 0 }).withMessage("Size must be a positive integer"),
		body("fee").optional().isInt({ gt: 0 }).withMessage("Fee must be a positive integer"),
	],
};

const propFirmValidationRules = {
	create: [
		body("name").isString().notEmpty().withMessage("Name is required"),
		body("account_sizes").isObject().withMessage("Account sizes must be an object"),
	],
	update: [
		body("name").optional().isString().notEmpty().withMessage("Name is required"),
		body("account_sizes").optional().isObject().withMessage("Account sizes must be an object"),
	],
};

const challengeValidationRules = {
	createChallenge: [
		check("user_id").notEmpty().withMessage("User ID is required."),
		check("account_size_id").notEmpty().withMessage("Account size ID is required."),
	],
	updateChallenge: [
		check("status").isIn(["pending", "pass", "fail"]).withMessage("Invalid status."),
	],
	createChallengePayment: [
		check("user_id").notEmpty().withMessage("User ID is required."),
		check("challenge_id").notEmpty().withMessage("Challenge ID is required."),
		check("amount").isInt({ min: 0 }).withMessage("Amount must be a positive integer."),
		check("paid_at").isISO8601().withMessage("Invalid date format for paid_at."),
	],
};

const paymentDetailsValidationRules = {
	paymentDetails: [
		body("amount").isInt({ min: 0 }).withMessage("Amount must be a positive integer."),
		body("accountsizeID").notEmpty().withMessage("Account size ID is required."),
		body("userID").notEmpty().withMessage("User ID is required."),
		body("currency").isString().notEmpty().withMessage("Currency is required."),
	],
};

module.exports = {
	authValidationRules,
	contactValidationRules,
	propFirmValidationRules,
	challengeValidationRules,
	newsletterValidationRules,
	accountSizeValidationRules,
	paymentDetailsValidationRules,
};
