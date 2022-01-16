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

const register = async (email: string, password: string): Promise<User | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (response.ok) {
        return (await response.json()) as User;
    } else {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.statusText,
        } as APIError;
    }
};

const login = async (email: string, password: string): Promise<CurrentUserInfo | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 400 ? "Invalid Username and Password" : response.statusText,
        } as APIError;
    } else {
        const result = await response.json();
        return {
            token: {token: result.token.token, expiration: result.token.expires_at},
            user: result.user,
        } as CurrentUserInfo;
    }
};

const getTopics = async (): Promise<Topic[] | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message:
                response.status === 401 ? "Authentication token has expired please log in again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    //eslint-disable-next-line
    const topicArray: Topic[] = results.map((topic: any) => {
        return {
            ...topic,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at,
        } as Topic;
    });
    return topicArray;
};

const createTopic = async (name: string, description: string): Promise<Topic | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({name, description}),
    });
    if (!response.ok) {
        return {
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
    return {...result, createdAt: result.created_at, updatedAt: result.updated_at} as Topic;
};

const editTopic = async (topicId: number, name: string, description: string): Promise<Topic | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics/${topicId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({name, description}),
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization problem. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    return {
        ...result,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
    } as Topic;
};

const getTopic = async (topicId: number): Promise<Topic | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/topics/${topicId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    results.createdAt = results.created_at;
    results.updatedAt = results.updated_at;
    results.user.createdAt = results.user.created_at;
    results.user.updatedAt = results.user.updated_at;
    //eslint-disable-next-line
    results.threads.map((t: any) => {
        t.createdAt = t.created_at;
        t.updatedAt = t.updated_at;
    });
    return results as Topic;
};

const createThread = async (topicId: number, name: string): Promise<Thread | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/threads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({topicId, name}),
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    return {...result, createdAt: result.created_at, updatedAt: result.updated_at} as Thread;
};

const editThread = async (threadId: number, name: string): Promise<Thread | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/threads/${threadId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({threadId, name}),
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    return {...results, createdAt: results.created_at, updatedAt: results.updated_at} as Thread;
};

const getThread = async (threadId: number): Promise<Thread | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/threads/${threadId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please Login again" : response.statusText,
        } as APIError;
    }
    const results = await response.json();
    results.createdAt = results.created_at;
    results.updatedAt = results.updated_at;
    results.topic.createdAt = results.topic.created_at;
    results.topic.updatedAt = results.topic.updated_at;
    results.user.createdAt = results.user.created_at;
    results.user.updatedAt = results.user.updated_at;
    //eslint-disable-next-line
    results.posts.map((post: any) => {
        post.createdAt = post.created_at;
        post.updatedAt = post.updated_at;
        post.user.createdAt = post.user.created_at;
        post.user.updatedAt = post.user.updated_at;
    });
    return results as Thread;
};

const createPost = async (threadId: number, text: string): Promise<Post | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({threadId, text}),
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again" : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    result.createdAt = result.created_at;
    result.updatedAt = result.updated_at;
    result.user.createdAt = result.user.created_at;
    result.user.updatedAt = result.user.updated_at;
    return result as Post;
};

const editPost = async (postId: number, text: string): Promise<Post | APIError> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({text}),
    });
    if (!response.ok) {
        return {
            isError: true,
            code: response.status,
            codeText: response.statusText,
            message: response.status === 401 ? "Authorization error. Please login again." : response.statusText,
        } as APIError;
    }
    const result = await response.json();
    result.createdAt = result.created_at;
    result.updatedAt = result.updated_at;
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
