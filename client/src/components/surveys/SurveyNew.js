import React, { Component } from "react";
import SurveyForm from "./SurveyForm";
import SurveyFormReview from "./SurveyFormReview";
import { reduxForm } from "redux-form";

class SurveyNew extends Component {
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() =>
            this.setState({
              showFormReview: false
            })
          }
        />
      );
    }
    return (
      <SurveyForm
        onSurveySubmit={() =>
          this.setState({
            showFormReview: true
          })
        }
      />
    );
  }
  render() {
    return <div>{this.renderContent()}</div>;
  }
}
export default reduxForm({
  // ovo sluzi da se unosi izbrisu u inputu kad se ode sa stranice, ali ipak da inputi ostanu kad se ode na next dugme
  form: "surveyForm"
})(SurveyNew);
