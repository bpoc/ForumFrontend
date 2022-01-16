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
            {links.map(({path, name}, index) => {
                if (index !== 0) {
                    return (
                        <span key={name}>
                            <FontAwesomeIcon aria-hidden={true} icon={["fas", "angle-right"]} />
                            <Link to={path} className="dark">
                                {name}
                            </Link>
                        </span>
                    );
                }
                return (
                    <Link key={name} to={path} className="dark">
                        {name}
                    </Link>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
