const router = require("express").Router();
const { postLike, getLikedRecipe, postSave, getSavedRecipe } = require("../controllers/likeSaved");
const { authenticateUser } = require("../middlewares/authentication");
router.route("/like").get(authenticateUser, getLikedRecipe).post(authenticateUser, postLike);
router.route("/bookmark").get(authenticateUser, getSavedRecipe).post(authenticateUser, postSave);

module.exports = router;
