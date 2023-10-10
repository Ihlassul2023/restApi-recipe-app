const router = require("express").Router();
const { postComment, deleteComment } = require("../controllers/comment");
const { authenticateUser } = require("../middlewares/authentication");

router.route("/:id").post(authenticateUser, postComment).delete(authenticateUser, deleteComment);

module.exports = router;
