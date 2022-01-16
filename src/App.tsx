import React, {useState} from "react";
import "the-new-css-reset/css/reset.css";
import "./styles/global.scss";
import {CurrentUserInfo} from "./models/Models";
import {UserProvider} from "./contexts/UserProvider";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {getCurrentUserInfoFromLocalStorage} from "./api/API";
import Home from "./pages/Home";
import Header from "./components/Header";
import {library} from "@fortawesome/fontawesome-svg-core";
import Footer from "./components/Footer";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Topics from "./pages/Topics";
import Threads from "./pages/Threads";
import Posts from "./pages/Posts";
import {
    faLaptopCode,
    faBars,
    faTimesCircle,
    faStar,
    faEdit,
    faPlusSquare,
    faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faTwitter, faInstagram} from "@fortawesome/free-brands-svg-icons";

library.add(
    faLaptopCode,
    faFacebook,
    faTwitter,
    faInstagram,
    faBars,
    faTimesCircle,
    faStar,
    faEdit,
    faPlusSquare,
    faAngleRight
);

function App() {
    const [currentUserInformation, setCurrentUserInformation] = useState<CurrentUserInfo | null>(
        getCurrentUserInfoFromLocalStorage()
    );

    return (
        <UserProvider.Provider value={[currentUserInformation, setCurrentUserInformation]}>
            <>
                <Router>
                    <div className={"site-content"}>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Registration />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="topics" element={<Topics />} />
                            <Route path="/topics/:topicId" element={<Threads />} />
                            <Route path="/threads/:threadId" element={<Posts />} />
                        </Routes>
                    </div>
                    <Footer />
                </Router>
            </>
        </UserProvider.Provider>
    );
}

export default App;
