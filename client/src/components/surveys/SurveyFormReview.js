import React from "react";
import { connect } from "react-redux";
import formsField from "./formFields";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import * as actions from "../../actions";

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formsField, ({ name, label }) => {
    return (
      <div key={name}>
        <label>{label}</label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h3>Please confirm your entries</h3>
      {reviewFields}
      <button className="red btn-flat white-text" onClick={onCancel}>
        Back
      </button>
      <button
        className="blue-grey darken-1 btn-flat right white-text"
        onClick={() => submitSurvey(formValues, history)}
      >
        Send Survey
      </button>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    formValues: state.form.surveyForm.values
  };
}
export default connect(
  mapStateToProps,
  actions
)(withRouter(SurveyFormReview));
