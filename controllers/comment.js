const { postCommentQuery } = require("../models/commentModel");
const { StatusCodes } = require("http-status-codes");

const postComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const data = {
    text,
    user_id: req.user.id,
    recipe_id: id,
  };
  await postCommentQuery(data);
  res.status(StatusCodes.OK).json({ msg: "Berhasil terkirim!" });
};

module.exports = {
  postComment,
};
