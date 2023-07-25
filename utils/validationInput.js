const { BadRequestError, ConflictError } = require("../error");
const validationInput = ({ errors }) => {
  let ident = errors.array().filter((err) => err.msg === "email sudah terdaftar!");
  if (ident.length == 0) {
    throw new BadRequestError(
      errors
        .array()
        .map((err) => err.msg)
        .join("")
    );
  } else {
    throw new ConflictError(
      errors
        .array()
        .map((err) => err.msg)
        .join("")
    );
  }
};
module.exports = { validationInput };
