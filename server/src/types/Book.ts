export interface book {
    id: number;
    updateTime: string | null;
    createTime: string;
    beginTime: string | null;
    endTime: string | null;
    //0: unread, 1: in progress, 2: finished
    status: number;
    author: string;
    page: number | null;
    readPage: number | null;
    bookName: string;
    isDelete: number;
    deleteTime: string | null;
    picUrl: string;
    rate: number | null;
}