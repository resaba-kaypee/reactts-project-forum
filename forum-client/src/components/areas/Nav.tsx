import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import ReactModal from "react-modal";
import SideBarMenus from "./sidebar/SideBarMenus";
import "./Nav.css";
import SideBar from "./sidebar/SideBar";

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
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1 style={{ fontSize: "1em", display: "inline" }}>ProjectForum</h1>
          </a>
        </>
      );
    }

    return (
      <>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>ProjectForum</h1>
        </a>
        <SideBarMenus />
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
        <SideBarMenus />
      </ReactModal>
      <nav>{getMenu()}</nav>
    </div>
  );
};

export default Nav;
