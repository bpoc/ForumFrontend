import React, {useCallback, useState, FocusEvent, useContext, useMemo, FormEvent} from "react";
import Input from "../components/Input";
import API, {APIError, setCurrentUserInfoToLocalStorage} from "../api/API";
import {UserProvider} from "../contexts/UserProvider";
import {Link, useNavigate} from "react-router-dom";
import NetworkErrorModal from "../components/NetworkErrorModal";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [networkError, setNetworkError] = useState<APIError | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentUserInfo, setCurrentUserInfo] = useContext(UserProvider);
    const navigate = useNavigate();

    const onEmailBlur = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
            if (!API.validateEmail(e.target.value)) {
                setEmailError("Invalid Email");
            } else {
                setEmailError("");
            }
        },
        [setEmailError]
    );

    const submitForm = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            const result = await API.login(email, password);
            if ("isError" in result) {
                setNetworkError(result);
            } else {
                setCurrentUserInfoToLocalStorage(result);
                setCurrentUserInfo?.(result);
                navigate("/topics");
            }
        },
        [email, navigate, password, setCurrentUserInfo]
    );

    const loginDisabled = useMemo(() => {
        if (email.length > 0 && API.validateEmail(email) && password.length > 0) {
            return false;
        }
        return true;
    }, [email, password]);

    return (
        <main className="registration container-with-shadow">
            <h1>Login!</h1>
            <hr />
            <p>Sign-in to start your journey</p>
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
                        required={true}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>

                <button disabled={loginDisabled} className="blue">
                    Login
                </button>
            </form>
            <div className="register-here">
                Don't have an account?{" "}
                <Link to="/register" className="dark">
                    Register here.
                </Link>
            </div>
            {networkError && <NetworkErrorModal networkError={networkError} setNetworkError={setNetworkError} />}
        </main>
    );
};

export default Login;
