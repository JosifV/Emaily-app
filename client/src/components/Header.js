import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Payments from "./Payments";
class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return [
          <li key="a1">
            <Payments />
          </li>,
          // ovde je this.props.auth u stvari database objekat ulogovanog korisnika, tako da samo dodamo .credits i prikaze koliko ima kredita... inace ovde u aplikaciji se automatski pokaze koliko ima kredita samo zato sto se u actions/index.js folderu koristi jedan tip akcije FETCH_USER koji automatski povlaci broj kredita sa sobom
          <li key="abv" style={{ margin: "0 10px" }}>
            Credits: {this.props.auth.credits}
          </li>,
          <li key="ab">
            <a href="/api/logout">Logout</a>
          </li>
        ];
    }
  }
  render() {
    return (
      <div>
        <nav className="blue-grey darken-1">
          <div className="nav-wrapper">
            <Link
              to={this.props.auth ? "/surveys" : "/"}
              className="brand-logo"
              style={{ padding: "5px" }}
            >
              Emaily
            </Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {this.renderContent()}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
/*Ova funkcija je isto sto i ova dole
 function mapStateToProps(state) {
  return {
    auth: state.auth
  };
} */
function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(Header);
