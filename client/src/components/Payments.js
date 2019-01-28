import React, { Component } from "react";

import StripeCheckout from "react-stripe-checkout";
import { connect } from "react-redux";
import * as actions from "../actions";

class Payments extends Component {
  render() {
    return (
      <StripeCheckout
        //props amount sluzi da se prenese kolicina novca koja se platila (po defoltu racuna kao dolare, i to u centima, znaci ako hoces 5 dolara unesi 500)
        amount={500}
        //ovo je token koji nam Stripe salje kad korisnik unese podatke, token parametar prima callback funkciju u kojoj radimo sa tokenom sta god pozelimo
        token={token => this.props.handleToken(token)}
        //ovo je publishable stripe key
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
        name="Pay for our services"
        description="Card num: 4242 4242 4242 4242"
      >
        <button className="btn blue-grey darken-3">Add Credits</button>
      </StripeCheckout>
    );
  }
}
export default connect(
  null,
  actions
)(Payments);
