import { combineReducers } from 'redux';
import auth from './Auth';
import states from './states'
import categoury from './Categoury'
import profile from './Profile';
import banner from './Banner';
import followlist from './Followerlist';

const rootReducer = combineReducers({
  auth: auth,
  States: states,
  categoury:categoury,
  profile: profile,
  banner: banner,
  followlist: followlist
});

export default rootReducer;
