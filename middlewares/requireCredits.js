module.exports = (req, res, next) => {
  // ako user ima manje od jednog kredita, onda mu sledi ovo
  if (req.user.credits < 1) {
    return res.status(403).send({ error: "You must have at least 1 credit" });
  }
  next();
};
