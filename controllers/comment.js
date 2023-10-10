const { postCommentQuery, getCommentQueryCount, updateCommentRecipe, deleteCommentByIdQuery } = require("../models/commentModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../error");

const postComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  if (!text) {
    throw new BadRequestError("tidak ada text");
  }
  const data = {
    text,
    user_id: req.user.id,
    recipe_id: id,
  };
  await postCommentQuery(data);
  let dataRecipeCount = await getCommentQueryCount(data);
  await updateCommentRecipe(dataRecipeCount.rows[0].count, parseInt(id));
  res.status(StatusCodes.OK).json({ msg: "Berhasil terkirim!" });
};

const deleteComment = async (req, res) => {
  const { id } = req.user;
  const comment_id = req.params.id;
  const { recipe_id } = req.query;
  const data = {
    user_id: id,
    comment_id,
    recipe_id,
  };
  await deleteCommentByIdQuery(data);
  let dataRecipeCount = await getCommentQueryCount(data);
  await updateCommentRecipe(dataRecipeCount.rows[0].count, parseInt(recipe_id));
  res.status(StatusCodes.OK).json({ msg: "Terhapus!" });
};
module.exports = {
  postComment,
  deleteComment,
};
