import React, {useCallback, useContext, useEffect, useState} from "react";
import {UserProvider} from "../contexts/UserProvider";
import "../styles/header.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {clearCurrentUserInfoFromLocalStorage} from "../api/API";

const Header = () => {
    const [currentUserInformation, setCurrentUserInformation] = useContext(UserProvider);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isMobileNavClosing, setIsMobileNavClosing] = useState(false);
    const [isMobileNavOpening, setIsMobileNavOpening] = useState(false);

    useEffect(() => {
        if (isMobileNavOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isMobileNavOpen]);

    const logout = () => {
        closeMobileNav();
        clearCurrentUserInfoFromLocalStorage();
        setCurrentUserInformation?.(null);
    };

    const closeMobileNav = useCallback(() => {
        setIsMobileNavClosing(true);
        setTimeout(() => {
            setIsMobileNavOpen(false);
            setIsMobileNavClosing(false);
        }, 600);
    }, [setIsMobileNavOpen, setIsMobileNavClosing]);

    const openMobileNav = useCallback(() => {
        setIsMobileNavOpening(true);
        setTimeout(() => {
            setIsMobileNavOpen(true);
            setIsMobileNavOpening(false);
        }, 600);
    }, [setIsMobileNavOpening, setIsMobileNavOpen]);

    return (
        <header className={"site-header"}>
            <Link className="home" to={"/"}>
                <FontAwesomeIcon icon={"laptop-code"} />
                <span className={"site-name"}>Forum Frontend</span>
            </Link>
            <div
                className={classNames({
                    "nav-container": true,
                    "mobile-open": isMobileNavOpen,
                    "open-anim": isMobileNavOpening,
                    "is-closing": isMobileNavClosing,
                })}
            >
                <nav>
                    <button className="mobile-close-button" aria-label="close navigation" onClick={closeMobileNav}>
                        <FontAwesomeIcon icon={["fas", "times-circle"]} />
                    </button>
                    <Link to={"/topics"} onClick={closeMobileNav}>
                        Topics
                    </Link>
                    {!currentUserInformation && (
                        <Link to={"/login"} onClick={closeMobileNav}>
                            Login
                        </Link>
                    )}
                    {currentUserInformation && (
                        <Link to={"/login"} onClick={logout}>
                            Logout
                        </Link>
                    )}
                </nav>
            </div>
            <button
                id="menu-open-button"
                className="menu-button"
                aria-label="Open the nav menu"
                onClick={openMobileNav}
            >
                <FontAwesomeIcon icon={["fas", "bars"]} />
            </button>
        </header>
    );
};

export default Header;
