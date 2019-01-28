const mongoose = require("mongoose");
const { Schema } = mongoose;
const RecipientSchema = require("./Recipient");

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  // recipients je lista primalaca, th njihovih emailova i bulijana da li su glasali ili ne, a to je sve sadrzano u objektu RecipientSchema kojeg uvozimo iz Recipient.js
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  // pomocu ovog _user kazemo surveySchemi da ce svaki ovaj unos u databazi pripadati nekom useru, inace ime _user je potpuno arbitrarno, moze se zvati i user, ili yyyser, ili kako god
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  dateSent: Date,
  lastResponded: Date
});

mongoose.model("surveys", surveySchema);
