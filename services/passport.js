const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");

// kad se pozove samo jedan argument, kao npr ovde users, znaci da se trazi nesto od mungosa, a dva argumenta znace da hoces nesto da stavis u njega
const User = mongoose.model("users");

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      // callbackURL mora da se zavrsava sa URL, i to sa velikim slovima, to je adresa na koju nas gugul uputi nakon sto // odobri nas zahtev
      callbackURL: "/auth/google/callback",
      // callbackURL:
      // "https://desolate-retreat-77316.herokuapp.com/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // ovo je da se ne bi duplirali id svaki put kad se neko uloguje, findOne znaci nadji element ciji googleId je jednak id-u sa gugl profila onog koji se loguje, naravno googleId je naziv stavke u databazi
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        //ako vec postoji podatak o onome koji se loguje / tj ako se vec sign up
        // na kraju se zove done() da se zavrsi proces autentifikacije, null znaci da nema errora, a existingUser znaci da vec postoji u data bazi i da je sve u redu

        // ako ima vec existinguser, onda ce return da prekine tok i automatski se ide na done,
        // a ako ne onda se nastavlja izvrsavanje koda dalje ka const user = await new User({...}) itd
        return done(null, existingUser);
      }
      //ako se neko prvi put loguje i ne postoji podatak o njemu u databazi radi se sledece:
      // novi objekat User ciji string googleId dobija vrednost guglovog profile.id
      // a ovo .save ga ubacuje u mongoDB bazu, bez toga baza bi bila prazna a ovaj objekat bi postojao samo na klijentu
      // a ovo .then() sluzi jer je ovo asimetrican poziv, te kad se on zavrsi onda to .then() izvrsi kod koji je slican kao i gornji done()
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
//p.s. id u googleClientID mora da bude velikim slovima, caps lock

passport.serializeUser((user, done) => {
  // ovde je user.id u stvari id iz databaze, a ne guglov profile.id... koristimo to zato sto nam guglov profile.id treba samo za logovanje i signup, a nakon toga uporedjujemo samo user.id za kukijs, i slicne stvari
  // takodje, koristimo mongov id za slucaj da imamo nekoliko opcija za logovanje, npr linedin, gugl, fejsbuk, i ko ce onda da ide kroz sve te id-eve... Zato je najlakse da se koristi mongov id
  done(null, user.id);
});

// id je ovde token koji smo dobili, tj user.id iz gornje funkcioje
passport.deserializeUser((id, done) => {
  // findById je funkcija koja trazi element sa tim id-om
  User.findById(id).then(user => {
    done(null, user);
  });
});
