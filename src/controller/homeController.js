import db from "../configs/connectDB";

let getHomePage = async (req, res) => {
  let dataUser = [];
  try {
    dataUser = await db.any(`select * from users`);
  } catch (error) {
    console.log("Can not get database");
  }
  return res.render("homePage", { data: dataUser });
};

let getDetailPage = async (req, res) => {
  let id = req.params.id;
  let dataUser = [];
  try {
    dataUser = await db.one(`select * from users where id = $1`, [id]);
  } catch (error) {
    console.log(`Can not get Detail Page of User have ID: ${id}`);
  }

  return res.render("detailPage", { data: dataUser });
};

let createNewUser = async (req, res) => {
  let dataUser = req.body;
  let result = [];
  try {
    result = await db.one(
      `insert into users(id, name, address, email) values ($1,$2,$3,$4) returning *`,
      [dataUser.id, dataUser.name, dataUser.address, dataUser.email]
    );
    console.log("successful create");
  } catch (error) {
    console.log("create failed");
  }
  return res.redirect("/");
};

let deleteUser = async (req, res) => {
  let id = req.params.id;
  let result = [];
  try {
    result = await db.one(`delete from users where id = $1 returning *`, [id]);
    console.log("successful delete");
  } catch (error) {
    console.log("delete failed");
  }
  return res.redirect("/");
};

let getEditPage = async (req, res) => {
  let id = req.params.id;
  let result = [];
  try {
    result = await db.one(`select * from users where id = $1`, [id]);
  } catch (error) {
    console.log("can not get edit page");
  }
  return res.render("editPage", { data: result });
};

let updateUser = async (req, res) => {
  let data = req.body;
  let result = [];
  try {
    result = await db.one(
      `update users set name = $1, address = $2, email = $3 where id = $4 returning *`,
      [data.name, data.address, data.email, data.id]
    );
    console.log("successful update");
  } catch (error) {
    console.log("can not update");
  }
  return res.redirect("/");
};

module.exports = {
  getHomePage,
  getDetailPage,
  createNewUser,
  deleteUser,
  getEditPage,
  updateUser,
};
