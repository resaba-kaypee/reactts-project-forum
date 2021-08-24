import ThreadItem from "../../models/ThreadItem";

export type ThreadItemArray = {
  threadItems: ThreadItem[];
};

interface Action {
  type: string;
  payload: ThreadItemArray | ThreadItem;
}

const ActionTypes = {
  GET_THREAD_ITEMS: "GET_THREAD_ITEMS",
  CREATE_THREAD_ITEM: "CREATE_THREAD_ITEM",
};

const initialState: ThreadItemArray = {
  threadItems: [],
};

export const setThreadItemsAction = (threadItems: ThreadItemArray) => {
  return {
    type: ActionTypes.GET_THREAD_ITEMS,
    payload: threadItems,
  };
};

export const createThreadItemAction = (threadItem: any) => {
  return {
    type: ActionTypes.CREATE_THREAD_ITEM,
    payload: threadItem,
  };
};

export const ThreadItemReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.GET_THREAD_ITEMS:
      return { ...state, threadItems: action.payload };
    case ActionTypes.CREATE_THREAD_ITEM:
      return {
        ...state,
        threadItems: [action.payload, ...state.threadItems],
      };
    default:
      return state;
  }
};
