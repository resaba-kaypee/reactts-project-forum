import { Dispatch } from "react";

export const allowSubmit = (
  dispatch: Dispatch<any>,
  msg: string,
  setDisabled: boolean
) => {
  dispatch({ type: "resultMsg", payload: msg });
  dispatch({ type: "isSubmitDisabled", payload: setDisabled });
};
