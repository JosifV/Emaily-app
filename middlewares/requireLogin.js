// ovaj argument next je funkcija koja se pozove kad se sav kod middlewera zavrsi, slicno kao done()
module.exports = (req, res, next) => {
  // da proverimo da li je korisnik ulogovan...
  if (!req.user) {
    //.. ako nije onda mu izadje error, status 401
    return res.status(401).send({ error: "You must log in" });
  }
  // ... ako jeste onda se izvrsava next() i nastavlja se dalje..
  next();
};
