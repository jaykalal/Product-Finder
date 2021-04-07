const Sequelize = require("sequelize");
const { Op, DataTypes } = require("sequelize");

var sequelize = new Sequelize(
  "d25gm2ceodgv13",
  "jtddgnbigeqeir",
  "49e4b5576b95fe1f336243f25880af16af2f1fee484088166792dd3d9d236781",
  {
    host: "ec2-54-225-190-241.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

// var sequelize = new Sequelize("database-1", "postgres", "ProductFinder", {
//   host: "database-1.czup9cfuy5lq.us-east-1.rds.amazonaws.com",
//   dialect: "postgres",
//   port: 5432,
//   dialectOptions: {
//     ssl: { rejectUnauthorized: false },
//   },
//   pool: {
//     max: 2,

//     min: 0,

//     acquire: 120000, // This needs to be fairly high to account for a

//     idle: 120000,

//     evict: 120000,
//   },
// });

var Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // use as a primary key
      autoIncrement: true, // automatically increment the value
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    keywords: {
      type: DataTypes.STRING,
    },
    SKU: {
      type: DataTypes.STRING,
    },
    URL: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

var User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // use as a primary key
      autoIncrement: true, // automatically increment the value
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve("Initilization Successful");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getProducts = function (searchBody) {
  return new Promise(function (resolve, reject) {
    if (searchBody.searchBox.trim()) {
      let searchTermArray = searchBody.searchBox.trim().split(" ");
      searchTermArray = searchTermArray.map((term) => "%" + term + "%");

      // Return record if any of the searchBody terms are found in keywords or description strings.
      Product.findAll({
        where: {
          [Op.or]: [
            {
              keywords: {
                [Op.iLike]: { [Op.any]: searchTermArray },
              },
            },
            {
              description: {
                [Op.iLike]: { [Op.any]: searchTermArray },
              },
            },
          ],
        },
      })
        .then(function (data) {
          // pull the data (exclusively)
          data = data.map((value) => value.dataValues);
          resolve(data);
        })
        .catch((err) => {
          reject("Error retreiving products");
        });
    } else {
      resolve([]);
    }
  });
};

//Function for handling registration
module.exports.register = function (user) {
  return new Promise(function (resolve, reject) {
    User.create({ email: user.email, password: user.password })
      .then(() => {
        resolve("User Created!");
      })
      .catch(() => {
        reject("User Already Exists!");
      });
  });
};

//function for login
module.exports.login = function (user) {
  return new Promise(function (resolve, reject) {
    User.findOne({ where: { email: user.email, password: user.password } })
      .then((data) => {
        data = data.dataValues;
        if (data) {
          resolve(data);
        } else {
          reject("User Not Found!");
        }
      })
      .catch(() => {
        reject("User Not Found!");
      });
  });
};

//function to get all users stored in database
module.exports.allusers = function (user) {
  return new Promise(function (resolve, reject) {
    User.findAll()
      .then((data) => {
        //console.log(data);
        data = data.map((value) => value.dataValues);
        resolve(data);
      })
      .catch(() => {
        reject();
      });
  });
};

//function to enable or disable retail user
module.exports.enableuser = function (userId) {
  return new Promise(function (resolve, reject) {
    User.findOne({ where: { userId: userId } })
      .then((user) => {
        console.log(user);
        if (user.isActive == true) {
          user.update({
            isActive: false,
          });
        } else {
          user.update({
            isActive: true,
          });
        }
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

//function to remove user
module.exports.removeuser = function (userId) {
  return new Promise(function (resolve, reject) {
    User.destroy({ where: { userId: userId } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

//function to add product
module.exports.addProduct = function (data, userId) {
  return new Promise(function (resolve, reject) {
    console.log(data, userId);
    Product.create({
      SKU: data.sku,
      keywords: data.keywords,
      description: data.description,
      URL: data.url,
      userId: userId,
      location: "canada",
    })
      .then(() => {
        resolve("jello");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//function to update product
module.exports.updateProduct = function (data) {
  return new Promise(function (resolve, reject) {
    Product.update(
      {
        SKU: data.sku,
        keywords: data.keywords,
        description: data.description,
        URL: data.url,
      },
      { where: { productId: data.productId } }
    )
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//function to delete product
module.exports.deleteProduct = function (productId) {
  return new Promise(function (resolve, reject) {
    Product.destroy({ where: { productId: productId } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//function to get list of all products
module.exports.allProducts = function (userId) {
  return new Promise(function (resolve, reject) {
    Product.findAll({
      where: {
        userId: userId,
      },
    })
      .then((data) => {
        data = data.map((value) => value.dataValues);
        resolve(data);
      })
      .catch(() => {
        reject();
      });
  });
};
