import { pureFetch } from "../fetch";
import { IcurrentToDo, IcurrentUser, StandardRes } from "../../types";

export const addNewToDo = (data: IcurrentToDo) => 
    pureFetch.post<void, StandardRes>('/addNewToDo', data);
export const getToDoList = () => 
    pureFetch.post<void, StandardRes>('/getToDoList');
export const finishTodo = (data: any) => 
    pureFetch.post<void, StandardRes>('/finishToDo', data);
export const updateToDo = (data: IcurrentToDo) => 
    pureFetch.post<void, StandardRes>('/updateToDoItem', data);


