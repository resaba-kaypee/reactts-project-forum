import { combineReducers } from "redux";
import { UserProfileReducer } from "./user/Reducer";
import { ThreadCategoriesReducer } from "./categories/Reducer";
import { UpdateThreadPointReducer } from "./message/Reducer";

export const rootReducer = combineReducers({
  user: UserProfileReducer,
  categories: ThreadCategoriesReducer,
  message: UpdateThreadPointReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
