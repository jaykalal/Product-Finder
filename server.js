const serverDataModule = require("./modules/serverDataModule");
const HTTP_PORT = process.env.PORT || 3000;
const app = require("./app.js");
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
