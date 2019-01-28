import React, { Component } from "react";
// ova helper funkcija je jako slicna sa connect funkcijom, kao sto ces i videti dole u exportu
// pomocu Field prikupljamo svaki input upis, on zamenjuje sve html elemente pomocu kojih korisnik upisuje nesto
import { reduxForm, Field } from "redux-form";
import SurveyField from "./SurveyField";
import { Link } from "react-router-dom";
import _ from "lodash";
import validateEmails from "../../utils/validateEmails";
import formsField from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return formsField.map(({ label, name }) => (
      <Field
        key={name}
        component={SurveyField}
        type="text"
        label={label}
        name={name}
      />
    ));
  }
  render() {
    return (
      <div>
        {/* handleSubmit je vec odredjena funkcija unutar redux-forma.. P.S. ono sto je u zagradama te funkcije se automatski izvrsava kad se klikne na submit dugme */}
        <form onSubmit={this.props.onSurveySubmit}>
          {this.renderFields()}
          {/* name obavezno unesi, jer ga redux-form pamti pod tim imenom */}
          {/* <Field type="text" name="surveyTitle" component="input" /> */}
          <Link to="/surveys" className="red btn-flat white-text">
            Back
          </Link>
          <button
            className="blue-grey darken-1 btn-flat right white-text"
            type="submit"
          >
            Next
          </button>
        </form>
      </div>
    );
  }
}
// ovo je funkcija za proveru vrednosta inputa, ako je sve u redu const errors ce biti prazan i kad vratimo prazni objekat errors redux-form ce razumeti da nije bilo nikakvih gresaka tokom unosa u input...

function validate(values) {
  const errors = {};

  // ovo pozove uvezenu komponentu, prosledi joj sve mejlove da ona pogleda da li su svi u redu
  // a ako nema unetih mejlova onda nastupa znak or || i funkcija parsira obicnu praznu strunu ""
  errors.recipients = validateEmails(values.recipients || "");

  _.each(formsField, ({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide a value";
    }
  });

  return errors;
}
export default reduxForm({
  form: "surveyForm",
  //   ovo je isto kao i validate: validate
  validate,
  // ovo stavi da ti sacuva vrednosti inputa kad se komponenta izmeni
  destroyOnUnmount: false
})(SurveyForm);
