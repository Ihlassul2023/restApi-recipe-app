const { hashPassword, comparePassword } = require("../utils/hashAndCompare");
const { registerQuery, userCountQuery, loginQuery, getSingleUserQuery, getSingleUserToVerifyQuery, updateUserQuery, deleteUserQuery, showUsers, activatedUser } = require("../models/userModel");
const { getMyRecipeQuery } = require("../models/recipeModel");
const { createAccessToken } = require("../utils/jwt");
const { validationInput } = require("../utils/validationInput");
const sendVerificationEmail = require("../utils/sendVerficationEmail");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, NotFoundError, BadRequestError } = require("../error");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  const { password, name, email } = req.body;
  console.log(req.body);
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
  let uuid = uuidv4();
  req.body.password = hashPass;
  req.body.isVerified = false;
  req.body.checker = uuid;
  await registerQuery(req.body);
  // await sendVerificationEmail({ name, uuid, email });
  res.status(StatusCodes.CREATED).json({ msg: "sukses terdaftar" });
};
const verifyEmail = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = await activatedUser(id);
  res.status(StatusCodes.OK).json({ msg: "Akun anda telah terverifikasi" });
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
      return res.status(StatusCodes.OK).json({ user, msg: "Login Sukes!", token });
    } else {
      throw new UnauthenticatedError("password salah!");
    }
    // if (user.isverified) {

    // } else {
    //   throw new UnauthenticatedError("akun belum terverifikasi silahkan cek email!");
    // }
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
  console.log(user);
  let result;
  if (req.file) {
    let type = req.file.mimetype.split("/")[1];

    if (type != "png" && type != "jpg" && type != "jpeg") {
      throw new BadRequestError("file foto tidak sesuai");
    }
    result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: "file-upload",
    });
  }
  if (result && user.rows[0].public_id) {
    await cloudinary.uploader.destroy(user.rows[0].public_id);
  }
  const data = {
    name: name || user.rows[0].name,
    email: email || user.rows[0].email,
    phone: phone || user.rows[0].phone,
    password: req.body.password || user.rows[0].password,
    isVerified: user.rows[0].isverified,
    photo_user: result?.secure_url || user.rows[0].photo_user,
    public_id: result?.public_id || user.rows[0].public_id,
    id,
  };
  let resultUpdate = await updateUserQuery(data);
  console.log(resultUpdate);
  res.status(StatusCodes.OK).json({ msg: "berhasil terupdate", data });
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

const cekDuplikatPost = async (value, id) => {
  let result = await showUsers();
  return result.rows.find((val) => val.email == value && val.id != id);
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
