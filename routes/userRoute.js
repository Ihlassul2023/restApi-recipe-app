const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const { authenticateUser } = require("../middlewares/authentication");
const { register, login, cekDuplikatPost, getSingleUser, updateUser, deleteUser, showAllUsers, verifyEmail } = require("../controllers/user");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
});

router.post(
  "/register",
  body("email").custom(async (value) => {
    const duplikat = await cekDuplikatPost(value);
    if (duplikat) {
      throw new Error("email sudah terdaftar!");
    }
    return true;
  }),
  body("password").custom((value) => {
    if (value?.length <= 8) {
      throw new Error("panjang password harus lebih dari 8");
    }
    return true;
  }),
  check("email", "email tidak valid").isEmail(),
  check("phone", "no hp tidak valid").isMobilePhone("id-ID"),
  check("email", "email harus diisi").notEmpty(),
  check("name", "name harus diisi").notEmpty(),
  check("phone", "phone harus diisi").notEmpty(),
  check("password", "password harus diisi").notEmpty(),
  register
);
router.post("/login", check("email", "email tidak valid").isEmail(), check("email", "email harus diisi").notEmpty(), check("password", "password harus diisi").notEmpty(), login);
router.get("/showUser", authenticateUser, getSingleUser);
router.get("/showAllUsers", authenticateUser, showAllUsers);
router.put(
  "/updateUser",
  authenticateUser,
  upload.single("photo_user"),
  body("email").custom(async (value, { req }) => {
    if (value) {
      const validEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
      const duplikat = await cekDuplikatPost(value, req.user.id);
      if (duplikat) {
        throw new Error("email sudah terdaftar!");
      } else if (!value.match(validEmail)) {
        throw new Error("email tidak valid!");
      }
    }
    return true;
  }),
  body("password").custom((value) => {
    if (value) {
      if (value.length <= 8) {
        throw new Error("panjang password harus lebih dari 8");
      }
    }
    return true;
  }),
  body("phone").custom((value) => {
    if (value) {
      const validPhone = /^(?:\+?62|0)(?:\d{3,4}-?){2}\d{3,4}$/;
      if (!value.match(validPhone)) {
        throw new Error("nomor hp tidak valid!");
      }
    }
    return true;
  }),
  updateUser
);
router.delete("/deleteUser", authenticateUser, deleteUser);
router.get("/verify/:id", verifyEmail);

module.exports = router;
