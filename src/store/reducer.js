import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import persistConfig from "./config/persistConfig";
import authReducer from "./reducers/auth";

const combinedReducer = combineReducers({
  user: authReducer,
});

export default persistReducer(persistConfig, combinedReducer);
