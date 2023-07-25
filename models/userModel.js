const Pool = require("../db/db");

const registerQuery = (data) => {
  return new Promise((resolve, reject) => {
    const { name, email, phone, password, role } = data;
    Pool.query(`insert into users(name,email,phone,password,role) values('${name}','${email}','${phone}','${password}','${role}')`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};
const userCountQuery = async () => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM users`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const loginQuery = ({ email }) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};
const getSingleUserQuery = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT users.name,users.email,users.phone FROM users WHERE id=${parseInt(id)}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const updateUserQuery = (data) => {
  const { name, email, phone, password, id } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`UPDATE users SET name='${name}', email='${email}', phone = '${phone}', password='${password}' WHERE id=${parseInt(id)}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

const deleteUserQuery = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM users WHERE id=${id}`, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const showUsers = () => {
  return new Promise((resolve, reject) => {
    Pool.query("select * from users", (err, res) => {
      if (!err) {
        resolve(res);
      }
    });
  });
};
module.exports = { registerQuery, userCountQuery, loginQuery, showUsers, updateUserQuery, getSingleUserQuery, deleteUserQuery };
