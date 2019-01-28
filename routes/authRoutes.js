const passport = require("passport");

module.exports = app => {
  app.get(
    // kada god dodjemo do urla /auth/google
    "/auth/google",
    // izvesce se ovaj kod. 'google' je nacin da pozovemo GoogleStrategy
    passport.authenticate("google", {
      // scope je spisak onoga sto ce nam google dati da koristimo iz svoje databaze, npr mozemo da trazimo sve njegove slike sa Google driva, ili sve //njegove kontakte, itd
      scope: ["profile", "email"]
    })
  );
  //posto sada u URLu imas code koji ti je gugl poslao, ovaj put ce te gugl tretirati drugacije, malo bolje
  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      // cilj je da se - kad god dodje do ovog gore urla, stranica prebaci(redirect) na /surveys
      res.redirect("/surveys");
    }
  );
  ////////////////////////////////////////////////
  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  // ovo je logout
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
