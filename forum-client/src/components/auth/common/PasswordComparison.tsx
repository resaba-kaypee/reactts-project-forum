import React, { FC } from "react";
import { allowSubmit } from "./Helpers";
import {
  isPasswordValid,
  PasswordTestResult,
} from "../../../common/validator/PasswordValidator";

interface PasswordComparisonProps {
  dispatch: React.Dispatch<any>;
  password: string;
  passwordConfirm: string;
}

const PasswordComparison: FC<PasswordComparisonProps> = ({
  dispatch,
  password,
  passwordConfirm,
}) => {
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "password" });

    const passwordCheck: PasswordTestResult = isPasswordValid(e.target.value);

    if (!passwordCheck.isValid) {
      allowSubmit(dispatch, passwordCheck.message, true);
      return;
    }

    passwordsSame(passwordConfirm, e.target.value);
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "passwordConfirm" });

    passwordsSame(password, e.target.value);
  };

  const passwordsSame = (passwordVal: string, passwordConfirmVal: string) => {
    if (passwordVal !== passwordConfirmVal) {
      allowSubmit(dispatch, "Passwords do not match", true);
      return false;
    } else {
      allowSubmit(dispatch, "", false);
      return true;
    }
  };
  return (
    <>
      <div>
        <label htmlFor="password">password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      <div>
        <label htmlFor="passwordconfirm">password confirmation</label>
        <input
          name="passwordconfirm"
          type="password"
          value={passwordConfirm}
          onChange={onChangePasswordConfirm}
        />
      </div>
    </>
  );
};

export default PasswordComparison;
