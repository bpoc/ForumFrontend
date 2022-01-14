import React from "react";
import Modal from "./Modal";
import {APIError} from "../api/API";
import {useNavigate} from "react-router-dom";

export type NetworkErrorModalProps = {
    networkError: APIError;
    setNetworkError: (networkError: APIError | null) => void;
};

const NetworkErrorModal = ({networkError, setNetworkError}: NetworkErrorModalProps) => {
    const navigate = useNavigate();
    return (
        <Modal
            title="Network Error"
            showOkButton={true}
            onOkButtonClick={() => {
                if (networkError.code === 401) {
                    navigate("/login");
                }
                setNetworkError(null);
            }}
        >
            {networkError.message ?? networkError.codeText}
        </Modal>
    );
};

export default NetworkErrorModal;
