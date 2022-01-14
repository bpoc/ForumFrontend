import React from "react";
import "../styles/footer.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="site-name">
                <FontAwesomeIcon icon={"laptop-code"} />
                <span className={"site-name"}>Forum Frontend</span>
            </div>
            <div className={"copy-notice"}>
                <div>&copy; 2022 Forum Frontend,</div>
                <div>all rights reserved.</div>
            </div>
            <div className="social">
                <h3>Check us out!</h3>
                <ul>
                    <li>
                        <FontAwesomeIcon icon={["fab", "facebook"]} />
                    </li>
                    <li>
                        <FontAwesomeIcon icon={["fab", "instagram"]} />
                    </li>
                    <li>
                        <FontAwesomeIcon icon={["fab", "twitter"]} />
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
