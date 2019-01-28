// uvezemo keys.js fajl u kome se nalazi stripe secret key koji nam treba
const keys = require("../config/keys");
// uvezemo modul stripe i u drugim zagradama navedemo stripe secret key - jer tako mora
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");
module.exports = app => {
  // kad se requireLogin stavi kao drugi argument, onda se on izvrsi pre cele ove async funkcije, i ako korisnik nije ulogovan onda mu izadje error i sl... inace, moze se staviti koliko god hoces tih argumenata koji pozivaju middleware pakete i funkcije da odrade svoj posao pre nego sto .post/.get ili bilo koj drugi metod pokrenu svoju callback funkciju
  app.post("/api/stripe", requireLogin, async (req, res) => {
    // ovako se formira funkcija za naplatu sa kartice
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "5$ for 5 credits",
      // pod source se stavi token.id - id onog objekta koji nam salje stripe
      source: req.body.id
    });

    // pomocu req.user; automatski mozemo pristupiti id-u trenutno ulogovanog korisnika - jer passport.js ima taj trik zbog kukija i ovih linija koda u server/index.js
    // require("./routes/authRoutes")(app);
    // require("./routes/billingRoutes")(app);

    // ovako dodajemo 5 kredita
    req.user.credits += 5;
    // ovako zapamtimo novo stanje u data bazi
    const user = await req.user.save();
    // ovako se podaci salju sa servera do pretrazivaca
    res.send(user);
  });
};
