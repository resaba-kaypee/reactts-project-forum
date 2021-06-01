import React, { FC, useReducer } from "react";
import ReactModal from "react-modal";
import { ModalProps } from "../../types/ModalProps";
import userReducer from "./common/UserReducer";
import { allowSubmit } from "./common/Helpers";
import useRefreshReduxMe, { Me } from "../../hooks/useRefreshReduxMe";
import { gql, useMutation } from "@apollo/client";
import "./Auth.css";

const LoginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const Login: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  const [execLogin] = useMutation(LoginMutation, {
    refetchQueries: [
      {
        query: Me,
      },
    ],
  });

  const [{ email, password, resultMsg, isSubmitDisabled }, dispatch] =
    useReducer(userReducer, {
      email: "",
      password: "",
      resultMsg: "",
      isSubmitDisabled: true,
    });

  const { execMe, updateMe } = useRefreshReduxMe();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "email", payload: e.target.value });
    if (!e.target.value) allowSubmit(dispatch, "Email cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "password", payload: e.target.value });
    if (!e.target.value)
      allowSubmit(dispatch, "Password cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };

  const onClickLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      !email ||
      email.trim().length < 0 ||
      !password ||
      password.trim().length < 0
    ) {
      dispatch({ type: "resultMsg", payload: "Fields cannot be empty." });
      setTimeout(() => {
        dispatch({ type: "resultMsg", payload: "" });
      }, 2000);
    } else {
      const { data }: any = await execLogin({
        variables: {
          email,
          password,
        },
      });

      if (data && data?.login) {
        if (
          data.login.startsWith("User") ||
          data.login.startsWith("Password")
        ) {
          dispatch({ type: "resultMsg", payload: data.login });
        } else if (data.login.startsWith("Log")) {
          execMe();
          updateMe();
          onClickToggle(e);
        }
      }
    }
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
            <label>email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
        </div>
        <div className="form-buttons form-buttons-sm">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickLogin}>
              Login
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}>
              Close
            </button>
          </div>

          <span className="form-btn-left">
            <strong>{resultMsg}</strong>
          </span>
        </div>
      </form>
    </ReactModal>
  );
};

export default Login;
