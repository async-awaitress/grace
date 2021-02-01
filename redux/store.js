import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

//add your subreducers in here, make sure they're exported in their files
import { user, challengesReducer } from "./reducers";

// add your subreducers in here too
const reducer = combineReducers({
  user,
  challengesReducer,
});

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(reducer, middleware);

export default store;
