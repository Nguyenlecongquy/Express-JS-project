import db from "../configs/connectDB";
import multer from "multer";
import appRootPath from "app-root-path";
import path from "path";

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

let getUploadFilePage = (req, res) => {
  res.render("upLoadFilePage");
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRootPath.path + "/src/public/image");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

let handleUpLoadSingleFile = async (req, res) => {
  // 'avatar' is the name of our file input field in the HTML form
  let upload = multer({
    storage: storage,
    fileFilter: imageFilter,
  }).single("avatar");
  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err.code);
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    return res.send(
      `You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="50%"><hr /><a href="/upload-file">Upload another image</a>`
    );
  });
};

let handleUpLoadMultipleFile = async (req, res) => {
  // 'avatar_multiple' is the name of our file input field in the HTML form
  let upload = multer({
    storage: storage,
    fileFilter: imageFilter,
  }).array("avatar_multiple", 5);

  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.files) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err.code);
    } else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    let result = "You have uploaded these images: <hr />";
    const files = req.files;

    // Loop through all the uploaded images and display them on frontend
    for (let i = 0; i < files.length; i++) {
      result += `<img src="/image/${files[i].filename}" width="20%" height="25%"  style="margin-right: 20px;">`;
    }
    result += '<hr/><a href="/upload-file">Upload more images</a>';
    return res.send(result);
  });
};

module.exports = {
  getHomePage,
  getDetailPage,
  createNewUser,
  deleteUser,
  getEditPage,
  updateUser,
  getUploadFilePage,
  handleUpLoadSingleFile,
  handleUpLoadMultipleFile,
};
