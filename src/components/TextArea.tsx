import React, {ChangeEvent, FocusEventHandler, TextareaHTMLAttributes} from "react";
import classNames from "classnames";
import "../styles/textarea.scss";

export type TextAreaPropTypes = {
    value: string;
    onChange: (changeEvent: ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: FocusEventHandler;
    error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({value, onChange, onBlur, error, ...others}: TextAreaPropTypes) => {
    return (
        <div className="textarea-field">
            <textarea
                className={classNames({error: !!error})}
                value={value}
                onChange={onChange}
                onBlur={(e) => onBlur?.(e)}
                {...others}
            />
            {error && <div className="input-error">{error}</div>}
        </div>
    );
};

export default TextArea;
