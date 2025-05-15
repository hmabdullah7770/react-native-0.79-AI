import { combineReducers } from 'redux';
import auth from './Auth';
import states from './states'

const rootReducer = combineReducers({
  auth: auth,
  States: states
});

export default rootReducer;
