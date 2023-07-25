const { hashPassword, comparePassword } = require("../utils/hashAndCompare");
const { registerQuery, userCountQuery, loginQuery, getSingleUserQuery, updateUserQuery, deleteUserQuery, showUsers } = require("../models/userModel");
const { createAccessToken } = require("../utils/jwt");
const { validationInput } = require("../utils/validationInput");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, NotFoundError, BadRequestError } = require("../error");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  const { password } = req.body;
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
  await registerQuery(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "sukses terdaftar" });
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
    id,
  };
  let result = await updateUserQuery(data);
  console.log(result);
  res.status(StatusCodes.OK).json({ msg: "berhasil terupdate" });
};

const deleteUser = async (req, res) => {
  const { id } = req.user;
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

module.exports = { register, login, cekDuplikatPost, getSingleUser, updateUser, deleteUser, showAllUsers };
