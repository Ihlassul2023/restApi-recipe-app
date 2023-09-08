const { getLikedRecipeQuery, likeRecipeQuery, likeRecipeQueryCount, updateLikedRecipe, getSavedRecipeQuery, savedRecipeQuery, savedRecipeQueryCount, updateSavedRecipe, unLikeQuery, unSaveQuery } = require("../models/likedSavedModel");
const { StatusCodes } = require("http-status-codes");

const postSave = async (req, res) => {
  const { id } = req.user;
  const { recipe_id } = req.body;
  const savedRecipe = await getSavedRecipeQuery(id);
  const isSaved = savedRecipe.rows.filter((recipe) => recipe.recipe_id == recipe_id);
  const data = {
    user_id: id,
    recipe_id,
  };
  if (isSaved.length > 0) {
    await unSaveQuery(data);
    let dataRecipeCount = await savedRecipeQueryCount(data);
    await updateSavedRecipe(dataRecipeCount.rows[0].count, recipe_id);
    res.status(StatusCodes.OK).json({ msg: "anda batal menyimpan resep ini!" });
  }
  await savedRecipeQuery(data);
  let dataRecipeCount = await savedRecipeQueryCount(data);
  await updateSavedRecipe(dataRecipeCount.rows[0].count, recipe_id);
  res.status(StatusCodes.OK).json({ msg: "anda menyimpan resep ini!" });
};

const postLike = async (req, res) => {
  const { id } = req.user;
  const { recipe_id } = req.body;
  const likedRecipe = await getLikedRecipeQuery(id);
  const data = {
    user_id: id,
    recipe_id,
  };
  const isLiked = likedRecipe.rows.filter((recipe) => recipe.recipe_id == recipe_id);
  if (isLiked.length > 0) {
    await unLikeQuery(data);
    let dataRecipeCount = await likeRecipeQueryCount(data);
    await updateLikedRecipe(dataRecipeCount.rows[0].count, recipe_id);
    return res.status(StatusCodes.OK).json({ msg: "anda batal menyukai resep ini!" });
  }
  await likeRecipeQuery(data);
  let dataRecipeCount = await likeRecipeQueryCount(data);
  await updateLikedRecipe(dataRecipeCount.rows[0].count, recipe_id);
  res.status(StatusCodes.OK).json({ msg: "anda menyukai resep ini!" });
};
const getLikedRecipe = async (req, res) => {
  const { id } = req.user;
  const likedRecipe = await getLikedRecipeQuery(id);
  res.status(StatusCodes.OK).json({ data: likedRecipe.rows });
};
const getSavedRecipe = async (req, res) => {
  const { id } = req.user;
  const savedRecipe = await getSavedRecipeQuery(id);
  res.status(StatusCodes.OK).json({ data: savedRecipe.rows });
};
module.exports = {
  postLike,
  postSave,
  getLikedRecipe,
  getSavedRecipe,
};
