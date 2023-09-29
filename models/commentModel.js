const Pool = require("../db/db");
const postCommentQuery = async (data) => {
  const { user_id, recipe_id, text } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`INSERT INTO comment(recipe_id,user_id,text) VALUES(${recipe_id},${user_id},'${text})`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const getCommentRecipeQuery = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT users.name, users.photo_user, comment.text FROM comment JOIN users ON comment.user_id=users.id WHERE comment.recipe_id=${id} `, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const getCommentQueryCount = async (data) => {
  const { recipe_id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM comment WHERE recipe_id = ${parseInt(recipe_id)}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const updateCommentRecipe = async (count, recipe_id) => {
  console.log("model activate");
  return new Promise((resolve, reject) =>
    Pool.query(`UPDATE recipe SET comment_count=${count} WHERE id=${recipe_id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

module.exports = {
  postCommentQuery,
  getCommentRecipeQuery,
  getCommentQueryCount,
  updateCommentRecipe,
};
