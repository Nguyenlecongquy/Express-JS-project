import db from "../configs/connectDB";

let getAllUsers = async (req, res) => {
  let data = [];
  let message = "";
  try {
    data = await db.any(`select * from users`);
    message = "ok";
  } catch (error) {
    message = "fail database";
  }
  return res.status(200).json({
    message: message,
    users: data,
  });
};

let createUser = async (req, res) => {
  let { id, name, address, email } = req.body;
  let data = [];
  let message = "";

  if (!id || !name || !address || !email) {
    message = "missing required params";
    return res.status(200).json({
      message: message,
      users: data,
    });
  }

  try {
    data = await db.one(
      `insert into users(id, name, address, email) values ($1,$2,$3,$4) returning *`,
      [id, name, address, email]
    );
    message = "ok";
  } catch (error) {
    message = "failed database";
  }
  return res.status(200).json({
    message: message,
    users: data,
  });
};

let updateUser = async (req, res) => {
  let { id, name, address, email } = req.body;
  let data = [];
  let message = "";

  if (!id || !name || !address || !email) {
    message = "missing required params";
    return res.status(200).json({
      message: message,
      users: data,
    });
  }

  try {
    data = await db.one(
      `update users set name = $1, address = $2, email = $3 where id = $4 returning *`,
      [name, address, email, id]
    );
    message = "ok";
  } catch (error) {
    message = "failed database";
  }
  return res.status(200).json({
    message: message,
    users: data,
  });
};

let deleteUser = async (req, res) => {
  let id = req.params.id;
  let data = [];
  let message = "";

  if (!id) {
    message = "missing required params";
    return res.status(200).json({
      message: message,
      users: data,
    });
  }

  try {
    data = await db.one(`delete from users where id = $1 returning *`, [id]);
    message = "ok";
  } catch (error) {
    message = "failed database";
  }
  return res.status(200).json({
    message: message,
    users: data,
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
