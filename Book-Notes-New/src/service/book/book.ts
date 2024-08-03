import { pureFetch } from "../fetch";
import { IcurrentUser, StandardRes } from "../../types";

export const addNewBook = (data: any) => 
    pureFetch.post<void, StandardRes>('/addNewBook', data);
export const queryBookData = (data: any) => 
    pureFetch.post<void, StandardRes>('/queryBookData', data);
export const deleteBookById = (data: any) => 
    pureFetch.post<void, StandardRes>('/deleteBook', data);
export const updateBookById = (data: any) => 
    pureFetch.post<void, StandardRes>('/updateBook', data);
export const getBookInfoById = (data: any) => 
    pureFetch.post<void, StandardRes>('/getBookInfo', data);

export const addNewBookNotes = (data: any) => 
    pureFetch.post<void, StandardRes>('/addBookNotes', data);
export const getBookNotes = (data: any) => 
    pureFetch.post<void, StandardRes>('/getBookNotes', data);
export const deleteBookNote = (data: any) => 
    pureFetch.post<void, StandardRes>('/deleteBookNote', data);
export const updateBookNote = (data: any) => 
    pureFetch.post<void, StandardRes>('/updateBookNote', data);

export const addNewQuote = (data: any) => 
    pureFetch.post<void, StandardRes>('/addNewQuote', data);
export const queryBookQuotes = (data: any) => 
    pureFetch.post<void, StandardRes>('/queryBookQuotes', data);
export const deleteBookQuote = (data: any) => 
    pureFetch.post<void, StandardRes>('/deleteBookQuote', data);
export const editBookQuote= (data: any) => 
    pureFetch.post<void, StandardRes>('/editBookQuote', data);

