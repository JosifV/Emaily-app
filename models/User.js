const mongoose = require("mongoose");

// Ovo je isto kao i kod dole, to je destructing
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  // ovako dodajemo jos jednu stavku u Mongo data bazi, i ta stavka ce se ticati koliko kredita korisnik ima
  credits: {
    type: Number,
    default: 0
  }
});

// ovim se kaze mungosu da napravi novu kolekciju pod nazivom users, i da u nju ide objekat userSchema
mongoose.model("users", userSchema);
