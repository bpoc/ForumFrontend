import React, {ChangeEvent, FocusEventHandler, InputHTMLAttributes} from "react";
import classNames from "classnames";
import "../styles/input.scss";

export type InputPropTypes = {
    value: string;
    type: string;
    onChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: FocusEventHandler;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({value, type, onChange, onBlur, error, ...others}: InputPropTypes) => {
    return (
        <div className="input-field">
            <input
                type={type}
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

export default Input;
