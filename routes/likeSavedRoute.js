const router = require("express").Router();
const { postLike, getLikedRecipe, postSave, getSavedRecipe } = require("../controllers/likeSaved");
const { authenticateUser } = require("../middlewares/authentication");
router.route("/like").get(authenticateUser, getLikedRecipe);
router.route("/bookmark").get(authenticateUser, getSavedRecipe);
router.post("/like/:recipe_id", authenticateUser, postLike);
router.post("/bookmark/:recipe_id", authenticateUser, postSave);

module.exports = router;
