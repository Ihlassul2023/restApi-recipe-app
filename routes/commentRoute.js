const router = require("express").Router();
const { postComment } = require("../controllers/comment");
const { authenticateUser } = require("../middlewares/authentication");
router.route("/:id").post(authenticateUser, postComment);

module.exports = router;
