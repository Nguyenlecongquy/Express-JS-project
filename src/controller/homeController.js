import db from "../configs/connectDB";

let getHomePage = (req, res) => {
  let d = [];
  d = db.query(`select * from users`).then((data) => {
    console.log("data", data);
    return res.render("index", { dataUser: JSON.stringify(data) });
  });
};

module.exports = {
  getHomePage,
};
