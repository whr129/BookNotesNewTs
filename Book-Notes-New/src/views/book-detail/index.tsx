import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { addNewBookNotes, addNewQuote, deleteBookNote, deleteBookQuote, editBookQuote, getBookInfoById, getBookNotes, queryBookQuotes, updateBookById, updateBookNote } from '../../service/book/book';
import { IcurrentBook, IcurrentBookNotes, IcurrentBookQuote, IcurrentBookUpdateParam, pageParam, StandardRes } from '../../types';
import { Button, Flex, Image, Input, List, Modal, Form, message, Select } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import FormItem from 'antd/es/form/FormItem';

export interface IcurrentPageParam extends pageParam {
    bookId: string | undefined;
}

const BookDetail = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [editNodeForm] = Form.useForm();
    const [rateForm] = Form.useForm();
    const [quoteForm] = Form.useForm();
    const [editQuoteForm] = Form.useForm();
    const { TextArea } = Input;
    const [bookBaseInfo, setBookBaseInfo] = useState<IcurrentBook>({});
    const [isNoteModal, setIsNoteModal] = useState<boolean>(false);
    const [isQuoteModal, setIsQuoteModal] = useState<boolean>(false);
    const [isFinishOpen, setIsFinishOpen] = useState<boolean>(false);
    const [initLoading, setInitLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<IcurrentBookNotes[]>([]);
    const [list, setList] = useState<IcurrentBookNotes[]>([]);
    const [datas, setDatas] = useState<IcurrentBookQuote[]>([]);
    const [lists, setLists] = useState<IcurrentBookQuote[]>([]);
    const [isViewItemQuote, setIsViewItemQuote] = useState<IcurrentBookQuote>({});
    const [quotePageNum, setQuotePageNum] = useState<number>(1);
    const [pageNumber, setPageNumber]= useState<number>(1);
    const [isViewDetailNote, setIsViewDetailNote] = useState<boolean>(false);
    const [isViewDetailQuote, setIsViewDetailQuote] = useState<boolean>(false);
    const [isUpdateProgress, setIsUpdateProgress] = useState<boolean>(false);
    const [isViewItemNote, setIsViewItemNote] = useState<IcurrentBookNotes>({});
    const [isEditNote, setIsEditNode] = useState<boolean>(false);
    const [isEditQuote, setISEditQuote] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const onLoadMore = async () => {
        setLoading(true);
        const param: IcurrentPageParam = {
            bookId: id,
            pageNum: pageNumber + 1,
            pageSize: 3
        };
        const res: StandardRes = await getBookNotes(param);
        setData(res?.data);
        setList(res1 => res1.concat(res?.data));
        setLoading(false);
        setPageNumber(res => res + 1);
      };
    
      const onLoadMoreQuote = async () => {
        setLoading(true);
        const param: IcurrentPageParam = {
            bookId: id,
            pageNum: quotePageNum + 1,
            pageSize: 3
        };
        const res: StandardRes = await queryBookQuotes(param);
        setDatas(res?.data);
        setLists(res1 => res1.concat(res?.data));
        setLoading(false);
        setQuotePageNum(res => res + 1);
      };

      const loadMoreQUote =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={onLoadMoreQuote}>loading more</Button>
        </div>
      ) : null;

      const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={onLoadMore}>loading more</Button>
        </div>
      ) : null;

    const getBaseInfo = async () => {
        const res: StandardRes = await getBookInfoById({id: id});
        setBookBaseInfo(res?.data);
        setInitLoading(false);
    }
    const getBookNote = async () => {
        setPageNumber(1);
        const param: IcurrentPageParam = {
            bookId: id,
            pageNum: 1,
            pageSize: 3
        };
        const res: StandardRes = await getBookNotes(param);
        setList(res.data);
        setData(res.data);
    }

    const getBookQuote = async () => {
        setQuotePageNum(1);
        const param: IcurrentPageParam = {
            bookId: id,
            pageNum: 1,
            pageSize: 3
        };
        const res: StandardRes = await queryBookQuotes(param);
        setLists(res.data);
        setDatas(res.data);
    }
   
    useEffect(() => {
        getBaseInfo();
        getBookNote();
        getBookQuote();
    }, [])
    return (
        <div>
            <Flex>
            <div className={styles.bookInfo}>
                <Flex>
                    <div className={styles.img}>
                        <Image width={250} src={bookBaseInfo.picUrl} />
                    </div>
                </Flex>
                <div className={styles.text}>
                    <div className={styles.title}>{bookBaseInfo.bookName}</div>
                    <div className={styles.author}>Author Name : {bookBaseInfo.author}</div>
                    <div className={styles.author}>Begin Time : {bookBaseInfo.beginTime}</div>
                    {bookBaseInfo.status === 1 && <div className={styles.author}>Read Progress: {bookBaseInfo.readPage ? bookBaseInfo.readPage : 0} / {bookBaseInfo.page ? bookBaseInfo.page : 'Not Recorded'}</div>}
                    {bookBaseInfo.status === 2 && <div className={styles.author}>Rate : {bookBaseInfo.rate? bookBaseInfo.rate : 'not rated'} / 10</div>}
                    {bookBaseInfo.status === 2 && <div className={styles.author}>End Time : {bookBaseInfo.endTime}</div>}
                    <Button style={{marginRight: 5, marginBottom: 10}} type='primary' onClick={() => setIsNoteModal(true)} >Add Book Note</Button>
                    <Button onClick={() => setIsQuoteModal(true)}>Add Book Quote</Button>
                    {bookBaseInfo.status === 1 && <Button type='primary' onClick={() => setIsFinishOpen(true)}>Finish Reading</Button>}
                    {bookBaseInfo.status === 1 && <Button onClick={() => {
                        setIsUpdateProgress(true);
                        if(bookBaseInfo.readPage) {
                            updateForm.setFieldValue('readPage', bookBaseInfo.readPage);
                        }
                        if(bookBaseInfo.page) {
                            updateForm.setFieldValue('page', bookBaseInfo.page);
                        }
                    }}>Update Read Progress</Button>}
                </div>
            </div>
            <div>
             <div className={styles.toDoList}>
                <List
                    header={<div>BOOK NOTES LIST</div>}
                    size="large"
                    loading={initLoading}
                    loadMore={loadMore}
                    bordered
                    dataSource={list}
                    itemLayout={'vertical'}
                    renderItem={(item) => 
                    <List.Item
                        key={item.id}
                        extra={
                            <div>
                                
                                <ButtonGroup>
                                    <Button onClick={() => {
                                        setIsViewItemNote(item);
                                        setIsViewDetailNote(true);
                                    }}>
                                        View
                                    </Button>
                                    <Button onClick={() => {
                                        setIsEditNode(true);
                                        editNodeForm.setFieldValue('content', item.content);
                                        setIsViewItemNote(item);
                                        }}>Edit</Button>
                                    <Button onClick={async () => {
                                        await deleteBookNote({id: item.id});
                                        getBookNote();
                                    }}>Delete</Button>
                                </ButtonGroup>
                            </div>
                        }
                      >
                        <List.Item.Meta
                        //   avatar={<Avatar src={item.avatar} />}
                          title={<div>Last Update: {item.updateTime || item.createDate}</div>}
                          description={<div>Content: {item.content}</div>}
                        />
                        {/* {item.content} */}
                      </List.Item>}
                />
            </div>
            </div>
            <div className={styles.toDoList}>
                <List
                    header={<div>BOOK QUOTES LIST</div>}
                    size="large"
                    loading={initLoading}
                    loadMore={loadMoreQUote}
                    bordered
                    dataSource={lists}
                    itemLayout={'vertical'}
                    renderItem={(item) => 
                    <List.Item
                        key={item.id}
                        extra={
                            <div>
                                
                                <ButtonGroup>
                                    <Button onClick={() => {
                                        setIsViewItemQuote(item);
                                        setIsViewDetailQuote(true);
                                    }}>
                                        View
                                    </Button>
                                    <Button onClick={() => {
                                        setISEditQuote(true);
                                        editQuoteForm.setFieldValue('content', item.content);
                                        editQuoteForm.setFieldValue('review', item.review);
                                        setIsViewItemQuote(item);
                                        }}>Edit</Button>
                                    <Button onClick={async () => {
                                        await deleteBookQuote({id: item.id});
                                        getBookQuote();
                                    }}>Delete</Button>
                                </ButtonGroup>
                            </div>
                        }
                      >
                        <List.Item.Meta
                        //   avatar={<Avatar src={item.avatar} />}
                          title={<div>Last Update: {item.updateTime || item.createDate}</div>}
                          description={<div>Content: {item.content}</div>}
                        />
                        {/* {item.content} */}
                      </List.Item>}
                />
            </div>
            
            </Flex>
            <Modal
                title='Add new Book Note'
                onCancel={() => setIsNoteModal(false)}
                onOk={async () => {
                    const formRes = await form.validateFields();
                    const param: any = {
                        bookId: id,
                        content: formRes?.content ? formRes?.content : '',
                    }
                    const res = await addNewBookNotes(param);
                    message.success(res.data);
                    setIsNoteModal(false);
                    getBookNote();
                }}
                open={isNoteModal}>
                   <Form
                        form={form}>
                        <Form.Item name='content'>
                            <TextArea rows={4}></TextArea>
                        </Form.Item>
                   </Form>
            </Modal>
            <Modal
                title='Add new Book Quote'
                onCancel={() => setIsNoteModal(false)}
                onOk={async () => {
                    const formRes = await quoteForm.validateFields();
                    const param: any = {
                        bookId: id,
                        content: formRes?.content ? formRes?.content : '',
                        review: formRes?.review ? formRes?.review : '',
                    }
                    const res = await addNewQuote(param);
                    message.success(res.data);
                    setIsQuoteModal(false);
                    getBookQuote();
                }}
                open={isQuoteModal}>
                   <Form
                        form={quoteForm}>
                        <Form.Item label='quote' name='content'>
                            <TextArea rows={4}></TextArea>
                        </Form.Item>
                        <Form.Item label='review' name='review'>
                            <TextArea rows={4}></TextArea>
                        </Form.Item>
                   </Form>
            </Modal>
            <Modal
                title='View Book Notes Detail'
                onCancel={() => setIsViewDetailNote(false)}
                onOk={() => setIsViewDetailNote(false)}
                open={isViewDetailNote}>
                   <div>
                        content: {isViewItemNote.content}
                   </div>
            </Modal>
            <Modal
                title='View Book Quote Detail'
                onCancel={() => setIsViewDetailQuote(false)}
                onOk={() => setIsViewDetailQuote(false)}
                open={isViewDetailQuote}>
                   <div>
                        <div>content: {isViewItemQuote.content}</div>
                        <div>review: {isViewItemQuote.review}</div>
                   </div>
            </Modal>
            <Modal
                title='Edit Book Notes Detial'
                onCancel={() => setIsEditNode(false)}
                onOk={async () => {
                    const res = await editNodeForm.validateFields();
                    const param: any = {
                        id: isViewItemNote.id,
                        content: res.content,
                    }
                    await updateBookNote(param);
                    getBookNote()
                    setIsEditNode(false);
                }}
                open={isEditNote}>
                   <Form
                        form={editNodeForm}>
                            <Form.Item
                                name='content'>
                                <TextArea rows={4}></TextArea>
                            </Form.Item>
                   </Form>
            </Modal>
            <Modal
                title='Edit Book Quote Detial'
                onCancel={() => setISEditQuote(false)}
                onOk={async () => {
                    const res = await editQuoteForm.validateFields();
                    const param: any = {
                        id: isViewItemNote.id,
                        content: res.content,
                    }
                    await editBookQuote(param);
                    getBookQuote();
                    setISEditQuote(false);
                }}
                open={isEditQuote}>
                   <Form
                        form={editQuoteForm}>
                            <Form.Item
                                label='content'
                                name='content'>
                                <TextArea rows={4}></TextArea>
                            </Form.Item>
                            <Form.Item
                                label='review'
                                name='review'>
                                <TextArea rows={4}></TextArea>
                            </Form.Item>
                   </Form>
            </Modal>
            <Modal
                title='Record Book Rate'
                open={isFinishOpen}
                onCancel={() => setIsFinishOpen(false)}
                onOk={async () => { 
                    const res: any = await rateForm.validateFields();
                    const { rate } = res;
                    console.log(res);
                    const params: IcurrentBookUpdateParam = {
                        id: id,
                        status: 2,
                        rate: rate,
                    }
                    const startRead = await updateBookById(params);
                    message.success(startRead.data);
                    setIsFinishOpen(false);
                    navigate("/personal-center/book-finish");
                }}>
                    <Form
                        form={rateForm}>
                            <Form.Item
                                name='rate'>
                                <Select options={[
                                    {label: '1', value: 1},
                                    {label: '2', value: 2},
                                    {label: '3', value: 3},
                                    {label: '4', value: 4},
                                    {label: '5', value: 5},
                                    {label: '6', value: 6},
                                    {label: '7', value: 7},
                                    {label: '8', value: 8},
                                    {label: '9', value: 9},
                                    {label: '10', value: 10}]}></Select>
                            </Form.Item>
                    </Form>
            </Modal>
            <Modal
                title='Update Reading Progress'
                open={isUpdateProgress}
                onCancel={() => setIsUpdateProgress(false)}
                onOk={async () => { 
                    const res: any = await updateForm.validateFields();
                    const { page, readPage } = res;
                    console.log(res);
                    const params: IcurrentBookUpdateParam = {
                        id: id,
                        page: page,
                        readPage: readPage,
                    }
                    const startRead = await updateBookById(params);
                    message.success(startRead.data);
                    setIsUpdateProgress(false);
                    getBaseInfo();
                }}>
                    <Form
                        form={updateForm}>
                            <Form.Item
                                label='Page Already Finished'
                                name='readPage'>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item
                                label='Page in Total'
                                name='page'>
                                <Input></Input>
                            </Form.Item>
                    </Form>
            </Modal>
        </div>
    )
}

export default BookDetail;