const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, uuid, email }) => {
  const verifyEmail = `https://recipe-app-client-omega.vercel.app/verification?id=${uuid}`;

  const message = `<p>Untuk verifikasi email : 
  <a href="${verifyEmail}">Klik disini</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Verifikasi Email",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
