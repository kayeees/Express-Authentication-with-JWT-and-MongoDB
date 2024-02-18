require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/login")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

// Middleware for authentication
const authToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Handle JWT verification errors
    return res.redirect("/login");
  }
};

app
  .route("/signup")
  .get((req, res) => {
    return res.render("signup");
  })
  .post(async (req, res) => {
    try {
      const body = req.body;

      const hashedPassword = await bcrypt.hash(body.password, 10);

      await User.create({
        email: body.email,
        password: hashedPassword,
      });
      return res.redirect("/login");
    } catch (error) {
      // Handle database errors
      console.error("Error occurred during signup:", error);
      return res.status(500).json({ message: "Error signing up" });
    }
  });

app
  .route("/login")
  .get((req, res) => {
    return res.render("login");
  })
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.redirect("/login");
      }
      const token = jwt.sign(
        {
          email: email,
        },
        process.env.JWT_SECRET
      );

      res.cookie("token", token);
      return res.render("home");
    } catch (error) {
      console.error("Error occurred during login:", error);
      return res.status(500).json({ message: "Error logging in" });
    }
  });

app.get("/home", authToken, (req, res) => {
  return res.render("home");
});

app.get("/protected", authToken, (req, res) => {
  return res.send("Protected Page");
});

app.listen(port, () => console.log(`Server started at port ${port}`));
