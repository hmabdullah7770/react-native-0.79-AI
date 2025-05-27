import { combineReducers } from 'redux';
import auth from './Auth';
import states from './states'
import categoury from './Categoury'

const rootReducer = combineReducers({
  auth: auth,
  States: states,
  categoury:categoury,

});

export default rootReducer;
