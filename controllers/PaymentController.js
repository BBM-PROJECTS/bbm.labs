const db = require("../models/index.js");
const { EmailService, ETEMPLATES } = require("../services/email.service.js");
const { validationResult } = require('express-validator');
const path = require("path");
const { responseSerializer } = require("../helpers/index.js");
const LookupController = require("../controllers/LookupController.js");

// EMAIL SERVICE INSTANCES
const emailNotificationService = new EmailService(
	"notifications@bullbearmastery.com",
	"#1Hizlto",
	path.join(__dirname, "../templates"),
);

const getTRC20TokenAddress = (userID, accountsizeID, amount, currency) => {
    // Implement logic to get TRC20 token address based on input parameters
    // Return the TRC20 token address
};

const cancelPayment = async (userID, challengeID) => {
    try {
        const challengePayment = await db.ChallengePayment.findOne({ where: { user_id: userID, challenge_id: challengeID } });
        if (challengePayment) {
            challengePayment.status = 'canceled';
            await challengePayment.save();
            return responseSerializer.format(true, "Payment canceled", null);
        } else {
            return responseSerializer.format(false, "Error: Unable to cancel payment", null);
        }
    } catch (error) {
        console.error("Error cancelling payment:", error);
        return responseSerializer.format(false, "Error cancelling payment", null);
    }
};

const deletePayment = async (userID, challengeID) => {
    try {
        const challengePayment = await db.ChallengePayment.findOne({ where: { user_id: userID, challenge_id: challengeID } });
        if (challengePayment) {
            challengePayment.status = 'deleted';
            challengePayment.deleted_at = new Date();
            await challengePayment.save();
            return responseSerializer.format(true, "Payment deleted", null);
        } else {
            return responseSerializer.format(false, "Error: Unable to delete payment", null);
        }
    } catch (error) {
        console.error("Error deleting payment:", error);
        return responseSerializer.format(false, "Error deleting payment", null);
    }
};

const sendPaymentFailedEmail = (email, userName) => {
    setTimeout(() => {
        emailNotificationService.sendEmail(
            email,
            ETEMPLATES.PAYMENT_FAILED,
            "Payment Failed",
            { username: userName }
        );
    }, 30 * 60 * 1000);
};

const canceledPaymentNotification = (email, userName) => {
    emailNotificationService.sendEmail(
        email,
        ETEMPLATES.PAYMENT_CANCELED,
        "Payment Canceled",
        { username: userName }
    );
};

const PaymentController = {
    getTokenAddress: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(responseSerializer.format(false, "Validation error", null, errors.array()));
        }
        const { amount, accountsizeID, userID, currency = 'usdt' } = req.body;
    
        const trc20TokenAddress = getTRC20TokenAddress(userID, accountsizeID, amount, currency);

        if (!trc20TokenAddress) {
            // Get a random TRC20 address from the database model wallet addresses
            db.WalletAddress.findOne({ order: db.sequelize.random() }).then(walletAddress => {
                if (walletAddress) {
                  const { deletedAt, createdAt, updatedAt, ...trc20TokenAddress } = walletAddress.toJSON();

                    const paymentDetails = {
                        amount,
                        accountsizeID,
                        userID,
                        currency,
                        trc20TokenAddress: trc20TokenAddress // Return all details about the selected TRC20 address
                    };
                    

                    res.status(200).json(responseSerializer.format(true, "Payment details retrieved successfully", paymentDetails));
                } else {
                    res.status(500).send('Unable to retrieve payment details');
                }
            }).catch(error => {
                console.error("Error retrieving random TRC20 address:", error);
                res.status(500).send('Unable  to retrieve payment details');
            });
        } else {
            const paymentDetails = {
                amount,
                accountsizeID,
                userID,
                currency,
                trc20TokenAddress
            };

            res.status(200).json(responseSerializer.format(true, "Payment details retrieved successfully", paymentDetails));
        }
    },
  
    checkPaymentStatus: async (req, res) => {
        const { address, amount, userID, challengeID } = req.body;
        const paymentConfirmed = await LookupController.checkPaymentAmountExists({ address, amount, userID, challengeID });
        if (paymentConfirmed) {
            res.status(200).json(responseSerializer.format(true, "Payment confirmed", null));
        } else {
            const challengePayment = await db.ChallengePayment.findOne({ where: { userID, challengeID }});
            if (challengePayment && challengePayment.amount === amount) {
                // Update the challenge payment
                challengePayment.amount = newAmount;
                challengePayment.totalAmountPaid += amount;
                await challengePayment.save();
                res.status(200).json(responseSerializer.format(true, "Challenge payment updated", null));
            } else {
                res.status(400).json(responseSerializer.format(false, "Error: Payment not confirmed", null));
            }
        }
    },
  
    cancelPayment: (req, res) => {
      const { userID, challengeID } = req.body;
      cancelPayment(userID, challengeID)
        .then((result) => {
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(400).json(result);
          }
        })
        .catch((error) => {
          console.error("Error cancelling payment:", error);
          res.status(500).json(responseSerializer.format(false, "Error cancelling payment", null));
        });
    },

    deletePayment: (req, res) => {
      const { userID, challengeID } = req.body;
      deletePayment(userID, challengeID)
        .then((result) => {
          if (result) {
            res.status(200).json(result);
          } else {
            res.status(400).json(result);
          }
        })
        .catch((error) => {
          console.error("Error deleting payment:", error);
          res.status(500).json(responseSerializer.format(false, "Error deleting payment", null));
        });
    },


    paymentConfirmationEmail: (req, res) => {
      // Implement logic to send payment confirmation email
      //sends an email with the email service to inform the user of payment completion
      emailNotificationService.sendEmail(
        "notifications@bullbearmastery.com",
        ETEMPLATES.PAYMENT_CONFIRMATION,
        "Payment Confirmation",
        { username: userName, accountSize: accountSize, challenge: challenge, accountFee: accountFee, totalCost: totalCost, addressUsed: addressUsed, confirmationLink: confirmationLink }
      );
      res.send('Payment confirmation email sent');
    }
  };
  
  module.exports = PaymentController;