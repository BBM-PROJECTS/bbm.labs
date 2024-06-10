const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const path = require("path");
const db = require("../models/index.js");
const { camelCase, mapKeys } = require("../utils/index.js");
const { responseSerializer } = require("../helpers/index.js");
const { EmailService, ETEMPLATES } = require("../services/email.service.js");

// EMAIL SERVICE INSTANCES
const emailNotificationService = new EmailService(
	"notifications@bullbearmastery.com",
	"#1Hizlto",
	path.join(__dirname, "../templates"),
);

const AuthController = {
	async sendVerificationEmail(email, userName, verificationLink) {
		try {
			await emailNotificationService.sendEmail(
				email,
				ETEMPLATES.EMAIL_VERIFICATION,
				"Email Verification",
				{ username: userName, verificationLink },
			);
		} catch (error) {
			console.error("Error sending verification email:", error);
			throw new Error("Failed to send verification email");
		}
	},

	async sendResetPasswordEmail(email, username, resetToken) {
		const resetLink = `http://127.0.0.1:3010/reset-password?token=${resetToken}`;
		try {
			await emailNotificationService.sendEmail(
				email,
				ETEMPLATES.FORGOT_PASSWORD,
				"Password Reset",
				{ username, resetLink }, // Pass the correct variables
			);
		} catch (error) {
			console.error("Error sending password reset email:", error);
			throw new Error("Failed to send password reset email");
		}
	},

	async tokenManager(req, res) {
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

		const { emailOrUsername, password } = req.body;

		try {
			const user = await db.User.findOne({
				where: {
					[Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
				},
			});

			if (!user) {
				return res
					.status(404)
					.json(
						responseSerializer.format(
							false,
							"User not found. Please check the username or contact support for help.",
						),
					);
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res
					.status(401)
					.json(
						responseSerializer.format(
							false,
							"Incorrect password. Please try again or reset your password for assistance.",
						),
					);
			}

			// Check if user is active and email is verified
			if (!user.is_active) {
				return res
					.status(403)
					.json(
						responseSerializer.format(
							false,
							"User is not active. Please contact support for assistance.",
						),
					);
			}

			if (!user.email_verified_at) {
				return res
					.status(403)
					.json(
						responseSerializer.format(
							false,
							"Email not verified. Please verify your email before logging in.",
						),
					);
			}

			// Update last_login
			await user.update({ last_login: new Date() });

			const tokenPayload = { id: user.id, email: user.email };
			const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

      const { password: _, ...userResponse } = user.toJSON();
  
      const camelCasedUserResponse = mapKeys(userResponse, (value, key) => camelCase(key));

			return res.status(200).json(
				responseSerializer.format(true, "Success! You have successfully logged in. Welcome back!", {
					accessToken,
					user: camelCasedUserResponse,
				}),
			);
		} catch (error) {
			console.error("Error in tokenManager:", error);
			return res
				.status(500)
				.json(
					responseSerializer.format(
						false,
						"Internal error. Contact support or your admin for help.",
						null,
						[{ msg: error.message }],
					),
				);
		}
	},

	async register(req, res) {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json(
        responseSerializer.format(
          false,
          "Validation unsuccessful. Please check your input and try again.",
          null,
          errors.array(),
        ),
      );
    }
  
    const { email, userName, password, firstName, lastName, location, ipAddress } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await db.User.create({
        email,
        username: userName,
        password: hashedPassword,
        firstname: firstName,
        lastname: lastName,
        location,
        ip_address: ipAddress,
        is_active: true, // Assuming you want to activate the user immediately
        last_login: null, // Set last_login to null on register
        last_logout: null, // Set last_logout to null on register
        email_verified_at: null, // Set email_verified_at to null on register
        remember_token: null, // Set remember_token to null on register
      });
  
      const verificationLink = "http://127.0.0.1:3010?redirect_uri=dashboard";
      await AuthController.sendVerificationEmail(email, userName, verificationLink);
  
      const { password: _, deleted_at, ...userResponse } = user.toJSON();
  
      // Convert userResponse keys to camelCase using lodash
      const camelCasedUserResponse = mapKeys(userResponse, (value, key) => camelCase(key));
  
      return res.status(201).json(
        responseSerializer.format(
          true,
          "Registration successful! Welcome aboard! You can now log in and enjoy our services.",
          camelCasedUserResponse,
        ),
      );
    } catch (error) {
      console.error("Error in register:", error);
      return res.status(500).json(
        responseSerializer.format(
          false,
          "Registration unsuccessful. Please try again or contact support for assistance.",
          null,
          [{ msg: error.message }],
        ),
      );
    }
  },

	async forgotPassword(req, res) {
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

		const { emailOrUsername } = req.body;

		try {
			const user = await db.User.findOne({
				where: {
					[Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
				},
			});

			if (!user) {
				return res
					.status(404)
					.json(
						responseSerializer.format(
							false,
							"User not found. Please check the username or contact support for help.",
						),
					);
			}

			// Generate a reset token
			const resetToken = crypto.randomBytes(20).toString("hex");
			const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

			// Update user with reset token and expiration date
			await user.update({
				reset_token: resetToken,
				reset_token_expires: resetTokenExpires,
			});

			// Send the reset email
			await AuthController.sendResetPasswordEmail(user.email, user.username, resetToken);

			return res
				.status(200)
				.json(
					responseSerializer.format(
						true,
						"Password reset email sent. Check your inbox and follow the instructions to reset your password.",
					),
				);
		} catch (error) {
			console.error("Error in forgotPassword:", error);
			return res
				.status(500)
				.json(
					responseSerializer.format(
						false,
						"Internal error. Contact support or your admin for help.",
						null,
						[{ msg: error.message }],
					),
				);
		}
	},

	async resetPassword(req, res) {
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

		const { token, newPassword } = req.body;

		try {
			const user = await db.User.findOne({
				where: {
					reset_token: token,
					reset_token_expires: {
						[Op.gt]: new Date(), // Check if token is still valid
					},
				},
			});

			if (!user) {
				return res
					.status(400)
					.json(
						responseSerializer.format(
							false,
							"Invalid or expired reset token. Please request a new password reset.",
						),
					);
			}

			// Hash the new password
			const hashedPassword = await bcrypt.hash(newPassword, 10);

			// Update user's password and clear reset token and expiration date
			await user.update({
				password: hashedPassword,
				reset_token: null,
				reset_token_expires: null,
			});

			return res
				.status(200)
				.json(
					responseSerializer.format(
						true,
						"Password has been reset successfully. You can now log in with your new password.",
					),
				);
		} catch (error) {
			console.error("Error in resetPassword:", error);
			return res
				.status(500)
				.json(
					responseSerializer.format(
						false,
						"Internal error. Contact support or your admin for help.",
						null,
						[{ msg: error.message }],
					),
				);
		}
	},

  async terminateSession(req, res) {
		const { userId } = req.body;

		try {
			const user = await db.User.findByPk(userId);

			if (!user) {
				return res.status(404).json(
					responseSerializer.format(
						false,
						"User not found. Please check the user ID or contact support for help.",
					)
				);
			}

			await user.update({ last_logout: new Date() });

			return res.status(200).json(
				responseSerializer.format(
					true,
					"Session terminated successfully. You have been logged out.",
				)
			);
		} catch (error) {
			console.error("Error in terminateSession:", error);
			return res.status(500).json(
				responseSerializer.format(
					false,
					"Internal error. Contact support or your admin for help.",
					null,
					[{ msg: error.message }],
				)
			);
		}
	},
};

module.exports = AuthController;
