import db from "../configs/connectDB";

let getHomePage = async (req, res) => {
  let dataUser = [];
  dataUser = await db.any(`select * from users`);
  return res.render("homePage", { data: dataUser });
};

let getDetailPage = async (req, res) => {
  let id = req.params.id;
  let dataUser = [];
  dataUser = await db.one(`select * from users where id = $1`, [id]);
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
    console.log("successful creating");
  } catch (error) {
    console.log("creating failed");
  }
  return res.redirect("/");
};

module.exports = {
  getHomePage,
  getDetailPage,
  createNewUser,
};
