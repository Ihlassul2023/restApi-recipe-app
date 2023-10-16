module.exports = {
  host: process.env.HOST_NODEMAILER,
  port: process.env.PORT_NODEMAILER,
  secure: true,
  auth: {
    user: process.env.USER_NODEMAILER,
    pass: process.env.PASS_NODEMAILER,
  },
};
