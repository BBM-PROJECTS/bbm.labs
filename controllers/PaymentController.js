const db = require("../models/index.js");
const { EmailService, ETEMPLATES } = require("../services/email.service.js");
const { validationResult } = require('express-validator');
const path = require("path");

// EMAIL SERVICE INSTANCES
const emailNotificationService = new EmailService(
	"notifications@bullbearmastery.com",
	"#1Hizlto",
	path.join(__dirname, "../templates"),
);


const PaymentController = {
    getPaymentDetails: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { amount, accountsizeID, userID, currency = 'usdt' } = req.body;

        // Assuming we have a function to get the TRC20 token address
        const trc20TokenAddress = getTRC20TokenAddress(userID, accountsizeID, amount, currency);

        if (!trc20TokenAddress) {
            return res.status(500).send('Unable to retrieve payment details');
        }

        const paymentDetails = {
            amount,
            accountsizeID,
            userID,
            currency,
            trc20TokenAddress
        };

        res.status(200).json(paymentDetails);
    },
  
    checkPaymentStatus: (req, res) => {
      // Implement logic to check payment status
      res.send('Payment status checked');
    },
  
    cancelPayment: (req, res) => {
      // Implement logic to cancel payment
      res.send('Payment cancelled');
    },

    deletePayment: (req, res) => {
      // Implement logic to delete payment
      res.send('Payment deleted');
    },


    processPayment: (req, res) => {
      // Implement logic to process payment
      const { amount, currency } = req.body;
  
      if (currency === 'USD') {
        // Process USD payment
        res.send(`Payment processed successfully for ${amount} USD`);
      } else {
        res.status(400).send('Unsupported currency');
      }
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