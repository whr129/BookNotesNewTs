import { pureFetch } from "../fetch";
import { IcurrentUser, StandardRes } from "../../types";
import qs from "qs";

export const registerAccount = (data: IcurrentUser) => 
    pureFetch.post<void, StandardRes>('/register', data);

export const logInAccount = (data: IcurrentUser) => 
    pureFetch.post<void, StandardRes>('/logIn', data);

export const getUserInfo = () => 
    pureFetch.post<void, StandardRes>('/getUserInfo');