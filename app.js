require("dotenv").config();
const express = require("express");
const session = require("express-session");
const expressLayout = require('express-ejs-layouts');
const connectDB = require("./config/db");
const Routes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
connectDB();

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// view engine
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "./layouts/main");

// routes
app.use(Routes);

app.listen(PORT, () => {
  console.log(`App Listening on http://localhost:${PORT}`);
});
