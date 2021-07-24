export const UpdateThreadPointType = "UPDATE_THREADPOINT";

export interface UpdateThreadPointAction {
  type: string;
  payload: string | undefined;
}

export const UpdateThreadPointReducer = (
  state: string = "",
  action: UpdateThreadPointAction
): string | undefined => {
  switch (action.type) {
    case UpdateThreadPointType:
      return action.payload;
    default:
      return state;
  }
};
