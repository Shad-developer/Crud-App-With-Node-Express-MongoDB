const express = require("express");
const User = require("../models/users");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");
const Usercontroller = require('../controllers/controllers');


// Store and upload Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

router.get("/", Usercontroller.get_index);

router.get("/add", Usercontroller.get_add_user);

router.post("/add", upload, Usercontroller.post_add_user);

router.get("/update/:id", Usercontroller.get_update_user);

router.post("/update/:id", upload, Usercontroller.post_update_user);

router.get("/delete/:id", Usercontroller.get_delete_user);

module.exports = router;
