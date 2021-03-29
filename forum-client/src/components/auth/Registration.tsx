import { FC, useReducer, useState } from "react";
import userReducer from "./common/UserReducer";
import {
  PasswordTestResult,
  isPasswordValid,
} from "../../common/validator/PasswordValidator";
import ReactModal from "react-modal";

export interface RegistrationProps {
  isOpen: boolean;
  onClickToggle: (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
}

const Registration: FC<RegistrationProps> = ({ isOpen, onClickToggle }) => {
  const [isRegisterDisbled, setRegisterDiasbled] = useState(true);

  const [
    { userName, password, email, passwordConfirm, resultMsg },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "raven",
    password: "",
    email: "admin@dzraven.com",
    passwordConfirm: "",
    resultMsg: "",
  });

  const allowRegister = (msg: string, setDisabled: boolean) => {
    setRegisterDiasbled(setDisabled);
    dispatch({ payload: msg, type: "resultMsg" });
  };

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "userName" });

    if (!e.target.value) {
      allowRegister("Username cannot be empty.", true);
    } else {
      allowRegister("", false);
    }
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "email" });

    if (!e.target.value) {
      allowRegister("Email cannot be empty.", true);
    } else {
      allowRegister("", false);
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "password" });

    const passwordCheck: PasswordTestResult = isPasswordValid(e.target.value);

    if (!passwordCheck.isValid) {
      allowRegister(passwordCheck.message, true);
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
      allowRegister("Passwords do not match", true);
      return false;
    } else {
      allowRegister("", false);
      return true;
    }
  };

  const onClickRegister = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onClickToggle(e);
  };

  const onClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClickToggle(e);
  };

  return (
    <ReactModal
      className="modal-menu"
      isOpen={isOpen}
      onRequestClose={onClickToggle}
      shouldCloseOnOverlayClick={true}>
      <form>
        <div className="reg-inputs">
          <div>
            <label htmlFor="username">username</label>
            <input
              name="username"
              type="text"
              value={userName}
              onChange={onChangeUserName}
            />
          </div>
          <div>
            <label htmlFor="email">email</label>
            <input
              name="email"
              type="text"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
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
            <label htmlFor="passwordconfirm">password confirmantion</label>
            <input
              name="passwordconfirm"
              type="password"
              value={passwordConfirm}
              onChange={onChangePasswordConfirm}
            />
          </div>
          <div className="form-buttons">
            <div className="form-btn-left">
              <button
                className="action-btn"
                style={{ marginLeft: ".5em" }}
                disabled={isRegisterDisbled}
                onClick={onClickRegister}>
                Register
              </button>
              <button
                className="cancel-btn"
                style={{ marginLeft: ".5em" }}
                onClick={onClickCancel}>
                Cancel
              </button>
            </div>
            <span className="form-btn-right">
              <strong>{resultMsg}</strong>
            </span>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default Registration;
