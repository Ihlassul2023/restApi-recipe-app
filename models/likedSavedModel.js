const Pool = require("../db/db");
const likeRecipeQuery = async (data) => {
  const { user_id, recipe_id } = data;
  console.log(data);
  return new Promise((resolve, reject) =>
    Pool.query(`INSERT INTO liked(recipe_id,user_id) VALUES(${recipe_id},${user_id})`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const savedRecipeQuery = async (data) => {
  const { user_id, recipe_id } = data;
  console.log(data);
  return new Promise((resolve, reject) =>
    Pool.query(`INSERT INTO bookmark(recipe_id,user_id) VALUES(${recipe_id},${user_id})`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const getLikedRecipeQuery = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT liked.recipe_id,recipe.category_id, recipe.title, recipe.ingredients,recipe.like_count, recipe.bookmark_count, recipe.comment_count, recipe.photo,recipe.public_id, category.name AS category,users.name AS author FROM liked JOIN recipe ON liked.recipe_id=recipe.id JOIN category ON recipe.category_id = category.id JOIN users ON recipe.user_id = users.id WHERE liked.user_id = ${id}`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};
const getSavedRecipeQuery = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT bookmark.recipe_id,recipe.category_id, recipe.title, recipe.ingredients, recipe.photo,recipe.public_id,recipe.like_count, recipe.bookmark_count, recipe.comment_count, category.name AS category,users.name AS author FROM bookmark JOIN recipe ON bookmark.recipe_id=recipe.id JOIN category ON recipe.category_id = category.id JOIN users ON recipe.user_id = users.id WHERE bookmark.user_id = ${id}`,
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};
const likeRecipeQueryCount = async (data) => {
  const { recipe_id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM liked WHERE recipe_id = ${parseInt(recipe_id)}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const savedRecipeQueryCount = async (data) => {
  const { recipe_id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM bookmark WHERE recipe_id = ${parseInt(recipe_id)}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const updateLikedRecipe = async (count, recipe_id) => {
  console.log("model activate");
  return new Promise((resolve, reject) =>
    Pool.query(`UPDATE recipe SET like_count=${count} WHERE id=${recipe_id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const updateSavedRecipe = async (count, recipe_id) => {
  console.log("model activate");
  return new Promise((resolve, reject) =>
    Pool.query(`UPDATE recipe SET saved_count=${count} WHERE id=${recipe_id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const unLikeQuery = async (data) => {
  const { user_id, recipe_id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM liked WHERE user_id=${user_id} AND recipe_id=${recipe_id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const unSaveQuery = async (data) => {
  const { user_id, recipe_id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM bookmark WHERE user_id=${user_id} AND recipe_id=${recipe_id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
module.exports = { likeRecipeQuery, getLikedRecipeQuery, updateLikedRecipe, likeRecipeQueryCount, savedRecipeQuery, savedRecipeQueryCount, getSavedRecipeQuery, updateSavedRecipe, unLikeQuery, unSaveQuery };
