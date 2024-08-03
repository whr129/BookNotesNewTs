
export interface bookQuote {
    id: number;
    bookId: number;
    content: string | null;
    review: string | null;
    createDate: string;
    updateTime: string | null;
    isDelete: number;
    deleteTime: string | null;
}