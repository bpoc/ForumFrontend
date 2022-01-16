import React, {useCallback, useContext, useEffect, useState} from "react";
import {Thread, Topic} from "../models/Models";
import API, {APIError} from "../api/API";
import {Link, useNavigate, useParams} from "react-router-dom";
import {DateTime} from "luxon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/threads.scss";
import {UserProvider} from "../contexts/UserProvider";
import ThreadModal from "../components/ThreadModal";
import NetworkErrorModal from "../components/NetworkErrorModal";
import Breadcrumbs from "../components/Breadcrumbs";

const Threads = () => {
    const [topic, setTopic] = useState<Topic | null>(null);
    const {topicId} = useParams();
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    const [showCreateThread, setShowCreateThread] = useState(false);
    const [showEditThread, setShowEditThread] = useState<Thread | null>(null);
    const [currentUserInfo] = useContext(UserProvider);
    const navigate = useNavigate();

    const getTopic = useCallback(() => {
        API.getTopic(parseInt(topicId ?? "-1"))
            .then((response) => {
                setTopic(response);
            })
            .catch((e) => {
                if (e.code === 404) {
                    navigate("/404");
                    return;
                }
                setNetworkError(e as APIError);
            });
    }, [navigate, topicId]);

    const onThreadComplete = useCallback(() => {
        getTopic();
        setShowCreateThread(false);
        setShowEditThread(null);
    }, [getTopic]);

    useEffect(() => {
        if (!topicId) {
            navigate("/404");
            return;
        }
        getTopic();
    }, [getTopic, navigate, topicId]);

    if (!topic) return null;
    return (
        <main className="threads-page">
            <Breadcrumbs
                links={[
                    {name: "Home", path: "/"},
                    {name: "Topics", path: "/topics"},
                ]}
            />
            <h1>{topic.name} threads</h1>
            <ul className="threads-container">
                {topic.threads?.map((thread) => {
                    return (
                        <li key={thread.id}>
                            <h2>
                                <Link to={`/threads/${thread.id}`} className="dark">
                                    {thread.name}
                                </Link>
                            </h2>
                            <span className="date">{DateTime.fromISO(thread.createdAt).toFormat("MMM d, yy")}</span>
                            <span className="author">created by {thread.user.email}</span>
                            {thread.user.id === currentUserInfo?.user.id && (
                                <button
                                    className="edit-thread"
                                    onClick={() => {
                                        setShowEditThread(thread);
                                    }}
                                >
                                    <FontAwesomeIcon icon="edit" aria-hidden={true} />
                                    Edit
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
            <button
                className="blue create-thread"
                onClick={() => {
                    setShowCreateThread(true);
                }}
            >
                Create Thread <FontAwesomeIcon icon="plus-square" />
            </button>
            {showCreateThread && (
                <ThreadModal
                    onCloseButtonClick={() => setShowCreateThread(false)}
                    onThreadComplete={onThreadComplete}
                    topicId={parseInt(topicId ?? "-1")}
                />
            )}
            {showEditThread && (
                <ThreadModal
                    onCloseButtonClick={() => setShowEditThread(null)}
                    onThreadComplete={onThreadComplete}
                    topicId={parseInt(topicId ?? "-1")}
                    editThread={showEditThread}
                />
            )}
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </main>
    );
};

export default Threads;
