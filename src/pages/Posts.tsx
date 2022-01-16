import React, {useCallback, useContext, useEffect, useState} from "react";
import {Post, Thread} from "../models/Models";
import {Link, useNavigate, useParams} from "react-router-dom";
import API, {APIError} from "../api/API";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../styles/posts.scss";
import {DateTime} from "luxon";
import {UserProvider} from "../contexts/UserProvider";
import PostModal from "../components/PostModal";
import NetworkErrorModal from "../components/NetworkErrorModal";
import Breadcrumbs from "../components/Breadcrumbs";

const Posts = () => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    const [currentUserInfo] = useContext(UserProvider);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [editPost, setEditPost] = useState<Post | null>(null);
    const {threadId} = useParams();
    const navigate = useNavigate();

    const getThread = useCallback(() => {
        API.getThread(parseInt(threadId ?? "-1"))
            .then((response) => {
                setThread(response);
            })
            .catch((e) => {
                if ((e as APIError).code === 404) {
                    navigate("/404");
                    return;
                }
                setNetworkError(e as APIError);
            });
    }, [threadId]);

    useEffect(() => {
        getThread();
    }, [getThread]);

    const onPostComplete = () => {
        setShowCreatePostModal(false);
        setEditPost(null);
        getThread();
    };

    return (
        <main className="posts-page">
            <Breadcrumbs
                links={[
                    {name: "Home", path: "/"},
                    {name: "Topics", path: "/topics"},
                    {name: thread?.topic?.name ?? "", path: `/topics/${thread?.topic?.id}`},
                ]}
            />
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
