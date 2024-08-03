import { pureFetch } from "../fetch";
import { IcurrentUser, StandardRes } from "../../types";

export const signIn = () => 
    pureFetch.post<void, StandardRes>('/signIn');
export const getSignIn = (data: any) => {
    return pureFetch.post<void, StandardRes>('/getSignIn', data);
}

   