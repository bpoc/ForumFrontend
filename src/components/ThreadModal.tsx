import React, {FormEvent, useMemo, useState} from "react";
import {Thread} from "../models/Models";
import Modal from "./Modal";
import Input from "./Input";
import "../styles/new_thread_modal.scss";
import API, {APIError} from "../api/API";
import NetworkErrorModal from "./NetworkErrorModal";

export type ThreadModalProps = {
    onCloseButtonClick: () => void;
    onThreadComplete: ((thread: Thread) => void) | (() => void);
    topicId: number;
    editThread?: Thread;
};

const ThreadModal = ({onCloseButtonClick, onThreadComplete, editThread, topicId}: ThreadModalProps) => {
    const [name, setName] = useState(editThread?.name ?? "");
    const [nameError, setNameError] = useState("");
    const [networkError, setNetworkError] = useState<APIError | null>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            let response;
            if (editThread) {
                response = await API.editThread(editThread.id, name);
            } else {
                response = await API.createThread(topicId, name);
            }
            onThreadComplete(response);
        } catch (e) {
            setNetworkError(e as APIError);
        }
    };

    const onNameBlur = () => {
        if (isDisabled) {
            setNameError("must be at least 5 characters");
        } else if (nameError) {
            setNameError("");
        }
    };

    const isDisabled = useMemo(() => {
        if (name.length < 5) return true;
        return false;
    }, [name]);

    return (
        <Modal title={editThread ? "Edit Thread" : "Create Thread"} onCloseButtonClick={onCloseButtonClick}>
            <form className="edit-thread-container" onSubmit={onSubmit}>
                <div className="label-input-container">
                    <label htmlFor="edit_thread_name">Name</label>
                    <Input
                        value={name}
                        type="text"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        error={nameError}
                        onBlur={onNameBlur}
                    />
                </div>
                <button disabled={isDisabled} className="blue create-thread-button">
                    {editThread ? "Update" : "Create"}
                </button>
            </form>
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </Modal>
    );
};

export default ThreadModal;
