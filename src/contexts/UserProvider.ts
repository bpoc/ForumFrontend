import {createContext} from "react";
import {CurrentUserInfo} from "../models/Models";

export const UserProvider = createContext<[CurrentUserInfo | null, null | ((cu: CurrentUserInfo | null) => void)]>([
    null,
    null,
]);
