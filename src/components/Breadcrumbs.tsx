import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/breadcrumbs.scss";

export type BreadcrumbsProps = {
    links: {name: string; path: string}[];
};

const Breadcrumbs = ({links}: BreadcrumbsProps) => {
    return (
        <div className="breadcrumbs">
            {links.map((link, index) => {
                if (index !== 0) {
                    return (
                        <>
                            <FontAwesomeIcon icon={["fas", "angle-right"]} />
                            <Link to={link.path} className="dark">
                                {link.name}
                            </Link>
                        </>
                    );
                }
                return (
                    <Link to={link.path} className="dark">
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
