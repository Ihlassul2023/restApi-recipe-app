const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, uuid, email }) => {
  const verifyEmail = `http://localhost:5173/verification?id=${uuid}`;

  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
