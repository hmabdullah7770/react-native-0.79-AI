import { combineReducers } from 'redux';
import auth from './Auth';
import states from './states'

const rootReducer = combineReducers({
  Auth: auth,
  States: states
});

export default rootReducer;
