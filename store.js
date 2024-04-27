import {applyMiddleware, createStore,combineReducers} from "redux";
import {logger} from "redux-logger"
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import signInReducer from "./Src/Reducers/signInReducer";
import userDashboardDataReducer from "./Src/Reducers/userDashboardDataReducer";
import addExpenseReducer from "./Src/Reducers/addExpenseReducer";
import activityReducer from "./Src/Reducers/activityReducer";
import eventReducer from "./Src/Reducers/eventReducer";
import appDataReducer from "./Src/Reducers/appDataReducer";

const middleware = applyMiddleware(promise, thunk, logger);

let combinedReducer = combineReducers({
	signInReducer: signInReducer,
	userDashboardDataReducer: userDashboardDataReducer,
	addExpenseReducer: addExpenseReducer,
	activityReducer: activityReducer,
	eventReducer: eventReducer,
	appDataReducer: appDataReducer
});

const configureStore = () => {
return createStore(combinedReducer, middleware);
}
export default configureStore;
