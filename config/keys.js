//utvrdjivanje u kom smo okruzenju, dev ili prod
if (process.env.NODE_ENV === "production") {
  //Ako smo u produkciji
  module.exports = require("./prod");
  console.log("u prod fazi");
} else {
  //Ako smo u Dev okruzenju
  module.exports = require("./dev");
  console.log("u dev fazi");
}
