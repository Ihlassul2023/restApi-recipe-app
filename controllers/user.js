const { hashPassword, comparePassword } = require("../utils/hashAndCompare");
const { registerQuery, userCountQuery, loginQuery, getSingleUserQuery, getSingleUserToVerifyQuery, updateUserQuery, deleteUserQuery, showUsers } = require("../models/userModel");
const { getMyRecipeQuery } = require("../models/recipeModel");
const { createAccessToken } = require("../utils/jwt");
const { validationInput } = require("../utils/validationInput");
const sendVerificationEmail = require("../utils/sendVerficationEmail");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, NotFoundError, BadRequestError } = require("../error");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

const register = async (req, res) => {
  const { password, name, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationInput({ errors });
  }
  let countDB = await userCountQuery();
  if (countDB.rows[0].count < 1) {
    req.body.role = "admin";
  } else {
    req.body.role = "user";
  }
  let hashPass = await hashPassword(password);
  req.body.password = hashPass;
  req.body.isVerified = false;
  await registerQuery(req.body);
  await sendVerificationEmail({ name, email });
  res.status(StatusCodes.CREATED).json({ msg: "sukses terdaftar" });
};
const verifyEmail = async (req, res) => {
  const { email } = req.query;
  const user = await getSingleUserToVerifyQuery(email);
  console.log(user);
  const data = {
    name: user.rows[0].name,
    email: user.rows[0].email,
    phone: user.rows[0].phone,
    password: user.rows[0].password,
    isVerified: true,
    id: user.rows[0].id,
  };
  let result = await updateUserQuery(data);
  console.log(result);
  res.status(StatusCodes.OK).json({ msg: "berhasil terupdate" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationInput({ errors });
  }
  let result = await loginQuery({ email });
  if (result.rows.length > 0) {
    const user = result.rows[0];
    const isMatch = await comparePassword({ passReq: password, passData: user.password, res });
    if (isMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        role: user.role,
      };
      const token = createAccessToken({ payload });
      return res.status(StatusCodes.OK).json({ msg: "Login Sukes!", token });
    } else {
      throw new UnauthenticatedError("password salah!");
    }
  } else {
    throw new NotFoundError("pengguna tidak ditemukan atau email salah!");
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.user;
  const user = await getSingleUserQuery(id);
  if (!user.rows[0]) {
    throw new BadRequestError("user tidak ditemukan");
  }
  res.status(StatusCodes.OK).json({ user: user.rows[0] });
};

const updateUser = async (req, res) => {
  let { name, email, phone, password } = req.body;
  const { id } = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationInput({ errors });
  }
  if (password) {
    let hashPass = await hashPassword(password);
    req.body.password = hashPass;
  }
  const user = await getSingleUserQuery(id);
  const data = {
    name: name || user.rows[0].name,
    email: email || user.rows[0].email,
    phone: phone || user.rows[0].phone,
    password: req.body.password || user.rows[0].password,
    isVerified: user.rows[0].isVerified,
    id,
  };
  let result = await updateUserQuery(data);
  console.log(result);
  res.status(StatusCodes.OK).json({ msg: "berhasil terupdate" });
};

const deleteUser = async (req, res) => {
  const { id } = req.user;
  const data = { search: "", searchBy: "title", offset: (1 - 1) * 5, limit: 5, id: parseInt(id), sort: "ASC" };
  const myRecipe = await getMyRecipeQuery(data);
  const { rows } = myRecipe;
  rows.map(async (row) => {
    await cloudinary.uploader.destroy(row.public_id);
  });
  await deleteUserQuery(parseInt(id));
  res.status(StatusCodes.OK).json({ msg: "user terhapus" });
};

const cekDuplikatPost = async (value) => {
  let result = await showUsers();
  return result.rows.find((val) => val.email == value);
};

const showAllUsers = async (req, res) => {
  let { role } = req.user;
  if (role != "admin") {
    throw new UnauthenticatedError("akses dibatasi!");
  }
  let users = await showUsers();
  if (!users.rows[0]) {
    throw new NotFoundError("user tidak ada");
  }
  res.status(StatusCodes.OK).json({ data: users.rows });
};

module.exports = { verifyEmail, register, login, cekDuplikatPost, getSingleUser, updateUser, deleteUser, showAllUsers };
