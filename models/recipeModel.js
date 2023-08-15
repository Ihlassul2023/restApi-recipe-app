const Pool = require("../db/db");
// ORDER BY created_at ${sort}

const getRecipeAllQuery = async (data) => {
  const { search, searchBy, offset, limit, sort } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo, recipe.created_at AS created, users.photo_user AS profil_pict, category.name AS category,users.name AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.user_id = users.id  WHERE ${searchBy} ILIKE '%${search}%' ORDER BY created ${sort} OFFSET ${offset} LIMIT ${limit}`,
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

const getMyRecipeQuery = async (data) => {
  const { search, searchBy, offset, limit, id, sort } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.photo,recipe.public_id, category.name AS category,users.name AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON recipe.user_id = users.id WHERE user_id = ${id} AND ${searchBy} ILIKE '%${search}%' OFFSET ${offset} LIMIT ${limit}`,
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

const getRecipeCountQuery = async (data) => {
  const { search, searchBy } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM recipe JOIN category ON recipe.category_id = category.id WHERE ${searchBy} ILIKE '%${search}%'`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};
const getMyRecipeCountQuery = async (data) => {
  const { search, searchBy, id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM recipe JOIN category ON recipe.category_id = category.id WHERE user_id = ${id} AND ${searchBy} ILIKE '%${search}%'`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const postRecipeQuery = async (data) => {
  const { title, ingredients, category_id, user_id, category, photo, public_id } = data;
  console.log(data);
  return new Promise((resolve, reject) =>
    Pool.query(`INSERT INTO recipe(title,ingredients,category,category_id,user_id,photo,public_id) VALUES('${title}','${ingredients}','${category}',${category_id},${user_id},'${photo}','${public_id}')`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const putRecipeQuery = async (data) => {
  const { title, ingredients, category_id, category, id, photo, public_id } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`UPDATE recipe SET title='${title}',category ='${category}', ingredients='${ingredients}', category_id = ${category_id},photo='${photo}',public_id='${public_id}' WHERE id=${id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const getRecipeByIdQuery = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM recipe WHERE id=${id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const deleteByIdQuery = async (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM recipe WHERE id=${id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

module.exports = { getMyRecipeCountQuery, getMyRecipeQuery, getRecipeAllQuery, getRecipeCountQuery, getRecipeByIdQuery, postRecipeQuery, putRecipeQuery, deleteByIdQuery };
