import {User, CurrentUserInfo, Topic, Thread, Post} from "../models/Models";

export type APIError = {
    isError: boolean;
    code: number;
    codeText: string;
    message?: string;
};

const CURRENT_USER_INFO_KEY = "currentUserInfo";

export const getCurrentUserInfoFromLocalStorage = (): CurrentUserInfo | null => {
    const info = localStorage.getItem(CURRENT_USER_INFO_KEY);
    if (info == null) {
        return null;
    }
    const json = JSON.parse(info) as CurrentUserInfo;
    return json;
};

export const setCurrentUserInfoToLocalStorage = (info: CurrentUserInfo) => {
    localStorage.setItem(CURRENT_USER_INFO_KEY, JSON.stringify(info));
};

export const clearCurrentUserInfoFromLocalStorage = () => {
    localStorage.removeItem(CURRENT_USER_INFO_KEY);
};

const getToken = (): string | null => {
    return getCurrentUserInfoFromLocalStorage()?.token.token ?? null;
};

const validateEmail = (email: string) => {
    //eslint-disable-next-line
    if (
        //eslint-disable-next-line
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
            email
        )
    ) {
        return true;
    }
    return false;
};

const convertTimeToCamelCase = (json: any) => {
    if (Array.isArray(json)) {
        json.map((childJson) => convertTimeToCamelCase(childJson));
    }
    for (const key in json) {
        if (Array.isArray(json[key])) {
            convertTimeToCamelCase(json[key]);
        } else if (key === "created_at") {
            json.createdAt = json[key];
        } else if (key === "updated_at") {
            json.updatedAt = json[key];
        }
    }
};

const register = async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.statusText,
        } as APIError;
    }
    return (await response.json()) as User;
};

const login = async (email: string, password: string): Promise<CurrentUserInfo> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 400 ? "Invalid Username and Password" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    return {
        token: {token: result.token.token, expiration: result.token.expires_at},
        user: result.user,
    } as CurrentUserInfo;
};

const getTopics = async (): Promise<Topic[]> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message:
                response.status === 401 ? "Authentication token has expired please log in again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Topic[];
};

const createTopic = async (name: string, description: string): Promise<Topic> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({name, description}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message:
                response.status === 400
                    ? "Something went wrong with the request"
                    : response.status === 401
                    ? "Authorization error. Please login again"
                    : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result as Topic;
};

const editTopic = async (topicId: number, name: string, description: string): Promise<Topic> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics/${topicId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({name, description}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization problem. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result;
};

const getTopic = async (topicId: number): Promise<Topic> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics/${topicId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Topic;
};

const createThread = async (topicId: number, name: string): Promise<Thread> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/threads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({topicId, name}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result as Thread;
};

const editThread = async (threadId: number, name: string): Promise<Thread> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/threads/${threadId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({threadId, name}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Thread;
};

const getThread = async (threadId: number): Promise<Thread> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/threads/${threadId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please Login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    convertTimeToCamelCase(results);
    return results as Thread;
};

const createPost = async (threadId: number, text: string): Promise<Post> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({threadId, text}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result as Post;
};

const editPost = async (postId: number, text: string): Promise<Post> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({text}),
    });
    if (!response.ok) {
        throw {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again." : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    convertTimeToCamelCase(result);
    return result as Post;
};

const API = {
    validateEmail,
    register,
    login,
    getTopics,
    createTopic,
    editTopic,
    getTopic,
    createThread,
    editThread,
    getThread,
    createPost,
    editPost,
};

export default API;
