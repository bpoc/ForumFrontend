import React from "react";
import ReactDOM from "react-dom";
import "../styles/modal.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type ModalProps = {
    children: React.ReactNode;
    showOkButton?: boolean;
    title: string;
    onOkButtonClick?: () => void;
    onCloseButtonClick?: () => void;
    showCloseButton?: boolean;
    className?: string;
};

const ModalForeground = ({
    children,
    showOkButton,
    title,
    onOkButtonClick,
    showCloseButton,
    className,
    onCloseButtonClick,
}: ModalProps) => {
    showCloseButton = showCloseButton ?? false;
    showOkButton = showOkButton ?? false;
    return (
        <div className={`modal-foreground ${className}`}>
            {showCloseButton && (
                <button
                    aria-label="close modal"
                    className="close-modal"
                    onClick={() => {
                        onCloseButtonClick?.();
                    }}
                >
                    <FontAwesomeIcon icon="times-circle" />
                </button>
            )}
            <div className="content">
                <h1>{title}</h1>
                <hr />
                <div className="message">{children}</div>
            </div>

            {showOkButton && (
                <button onClick={onOkButtonClick} className="ok-button blue">
                    Ok
                </button>
            )}
        </div>
    );
};

class Modal extends React.Component {
    state: {parent: Element | null} = {parent: null};
    props: ModalProps;

    constructor(props: ModalProps) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        // const newParent = React.createElement("div", {className: "modal-parent"});
        const newParent = document.createElement("div");
        newParent.classList.add("modal-container");
        this.setState({parent: newParent});
        document.body.classList.add("no-scroll");
        document.body.append(newParent);
        console.log("will mount");
    }

    componentWillUnmount() {
        console.log("unmount");
        if (this.state.parent) {
            document.body.removeChild(this.state.parent);
        }
        document.body.classList.remove("no-scroll");
    }

    render() {
        if (this.state.parent == null) return null;
        return ReactDOM.createPortal(
            <ModalForeground {...this.props}>{this.props.children}</ModalForeground>,
            this.state.parent
        );
    }
}

export default Modal;
