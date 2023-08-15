module.exports = {
  host: "smtp.zoho.com",
  port: process.env.PORT_NODEMAILER,
  secure: true,
  auth: {
    user: process.env.USER_NODEMAILER,
    pass: process.env.PASS_NODEMAILER,
  },
};
