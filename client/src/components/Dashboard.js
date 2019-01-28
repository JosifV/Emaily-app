import React from "react";
import { Link } from "react-router-dom";
import SurveysList from "./surveys/SurveyList";

const Dashboard = () => {
  return (
    <div>
      <SurveysList />
      <div className="fixed-action-btn">
        <Link
          to="/surveys/new"
          className="btn-floating btn-large blue-grey darken-3"
        >
          <i className="large material-icons">add</i>
        </Link>
      </div>
      ;
    </div>
  );
};
export default Dashboard;
