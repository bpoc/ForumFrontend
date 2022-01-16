import React, {useContext} from "react";
import {UserProvider} from "../contexts/UserProvider";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/home.scss";

const Home = () => {
    const [currentUserInformation] = useContext(UserProvider);

    return (
        <main className="home container-with-shadow">
            <h1>Welcome to the Frontend Forum</h1>
            <hr />
            <section>
                <h2>We have</h2>
                <ul>
                    <li>
                        <span className="icon" aria-hidden="true">
                            <FontAwesomeIcon icon="star" />
                        </span>
                        <span>Topics that provide a variety of subjects to cover everything you would ever want</span>
                    </li>
                    <li>
                        <span className="icon" aria-hidden="true">
                            <FontAwesomeIcon icon="star" />
                        </span>
                        <span>Threads for narrowing a subject down to a specific concern</span>
                    </li>
                    <li>
                        <span className="icon" aria-hidden="true">
                            <FontAwesomeIcon icon="star" />
                        </span>
                        <span>Posts created by individual users to convey their unique ideas</span>
                    </li>
                </ul>
                <div className="get-started">
                    <h2>To Get Started</h2>
                    {currentUserInformation && (
                        <Link className="dark topic-link" to="/topics">
                            Click on here to view topics
                        </Link>
                    )}
                    {!currentUserInformation && (
                        <div className="links-container">
                            <Link className={"dark"} to="/login">
                                Login
                            </Link>
                            or
                            <Link className={"dark"} to={"/register"}>
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Home;
