const User = require("../models/users");
const fs = require("fs");
// -----------------------------------------------------------------------------------------------------------

const get_index = (req, res) => {
  User.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "Home-Page", users: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// -----------------------------------------------------------------------------------------------------------


const get_add_user = (req, res) => {
  res.render("add_user", { title: "Add User" });
};

// -----------------------------------------------------------------------------------------------------------

const post_add_user = async (req, res) => {
  const { name, email, phone } = req.body;
  const { filename } = req.file;

  const newUser = new User({
    name: name,
    email: email,
    phone: phone,
    image: filename,
  });

  newUser
    .save()
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User Added Successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        type: "danger",
      });
    });
};

// -----------------------------------------------------------------------------------------------------------
const get_update_user = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      res.render("update_user", { title: "Edit User", user: result });
    })
    .catch((err) => {
      if (err) {
        res.redirect("/");
      }
      console.log(err);
    });
};

// -----------------------------------------------------------------------------------------------------------

const post_update_user = (req, res) => {
  const id = req.params.id;
  let newImage = "";

  if (req.file) {
    newImage = req.file.filename;
    try {
      fs.unlinkSync("./public/img/" + req.body.old_image);
    } catch (error) {
      console.log(error);
    }
  } else {
    newImage = req.body.old_image;
  }

  let updateFields = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: newImage,
  };

  User.findByIdAndUpdate(id, updateFields)
    .then((result) => {
      req.session.message = {
        type: "success",
        message: "User Updated Successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        type: "danger",
      });
    });
};

// -----------------------------------------------------------------------------------------------------------

const get_delete_user = (req, res) => {
    const id = req.params.id;
  
    User.findByIdAndDelete(id)
      .then((result) => {
        if (result.image != "") {
          try {
            fs.unlinkSync("./public/img/" + result.image);
          } catch (error) {
            console.log(error);
          }
        }
        req.session.message = {
          type: "success",
          message: "User Deleted Successfully",
        };
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
          type: "danger",
        });
      });
  }

module.exports = {
    get_index,
    get_add_user,
    post_add_user,
    get_update_user,
    post_update_user,
    get_delete_user

}