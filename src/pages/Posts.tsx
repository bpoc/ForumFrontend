import React, {useContext, useEffect, useState} from "react";
import {Post, Thread} from "../models/Models";
import {Link, useParams} from "react-router-dom";
import API, {APIError} from "../api/API";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/posts.scss";
import {DateTime} from "luxon";
import {UserProvider} from "../contexts/UserProvider";
import PostModal from "../components/PostModal";
import NetworkErrorModal from "../components/NetworkErrorModal";

const Posts = () => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    const [currentUserInfo] = useContext(UserProvider);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [editPost, setEditPost] = useState<Post | null>(null);
    const {threadId} = useParams();

    const getThread = () => {
        API.getThread(parseInt(threadId ?? "-1")).then((response) => {
            if ("isError" in response) {
                setNetworkError(response);
                return;
            }
            setThread(response);
        });
    };

    useEffect(() => {
        getThread();
    }, []);

    const onPostComplete = () => {
        setShowCreatePostModal(false);
        setEditPost(null);
        getThread();
    };

    return (
        <main className="posts-page">
            <div className="breadcrumbs">
                <Link to="/" className="dark">
                    Home
                </Link>
                &nbsp;&gt;&nbsp;
                <Link to="/topics" className="dark">
                    Topics
                </Link>
                &nbsp;&gt;&nbsp;
                {thread?.topic && (
                    <Link className="dark" to={`/topics/${thread.topic?.id}`}>
                        {thread.topic.name}
                    </Link>
                )}
            </div>
            <h1>{thread?.name}</h1>
            <ul className="posts-container">
                {thread?.posts?.map((post) => {
                    const postedDate = DateTime.fromISO(post.createdAt).toFormat("MMM d, yy");
                    return (
                        <li key={post.id}>
                            <div className="poster-info">
                                <h2>{post.user?.email}</h2>
                                <time dateTime={post.createdAt}>{postedDate}</time>
                            </div>
                            {post.user?.id === currentUserInfo?.user.id && (
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setEditPost(post);
                                    }}
                                >
                                    <FontAwesomeIcon icon="edit" />
                                    Edit
                                </button>
                            )}
                            <p>{post.text}</p>
                        </li>
                    );
                })}
            </ul>
            <button
                className="blue create-post"
                onClick={() => {
                    setShowCreatePostModal(true);
                }}
            >
                Create Post <FontAwesomeIcon icon="plus-square" />
            </button>
            {showCreatePostModal && (
                <PostModal
                    onCloseButtonClick={() => setShowCreatePostModal(false)}
                    onPostComplete={onPostComplete}
                    threadId={thread?.id ?? -1}
                />
            )}
            {editPost && (
                <PostModal
                    onCloseButtonClick={() => setEditPost(null)}
                    onPostComplete={onPostComplete}
                    threadId={thread?.id ?? -1}
                    editPost={editPost}
                />
            )}
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </main>
    );
};

export default Posts;
