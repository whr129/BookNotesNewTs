import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Space, Row, Col, Divider, Pagination, Card, PaginationProps, Flex } from 'antd';
import styles from './index.module.scss';
import axios from 'axios';
import { deleteBookById, queryBookData } from '../../service/book/book';
import { IcurrentBook, IcurrentBookParam, StandardRes } from '../../types';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';

const BookFinished = () => {
    const [addNewBookModal, setAddNewBookModal] = useState<boolean>(false);
    const [totalNum, setTotalNum] = useState<number>(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [bookData, setBookData] = useState<Array<IcurrentBook>>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSizeNum, setPageSizeNum] = useState<number>(10);
    const [onOpenItem, setOnOpenItem] = useState<any>({});
    const handleSearch = async (pageNum: number, pageSize: number) => {
        const res = await form.validateFields();
        const { author, bookName } = res;
        const param: IcurrentBookParam = {
            author: author,
            bookName: bookName,
            status: 2,
            pageNum: pageNum,
            pageSize: pageSize,
        }
        const bookDatas: StandardRes = await queryBookData(param);
        setBookData(bookDatas?.data.bookList);
        setTotalNum(bookDatas?.data?.total);
    }

    const onShowSizeChange : PaginationProps['onShowSizeChange'] = async (current: number, pageSize: number) => {
        
        console.log(current, pageSize);
        const searchData = form.getFieldsValue();
        const { author, bookName } = searchData;
        const param: IcurrentBookParam = {
            author: author,
            bookName: bookName,
            status: 2,
            pageNum: current,
            pageSize: pageSize,
        }
        setPageNumber(current);
        setPageSizeNum(pageSize);
        const bookDatas: StandardRes = await queryBookData(param);
        setBookData(bookDatas?.data.bookList);
        setTotalNum(bookDatas?.data?.total);
      };

    const handleDelete = async (id: string) => {
        const res = await deleteBookById({id: id});
        message.success(res.data);
        handleSearch(pageNumber, pageSizeNum);
    }

    useEffect(() => {
        handleSearch(pageNumber, pageSizeNum);
    }, [])
    return (
        <div>
            <Divider orientation="left" style={{fontSize: 30}}>Books Finished</Divider>
            <div className={styles.wrap}>
                <div>
                <Form
                    className={styles.form}
                    form={form}>
                    <Row>
                    <Col span={8}>
                    <Form.Item className={styles.formItem} label='bookName' name='bookName'>
                        <Input></Input>
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                    <Form.Item className={styles.formItem} label='author' name='author'>
                        <Input></Input>
                    </Form.Item>
                    </Col>
                    <Button type='primary' onClick={() => handleSearch(pageNumber, pageSizeNum)}>search</Button>
                    </Row>
                </Form>
                </div>
                {/* <div>
                    <Button type='primary' onClick={() => setAddNewBookModal(true)}>Add New Book</Button>
                </div> */}
                <div className={styles.cardList}>
                    {bookData && bookData.map((item: any, index: number) => {
                            return (
                                <Card
                                    hoverable
                                    style={{width: 160, height: 265, margin: "10px 10px 5px 20px" }} //flex: "1 0 calc(100% / 6)"</div></div>
                                    // style={{ width: 200, height: 100}}
                                    cover={<img alt="example" width='120' height='140' style={{margin: '0px 0px 0px 0px'}} src={item.picUrl ? item.picUrl : ''} />}
                                    onClick={() => {
                                        // navigate('/personal-center/book-detail/' + item.id);
                                    }}                                
                                >
                                <Meta title={item.bookName} description={
                            <div>
                                <div className={styles.author}>{item.author? item.author : 'unknow'}</div>
                                <div>
                                    <Flex gap='small'>
                                    <Button className={styles.button} type='primary' size='small' onClick={() => {
                                        navigate('/personal-center/book-detail/' + item.id);
                                    }}>View</Button>
                                    <Button className={styles.button} type='primary' size='small' onClick={() => {
                                        handleDelete(item.id);
                                    }}>Delete</Button>
                                    </Flex>
                                </div>
                            </div>} />
                            </Card>)
                    })}
                </div>
                
                <Pagination
                    style={{position:'fixed', bottom: 15}}
                    showSizeChanger
                    // onShowSizeChange={onShowSizeChange}
                    defaultCurrent={1}
                    total={totalNum}
                    onChange={onShowSizeChange}
            />
            </div>
            {/* <AddNewUnRead isOpen={addNewBookModal} setIsOpen={setAddNewBookModal} onOpenItem={onOpenItem} onSearch={handleSearch(pageNumber, pageSizeNum)}/> */}
        </div>
    )
}

export default BookFinished;