import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
// kad se uvozi nesto instalirano u node_modules-u onda se moze izostaviti ./, jer ga on onda automatski trazi u modulima
import "materialize-css/dist/css/materialize.min.css";
import reduxThunk from "redux-thunk";
import axios from "axios";
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
