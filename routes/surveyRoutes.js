const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/SurveyTemplate");
const _ = require("lodash");
const Path = require("path-parser").default;
const { URL } = require("url");
// ovde je Survey instanca kojom se poziva surveys mungos model napravljen u models/Survey.js fajlu
const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    // Survey je mungos model, tako da ovo znaci udji u nase surveye na data bazi i nadji one koji ispunjavaju uslove u .find() zagradama
    const surveys = await Survey.find({
      //prvi parametar, da to budu surveyi korisnika ciji je id jednak idu trenutno ulogovanog korisnika
      _user: req.user.id
      // ali nemoj da nam posaljes listu svih emailova, zato sto nam ta lista ne treba, a i moze da bude predugacka
    }).select({ recipients: false });
    res.send({ surveys });
  });

  // kad korisnig glasa ovo ce mu izaci
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thx for voting!!!");
  });

  /*   ovako izgleda router dole bez ES2016 destrukturing
app.post("/api/surveys/webhooks", (req, res) => {
    const events = _.map(req.body, event => {
      // URL je pomocni paket za parsiranje kroz url - uvezli smo ga gore
      // ovo .pathname sluzi da se izvuce samo custom url, npr /api/surveys/sdfdgdgdfg/yes
      const pathname = new URL(event.url).pathname;
      //:surveyId i :choice je ono sto izvlacimo iz url-a
      const p = new Path("/api/surveys/:surveyId/:choice");
      const match = p.test(pathname);
      // console.log(p.test(pathname));
      // i u node konzoli ce izaci npr:
      // { surveyId: '5c4c5b1d3832271d1c2e3ca4', choice: 'yes' }

      // ako match postoji onda sacuvaj email iz prvog odgovora, i surveyId i choice iz urla
      if (match) {
        return {
          email: event.email,
          surveyId: match.surveyId,
          choice: match.choice
        };
      }
    });
        const compactEvents = _.compact(events);
    // prodji kroz svaki compactEvents i trazi jedinstveni objekt po email i surveyId propertisu
    const uniqueEvents = _.uniqBy(compactEvents, "email", "surveyId");
    console.log(uniqueEvents);
    res.send({});
  }); */

  app.post("/api/surveys/webhooks", (req, res) => {
    ///:surveyId i :choice je ono sto izvlacimo iz url-a
    const p = new Path("/api/surveys/:surveyId/:choice");

    // chain metod je prisutan u lodash paketu, on se pozove jednom, dodeli mu se neki array, i onda samo nizes metode za obradu tog arraya, npr .map().sort().reverse() i sl
    _.chain(req.body)
      .map(({ email, url }) => {
        // URL je pomocni paket za parsiranje kroz url - uvezli smo ga gore
        // ovo .pathname sluzi da se izvuce samo custom url, npr /api/surveys/sdfdgdgdfg/yes
        const match = p.test(new URL(url).pathname);
        // console.log(p.test(pathname));
        // i u node konzoli ce izaci npr:
        // { surveyId: '5c4c5b1d3832271d1c2e3ca4', choice: 'yes' }

        // ako match postoji onda sacuvaj email iz prvog odgovora, i surveyId i choice iz urla
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact()
      // prodji kroz svaki events i trazi jedinstveni objekt po email i surveyId propertisu
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        // listaj kroz Survey na MongoDBu i nadji jedan element, pa ga zameni, tj updatuj
        Survey.updateOne(
          {
            // na mongou elementi nemaju id properti nego _id
            _id: surveyId,
            recipients: {
              $elemMatch: {
                email: email,
                responded: false
              }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();
    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    // ovako se pomocu destructuring odredi vrednost req.body
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      // ovo smo malo skratili poocu ES2016 sintakse, inace bi izgledalo ovako:
      // title(element u objektu):title(const definisan gore u zagradi sa ostalima), ili skraceno title:title
      title,
      subject,
      body,
      // .split(',') razdeli recipiante u niz struna od kojih je svaka odvojena zarezom,
      // map() skenira svaku stavku tog niza, i za stavku napravi objekat u kome se email elementu dodeljuje ta stavka iz niza
      // i naravno .trim() brise svaki prazni prostor
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      // i prenesemo userov id
      _user: req.user.id,
      // kada je poslat mejl? poslat je sada i to zabelezimo funkcijom .now()
      dateSent: Date.now()
    });

    // DOBRO MESTO DA SE POSALJE MEJL - PROBA
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      // ovaj kod salje mejl
      await mailer.send();
      // ovako pamtimo survey
      await survey.save();
      // ovako oduzimamo jedan kredit za slanje poruke
      req.user.credits -= 1;
      // iii ovako sacuvamo novo stanje na kreditu korisnika
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      // ako je korisnik nesto zeznuo poslacemo mu ovaj error
      res.status(422).send(err);
    }
  });
};
