import React, {FormEvent, useCallback, useMemo, useState} from "react";
import {Post} from "../models/Models";
import Modal from "./Modal";
import TextArea from "./TextArea";
import "../styles/new_post_modal.scss";
import API, {APIError} from "../api/API";
import NetworkErrorModal from "./NetworkErrorModal";

export type PostModalProps = {
    onCloseButtonClick: () => void;
    onPostComplete: ((post: Post) => void) | (() => void);
    threadId: number;
    editPost?: Post;
};

const PostModal = ({onCloseButtonClick, onPostComplete, editPost, threadId}: PostModalProps) => {
    const [text, setText] = useState(editPost?.text ?? "");
    const [textError, setTextError] = useState("");
    const [networkError, setNetworkError] = useState<APIError | null>(null);

    const isDisabled = useMemo(() => {
        if (text.length < 5) {
            return true;
        }
        return false;
    }, [text]);

    const onTextBlur = useCallback(() => {
        if (isDisabled) {
            setTextError("Must be at least 5 characters");
        } else {
            setTextError("");
        }
    }, [isDisabled]);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            let response;
            if (editPost) {
                response = await API.editPost(editPost.id, text);
            } else {
                response = await API.createPost(threadId, text);
            }
            onPostComplete(response);
        } catch (e) {
            setNetworkError(e as APIError);
        }
    };

    return (
        <Modal
            title={editPost ? "Edit Post" : "Create Post"}
            onCloseButtonClick={onCloseButtonClick}
            className="post-modal"
        >
            <form className="create-post-container" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="create_post_textarea">Text</label>
                    <TextArea
                        id="create_post_textarea"
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                        onBlur={onTextBlur}
                        error={textError}
                    />
                </div>
                <button className="blue" disabled={isDisabled}>
                    {editPost ? "Update" : "Create"}
                </button>
            </form>
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </Modal>
    );
};

export default PostModal;
