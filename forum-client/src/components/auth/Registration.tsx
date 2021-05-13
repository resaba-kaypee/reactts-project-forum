import { FC, useReducer } from "react";
import userReducer from "./common/UserReducer";
import ReactModal from "react-modal";
import { ModalProps } from "../../types/ModalProps";
import { allowSubmit } from "./common/Helpers";
import "./Auth.css";
import PasswordComparison from "./common/PasswordComparison";

const Registration: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  const [
    { userName, password, email, passwordConfirm, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "raven",
    password: "",
    email: "admin@dzraven.com",
    passwordConfirm: "",
    resultMsg: "",
    isSubmitDisabled: true,
  });

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "userName" });

    if (!e.target.value) {
      allowSubmit(dispatch, "Username cannot be empty.", true);
    } else {
      allowSubmit(dispatch, "", false);
    }
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "email" });

    if (!e.target.value) {
      allowSubmit(dispatch, "Email cannot be empty.", true);
    } else {
      allowSubmit(dispatch, "", false);
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
      shouldCloseOnOverlayClick={true}
      ariaHideApp={false}>
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
            <PasswordComparison
              dispatch={dispatch}
              password={password}
              passwordConfirm={passwordConfirm}
            />
          </div>
          <div className="form-buttons">
            <div className="form-btn-left">
              <button
                className="action-btn"
                style={{ marginLeft: ".5em" }}
                disabled={isSubmitDisabled}
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
