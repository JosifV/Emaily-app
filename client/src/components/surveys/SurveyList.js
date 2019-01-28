import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchSurveys } from "../../actions";

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }
  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div key={survey._id} className="card blue-grey lighten-4">
          <div className="card-content black-text">
            <h4>{survey.title}</h4>
            <p>{survey.body}</p>
            <p className="right">
              Sent on: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action deep-orange lighten-1">
            <span
              className=" white-text deep-orange lighten-1"
              style={{ padding: "5px" }}
            >
              Yes: {survey.yes}
            </span>
            <span
              className=" white-text deep-orange lighten-1"
              style={{ padding: "5px" }}
            >
              No: {survey.no}
            </span>
          </div>
        </div>
      );
    });
  }
  render() {
    if (this.props.surveys && this.props.surveys.length) {
      return <div>{this.renderSurveys()}</div>;
    } else {
      return <div />;
    }
  }
}
function mapStateToProps({ surveys }) {
  return {
    surveys
  };
}
export default connect(
  mapStateToProps,
  { fetchSurveys }
)(SurveyList);
