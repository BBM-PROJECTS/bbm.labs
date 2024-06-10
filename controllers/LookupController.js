const axios = require('axios');
const db = require("../models/index.js");
const countries = require('i18n-iso-countries');
const { responseSerializer } = require("../helpers/index.js");

// Load country data for all supported languages
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const LookupController = {
  async getUserEmailVerificationStatus(req, res) {
    const userId = req.params.userId;

    try {
      const user = await db.User.findByPk(userId);

      if (!user) {
        return res.status(404).json(responseSerializer.format(false, "User not found.", null));
      }

      const isEmailVerified = !!user.email_verified_at;

      return res.status(200).json(
        responseSerializer.format(true, "Email verification status retrieved successfully.", {
          isEmailVerified,
        }),
      );
    } catch (error) {
      console.error("Error in getUserEmailVerificationStatus:", error);
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

  async checkUsernameAvailability(req, res) {
    const username = req.query.username;

    try {
      const existingUser = await db.User.findOne({ where: { username } });

      const isUsernameAvailable = !existingUser;

      return res.status(200).json(
        responseSerializer.format(true, "Username availability checked successfully.", {
          isUsernameAvailable,
        }),
      );
    } catch (error) {
      console.error("Error in checkUsernameAvailability:", error);
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

  async getIpDetails(req, res) {
    const ipInfoToken = process.env.IP_INFO_TOKEN;

    try {
      // Use the IPinfo service to get the IP address of the request
      const ipResponse = await axios.get(`https://ipinfo.io?token=${ipInfoToken}`);
      const ip = ipResponse.data.ip;

      // Use the IPinfo service to get the details of the retrieved IP address
      const response = await axios.get(`https://ipinfo.io/${ip}?token=${ipInfoToken}`);
      const data = response.data;

      console.log(data);

      const countryFullName = countries.getName(data.country, "en");

      const ipDetails = {
        ipv4: data.ip,
        ipv6: data.ip,
        city: data.city,
        region: data.region,
        countryCode: data.country,
        country: countryFullName,
        loc: data.loc,
        org: data.org,
        postal: data.postal,
        timezone: data.timezone,
        latitude: parseFloat(data.loc.split(',')[0]),
        longitude: parseFloat(data.loc.split(',')[1]),
        asn: data.org.split(' ')[0],
        isp: data.org,
        services: data.anycast ? 'Anycast' : 'Unicast',
        assignment: 'Likely Static IP'
      };

      return res.status(200).json(
        responseSerializer.format(true, "IP details retrieved successfully.", ipDetails),
      );
    } catch (error) {
      console.error("Error in getIpDetails:", error);
      return res
        .status(500)
        .json(
          responseSerializer.format(
            false,
            "Failed to retrieve IP details. Please try again or contact support for assistance.",
            null,
            [{ msg: error.message }],
          ),
        );
    }
  },
};

module.exports = LookupController;
