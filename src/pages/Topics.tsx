import React, {useCallback, useContext, useEffect, useState} from "react";
import {UserProvider} from "../contexts/UserProvider";
import {Link, useNavigate} from "react-router-dom";
import API, {APIError} from "../api/API";
import {Topic} from "../models/Models";
import {DateTime} from "luxon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TopicModal from "../components/TopicModal";
import "../styles/topics.scss";
import NetworkErrorModal from "../components/NetworkErrorModal";

const Topics = () => {
    const [currentUserInfo] = useContext(UserProvider);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    const [showNewTopicModal, setShowNewTopicModal] = useState(false);
    const [editTopic, setEditTopic] = useState<Topic | null>(null);
    const navigate = useNavigate();

    const fetchTopics = useCallback(() => {
        API.getTopics().then((response) => {
            if ("isError" in response) {
                if (response.code === 401) {
                    navigate("/login");
                    return;
                }
                setNetworkError(response);
            } else {
                setTopics(response);
            }
        });
    }, [navigate]);

    const onEditTopicComplete = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (topic: Topic) => {
            setEditTopic(null);
            fetchTopics();
        },
        [fetchTopics]
    );

    useEffect(() => {
        console.log("topics", currentUserInfo);
        if (currentUserInfo == null) {
            navigate("/login");
            return;
        }
        fetchTopics();
    }, [currentUserInfo, fetchTopics, navigate]);

    return (
        <main className="topics-page">
            <h1>Forum Topics</h1>
            <ul className="topics-list">
                {topics.map((topic) => {
                    console.log(DateTime.fromISO(topic.createdAt));
                    return (
                        <li key={topic.id}>
                            <h2>
                                <Link to={`/topics/${topic.id}`} className="dark">
                                    {topic.name}
                                </Link>
                            </h2>
                            <p>{topic.description}</p>
                            <div className="author">
                                <span className="label">created by</span>{" "}
                                <span className="author-email">{topic.user.email}</span>
                                <span className="date">
                                    ({DateTime.fromISO(topic.createdAt).toFormat("MMM d, yy")})
                                </span>
                            </div>

                            {currentUserInfo?.user.id === topic.user.id && (
                                <button
                                    onClick={() => {
                                        setEditTopic(topic);
                                    }}
                                    aria-label="Edit Topic"
                                >
                                    <FontAwesomeIcon icon="edit" aria-hidden="true" />
                                    Edit
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
            <button
                className="blue new-topic"
                aria-label="create new thread"
                onClick={() => {
                    setShowNewTopicModal(true);
                }}
            >
                <span>New Topic</span>
                <FontAwesomeIcon icon="plus-square" aria-hidden="true" />
            </button>
            {showNewTopicModal && (
                <TopicModal
                    onCloseButtonClick={() => {
                        setShowNewTopicModal(false);
                    }}
                    onTopicComplete={(topic) => {
                        setTopics([...topics, topic]);
                        setShowNewTopicModal(false);
                    }}
                />
            )}
            {editTopic && (
                <TopicModal
                    onCloseButtonClick={() => setEditTopic(null)}
                    onTopicComplete={onEditTopicComplete}
                    editTopic={editTopic}
                />
            )}
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </main>
    );
};

export default Topics;
