import { combineReducers } from 'redux';
import soldiers from './soldiers';
import detail from './detail';
import superiors from './superiors'

const reducers = combineReducers({
  soldiers,
  detail,
  superiors
});

export default reducers;