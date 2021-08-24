import { combineReducers } from "redux";
import { UserProfileReducer } from "./user/Reducer";
import { ThreadCategoriesReducer } from "./categories/Reducer";
import { UpdateThreadPointReducer } from "./message/Reducer";
import { ThreadItemReducer } from "./items/Reducers";

export const rootReducer = combineReducers({
  user: UserProfileReducer,
  categories: ThreadCategoriesReducer,
  message: UpdateThreadPointReducer,
  items: ThreadItemReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
