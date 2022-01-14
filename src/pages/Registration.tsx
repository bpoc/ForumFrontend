import React, {FormEvent, useState, FocusEvent, useMemo} from "react";
import "../styles/registration.scss";
import Input from "../components/Input";
import API, {APIError} from "../api/API";
import Modal from "../components/Modal";
import {Link, useNavigate} from "react-router-dom";
import NetworkErrorModal from "../components/NetworkErrorModal";

const Registration = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    const navigate = useNavigate();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        const response = await API.register(email, password);
        if ("isError" in response) {
            setNetworkError(response);
        } else {
            navigate("/login");
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onEmailBlur = (e: FocusEvent) => {
        if (!API.validateEmail(email)) {
            setEmailError("Invalid Email");
        } else {
            setEmailError("");
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onPasswordBlur = (e: FocusEvent<Element>) => {
        if (password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword) {
            setPasswordError("Passwords Do Not Match");
            setConfirmPasswordError("Passwords Do Not Match");
        } else {
            setPasswordError("");
            setConfirmPasswordError("");
        }
    };

    const registrationDisabled = useMemo(() => {
        if (API.validateEmail(email) && password.length > 0 && password == confirmPassword) {
            return false;
        }
        return true;
    }, [email, password, confirmPassword]);

    return (
        <main className="registration container-with-shadow">
            <h1>Sign Up!</h1>
            <hr />
            <p>Become an exclusive member of the Forum Frontend</p>
            <form onSubmit={submitForm}>
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <Input
                        type="email"
                        value={email}
                        error={emailError}
                        required={true}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        onBlur={onEmailBlur}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <Input
                        type="password"
                        value={password}
                        error={passwordError}
                        required={true}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        onBlur={onPasswordBlur}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        error={confirmPasswordError}
                        required={true}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                        onBlur={onPasswordBlur}
                    />
                </div>

                <button disabled={registrationDisabled} className="blue">
                    Register
                </button>
            </form>
            <div className="register-here">
                Already have an account?{" "}
                <Link to="/login" className="dark">
                    Login here.
                </Link>
            </div>
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </main>
    );
};

export default Registration;
