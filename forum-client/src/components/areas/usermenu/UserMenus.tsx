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
import "./UserMenu.css";

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
      <ul className="user-menu">
        {user ? (
          <li>
            <span className="menu-name">
              <FontAwesomeIcon icon={faUser} />{" "}
              <Link to={`/userprofile/${user?.id}`}>{user?.userName}</Link>
            </span>
          </li>
        ) : null}
        {user ? null : (
          <>
            <li>
              <span onClick={onClickToggleLogin} className="menu-name">
                <FontAwesomeIcon icon={faSignInAlt} /> login
              </span>
              <Login isOpen={showLogin} onClickToggle={onClickToggleLogin} />
            </li>
            <li>
              <span className="action-btn" onClick={onClickToggleRegister}>
                <FontAwesomeIcon icon={faRegistered} /> register
              </span>
              <Registration
                isOpen={showRegister}
                onClickToggle={onClickToggleRegister}
              />
            </li>
          </>
        )}
        {user ? (
          <li>
            <span onClick={onClickToggleLogout} className="action-btn">
              <FontAwesomeIcon icon={faSignOutAlt} /> logout
            </span>
            <Logout isOpen={showLogout} onClickToggle={onClickToggleLogout} />
          </li>
        ) : null}
      </ul>
    </>
  );
};

export default SideBarMenus;
