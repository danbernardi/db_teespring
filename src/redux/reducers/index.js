import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import breakpoint from './breakpoint';

export const initialState = {};

export default history => combineReducers({
  router: connectRouter(history),
  breakpoint
});
