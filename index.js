const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
require("./models/User");
require("./models/Survey");
require("./services/passport");
const mongoose = require("mongoose");
const keys = require("./config/keys");
mongoose.connect(keys.mongoURI);

const app = express();

// kad god se posalje get/post/patch/i sl poziv databazi, ova linija koda ce ceo body prebaciti u json, i staviti ga kao stavku u req(zahtev) objekat
app.use(bodyParser.json());

app.use(
  cookieSession({
    // maxAge je trajanje koliko kuki moze da stoji u pretrazivacu pre nego sto istekne, u ovom slucaju to je 30 dana (tako se pise 30 dana)
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

// ako je enviorment u produkciji onda pokreni ovaj kod
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // ovo se stavi da express servira index.html fajl ako taj isti express ne prepozna url rutu
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log("Express listening on port", this.address().port);
});
