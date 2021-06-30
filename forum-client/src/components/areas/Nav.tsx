import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { Link } from "react-router-dom";
import ReactModal from "react-modal";
import UserMenus from "./usermenu/UserMenus";
import Categories from "./categories/Categories";
import "./Nav.css";

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { width } = useWindowDimensions();

  const getMenu = () => {
    if (width <= 768) {
      return (
        <>
          <FontAwesomeIcon
            onClick={onClickToggle}
            icon={faBars}
            size="lg"
            className="nav-mobile-menu"
          />
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <h1 style={{ fontSize: "1em", display: "inline" }}>ProjectForum</h1>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <h1>ProjectForum</h1>
        </Link>
        <UserMenus />
      </>
    );
  };

  const onClickToggle = (e: React.MouseEvent<Element, MouseEvent>) => {
    setShowMenu(!showMenu);
  };

  const onRequestClose = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    setShowMenu(false);
  };

  return (
    <div>
      <ReactModal
        className="modal-menu"
        isOpen={showMenu}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}>
        <UserMenus />
      </ReactModal>
      <nav>{getMenu()}</nav>
      <Categories />
    </div>
  );
};

export default Nav;
