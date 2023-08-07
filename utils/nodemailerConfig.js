module.exports = {
  host: process.env.HOST_NODEMAILER,
  port: process.env.PORT_NODEMAILER,
  auth: {
    user: process.env.USER_NODEMAILER,
    pass: process.env.PASS_NODEMAILER,
  },
};
