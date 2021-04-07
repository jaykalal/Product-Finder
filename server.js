/*Heroku App

https://productfinder805.herokuapp.com/ | https://git.heroku.com/productfinder805.git

*/

/*
Database Credentials

Host
ec2-54-225-190-241.compute-1.amazonaws.com

Database
d25gm2ceodgv13

User
jtddgnbigeqeir

Port
5432

Password
49e4b5576b95fe1f336243f25880af16af2f1fee484088166792dd3d9d236781

URI
postgres://jtddgnbigeqeir:49e4b5576b95fe1f336243f25880af16af2f1fee484088166792dd3d9d236781@ec2-54-225-190-241.compute-1.amazonaws.com:5432/d25gm2ceodgv13

Heroku CLI
heroku pg:psql postgresql-parallel-67940 --app productfinder805

*/

/* Database test code - ran successfully!

const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('d25gm2ceodgv13', 'jtddgnbigeqeir', '49e4b5576b95fe1f336243f25880af16af2f1fee484088166792dd3d9d236781', {
    host: 'ec2-54-225-190-241.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

*/

const HTTP_PORT = process.env.PORT || 3000;
const serverDataModule = require("./modules/serverDataModule");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const { validationResult, matchedData } = require("express-validator");
const validationRule = require("./validation-rule");
const session = require("express-session");

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "cats",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//Middleware to check user is logged in or not
function LoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/intermediate", LoggedIn, (req, res) => {
  res.render("intermediate");
});

app.get("/", (req, res) => {
  res.redirect("/search");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/retail", LoggedIn, (req, res) => {
  serverDataModule
    .allProducts(req.session.user.userId)
    .then((data) => {
      res.render("retail", { products: data });
    })
    .catch(() => console.log("error"));
});

app.post("/retail", LoggedIn, (req, res) => {
  console.log(req.body);
  serverDataModule
    .addProduct(req.body, req.session.user.userId)
    .then(() => {
      res.redirect("/retail");
    })
    .catch((err) => console.log(err));
});

app.get("/search", (req, res) => {
  res.render("search", { message: "Do a Search" });
});

app.get("/admin", LoggedIn, (req, res) => {
  serverDataModule.allusers().then((data) => {
    res.render("admin", { users: data });
  });
});

app.post("/enableuser", LoggedIn, (req, res) => {
  console.log(req.body);
  serverDataModule
    .enableuser(req.body.userId)
    .then(() => {
      res.send("Done!");
    })
    .catch(() => {
      res.send("error!");
    });
});
app.post("/removeuser", LoggedIn, (req, res) => {
  console.log(req.body);
  serverDataModule
    .removeuser(req.body.userId)
    .then(() => {
      res.send("Done!");
    })
    .catch(() => {
      res.send("error!");
    });
});

app.get("/registration", (req, res) => {
  res.render("registration");
});
//Registration Route
app.post("/register", validationRule.form, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    //console.log(errMsg);
    res.render("registration", { errors: errMsg });
  } else {
    serverDataModule
      .register(req.body)
      .then(() => {
        var msg = "User Created!";
        res.render("registration", { errors: errMsg, msg });
      })
      .catch((err) => {
        var msg = err;
        res.render("registration", { errors: errMsg, msg });
      });
  }
});
//Login Route
app.post("/login", validationRule.loginform, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    res.render("login", { errors: errMsg });
  } else {
    serverDataModule
      .login(req.body)
      .then((data) => {
        req.session.user = data;
        res.redirect("/intermediate");
      })
      .catch((err) => {
        var msg = err;
        res.render("login", { errors: errMsg, msg });
        console.log(msg);
      });
  }
});

app.post("/search", (req, res) => {
  serverDataModule
    .getProducts(req.body)
    .then((data) => {
      if (data.length > 0) {
        res.render("search", { products: data });
      } else {
        res.render("search", { message: "No Results Yet" });
      }
    })
    .catch((err) => {
      res.render("search", { message: err });
    });
});

serverDataModule
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
