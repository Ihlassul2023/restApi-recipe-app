const router = require("express").Router();
const { check } = require("express-validator");
const { getAllRecipe, getMyRecipe, getRecipeById, createRecipe, updateRecipe, deleteRecipe } = require("../controllers/recipe");
const { authenticateUser } = require("../middlewares/authentication");
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

router
  .route("/")
  .get(getAllRecipe)
  .post(
    authenticateUser,
    upload.single("photo"),
    check("title", "input title harus diisi").notEmpty(),
    check("ingredients", "input ingredients harus diisi").notEmpty(),
    check("category_id", "input category_id harus diisi").notEmpty(),
    createRecipe
  );
router.route("/myRecipe").get(authenticateUser, getMyRecipe);

router.route("/:id").get(getRecipeById).put(authenticateUser, upload.single("photo"), updateRecipe).delete(authenticateUser, deleteRecipe);

module.exports = router;
