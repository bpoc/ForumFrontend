import React, {FormEvent, useMemo, useState} from "react";
import Modal from "./Modal";
import Input from "./Input";
import "../styles/new_topic_modal.scss";
import TextArea from "./TextArea";
import API, {APIError} from "../api/API";
import {Topic} from "../models/Models";
import NetworkErrorModal from "./NetworkErrorModal";

type TopicModalProps = {
    onCloseButtonClick: () => void;
    onTopicComplete: (topic: Topic) => void;
    editTopic?: Topic;
};

const TopicModal = ({onCloseButtonClick, onTopicComplete, editTopic}: TopicModalProps) => {
    const [name, setName] = useState(editTopic?.name ?? "");
    const [description, setDescription] = useState(editTopic?.description ?? "");
    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [networkError, setNetworkError] = useState<APIError | null>(null);

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        let response;
        if (editTopic) {
            response = await API.editTopic(editTopic.id, name, description);
        } else {
            response = await API.createTopic(name, description);
        }
        if ("isError" in response) {
            setNetworkError(response);
        } else {
            onTopicComplete(response);
        }
    };

    const isDisabled = useMemo(() => {
        if (name.length < 5) return true;
        if (description.length < 5) return true;
        return false;
    }, [name, description]);

    return (
        <Modal
            showCloseButton={true}
            title={editTopic ? "Edit Topic" : "New Topic"}
            className="new-topic"
            onCloseButtonClick={onCloseButtonClick}
        >
            <form onSubmit={submitForm}>
                <label htmlFor="new_thread_name">Name</label>
                <Input
                    id="new_thread_name"
                    value={name}
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    error={nameError}
                    onBlur={() => {
                        if (name.length < 5) {
                            setNameError("Must be at least 5 characters");
                        } else {
                            setNameError("");
                        }
                    }}
                />
                <label htmlFor="new_thread_description">Description</label>
                <TextArea
                    id="new_thread_description"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                    error={descriptionError}
                    onBlur={() => {
                        if (description.length < 5) {
                            setDescriptionError("Must be at least 5 characters");
                        } else {
                            setDescriptionError("");
                        }
                    }}
                />
                <button disabled={isDisabled} className="blue">
                    {editTopic && "Edit"}
                    {!editTopic && "Create"}
                </button>
            </form>
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </Modal>
    );
};

export default TopicModal;
