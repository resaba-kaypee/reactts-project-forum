import React, { FC } from "react";
import ReactModal from "react-modal";
import { ModalProps } from "../../types/ModalProps";
import { gql, useMutation } from "@apollo/client";
import "./Auth.css";
import { AppState } from "../../store/AppState";
import { useSelector } from "react-redux";
import useRefreshReduxMe, { Me } from "../../hooks/useRefreshReduxMe";

const LogoutMutation = gql`
  mutation logout($email: String!) {
    logout(email: $email)
  }
`;

const Logout: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  const user = useSelector((state: AppState) => state.user);
  const [execLogout] = useMutation(LogoutMutation, {
    refetchQueries: [
      {
        query: Me,
      },
    ],
  });
  const { deleteMe } = useRefreshReduxMe();

  const onClickLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onClickToggle(e);

    await execLogout({
      variables: { email: user?.email ?? "" },
    });

    deleteMe();
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
        <div className="logout-inputs">Are you sure you want to logout?</div>
        <div className="form-buttons form-buttons-sm">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              onClick={onClickLogout}>
              Logout
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}>
              Close
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default Logout;
