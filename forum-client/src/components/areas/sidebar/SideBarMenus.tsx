import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRegistered,
  faSignInAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Registration from "../../auth/Registration";
import Login from "../../auth/Login";
import Logout from "../../auth/Logout";
import "./SideBarMenu.css";

const SideBarMenus = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const user = useSelector((state: AppState) => state.user);

  const onClickToggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const onClickToggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const onClickToggleLogout = () => {
    setShowLogout(!showLogout);
  };

  return (
    <>
      <ul>
        {user ? (
          <li>
            <FontAwesomeIcon icon={faUser} />
            <span className="menu-name">
              <Link to={`/userprofile/${user?.id}`}>{user?.userName}</Link>
            </span>
          </li>
        ) : null}
        {user ? null : (
          <>
            <li>
              <FontAwesomeIcon icon={faRegistered} />
              <span
                style={{ cursor: "pointer" }}
                className="menu-name"
                onClick={onClickToggleRegister}>
                register
              </span>
              <Registration
                isOpen={showRegister}
                onClickToggle={onClickToggleRegister}
              />
            </li>
            <li>
              <FontAwesomeIcon icon={faSignInAlt} />
              <span
                style={{ cursor: "pointer" }}
                onClick={onClickToggleLogin}
                className="menu-name">
                login
              </span>
              <Login isOpen={showLogin} onClickToggle={onClickToggleLogin} />
            </li>
          </>
        )}
        {user ? (
          <li>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span
              style={{ cursor: "pointer" }}
              onClick={onClickToggleLogout}
              className="menu-name">
              logout
            </span>
            <Logout isOpen={showLogout} onClickToggle={onClickToggleLogout} />
          </li>
        ) : null}
      </ul>
    </>
  );
};

export default SideBarMenus;
