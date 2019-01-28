import { FETCH_USER } from "../actions/types";

// state je null po defoltu, posto dok cekamo da se izvrsi ajax poziv koji utvrdjuje da li smo ulogovani ili ne, na taj nacin nece nista pisati na hederu, ni Log in now, ni Loged in...
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      // ajax poziv vraca strunu kao odgovor, u okviru res.data...
      // u toj struni se nalaze podaci o korisniku koji potvrdjuju da je ulogovan
      // stoga stavimo || false, da bi bilo tri moguce opcije -ulogovan je, nije ulogovan(to je false), i na kraju ovo gore sto stoji null - a to je dok se ceka na zavrsetak ajax poziva
      return action.payload || false;
    default:
      return state;
  }
}
