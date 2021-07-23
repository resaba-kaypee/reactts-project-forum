import { composeWithDevTools } from "redux-devtools-extension";
import { createStore } from "redux";
import { rootReducer } from "./AppState";

const configureStore = () => {
  return createStore(rootReducer, {}, composeWithDevTools());
};

export default configureStore;
