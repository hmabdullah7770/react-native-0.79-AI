import { combineReducers } from 'redux';
import auth from './auth';
import states from './states'

const rootReducer = combineReducers({
  Auth: auth,
  States: states
});

export default rootReducer;
