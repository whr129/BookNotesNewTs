import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Space, Row, Col, Divider, Modal, Card, Pagination } from 'antd';
import styles from './index.module.scss';
import axios from 'axios';
import FormItem from 'antd/es/form/FormItem';
import Meta from 'antd/es/card/Meta';
import type { PaginationProps } from 'antd';
import { addNewBook, queryBookData } from '../../service/book/book';
import { IcurrentBook, IcurrentBookParam } from '../../types';

const AddNew = (props: any) => {
    const { isOpen, setIsOpen } = props;
    const [bookData, setBookData] = useState<Array<any>>([]);
    const [modalForm] = Form.useForm();
    const [totalNum, setTotalNum] = useState()
    const handleSearch = async () => {
        const searchData = modalForm.getFieldsValue();
        const { author, bookName } = searchData;
        const titleParam: string = bookName ? 'title=' + bookName.split(' ').join('+') : '';
        const authorParam: string = author ? 'author=' + author.split(' ').join('+') : '';
        const queryParam: string = '?' + (titleParam !== '' ? titleParam : '')
        + (authorParam !== '' ? '&' + authorParam: '');
        console.log(`https://openlibrary.org/search.json${queryParam}`);
        const res: Response = await axios.get(`https://openlibrary.org/search.json${queryParam}&page=1&limit=10`);
        const bookDatas = res?.data.docs.map((item: any, index: number) => {
            const cover = `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`;
            return {
                ...item,
                picUrl: cover,
            }
        })
        console.log(bookDatas);
        setTotalNum(res?.data.numFound);
        setBookData(bookDatas);
    }
    const onShowSizeChange : PaginationProps['onShowSizeChange'] = async (current, pageSize) => {
        
        console.log(current, pageSize);
        const searchData = modalForm.getFieldsValue();
        const { author, bookName } = searchData;
        const titleParam: string = bookName ? 'title=' + bookName.split(' ').join('+') : '';
        const authorParam: string = author ? 'author=' + author.split(' ').join('+') : '';
        const queryParam: string = '?' + (titleParam !== '' ? titleParam : '')
        + (authorParam !== '' ? '&' + authorParam: '');
        const res: Response = await axios.get(`https://openlibrary.org/search.json${queryParam}&page=${current}&limit=${pageSize}`);
        const bookDatas = res?.data.docs.map((item: any, index: number) => {
            const cover = `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`;
            return {
                ...item,
                picUrl: cover,
            }
        })
        console.log(bookDatas);
        setTotalNum(res?.data.numFound);
        setBookData(bookDatas);
      };

      const handleAdd = async (item: any) => {
        const param: any = {
            author: item.author_name? item.author_name[0] : 'unknow',
            picUrl: item.picUrl,
            bookName: item.title,
        }
        const res = await addNewBook(param);
        message.success(res.data);
      }
        
    
    return (
        // <Modal 
        //     width={1000}
        //     height={500}
        //     open={isOpen}
        //     title='Add New Book'
        //     onCancel={() => {
        //         setIsOpen(false);
        //     }}>
            <div className={styles.wrap}>
            <div>
            <Form 
                className={styles.form}
                form={modalForm}>
                <Row>
                <Col span={8}>
                    <Form.Item
                        className={styles.formItem}
                        label='Author'
                        name='author'>
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item
                        className={styles.formItem}
                        label='Book Name'
                        name='bookName'>
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Button type='primary' onClick={handleSearch}>search</Button>
                </Row>
            </Form>
           
            </div>
            <div className={styles.cardList}>
            {bookData && bookData.map((item: any, index: number) => {
                return (
                    <Card
                        hoverable
                        style={{width: 180, height: 295, margin: "20px 10px 5px 20px" }} //flex: "1 0 calc(100% / 6)"</div></div>
                        // style={{ width: 200, height: 100}}
                        cover={<img alt="example" width='160' height='170' style={{margin: '0px 0px 0px 0px'}} src={item.picUrl ? item.picUrl : ''} />}
                    >
                        <Meta title={item.title} description={
                            <div>
                                <div className={styles.author}>{item.author_name? item.author_name[0] : 'unknow'}</div>
                                <div>
                                    <Button className={styles.button} type='primary' size='small' onClick={() => handleAdd(item)}>Add To Unread</Button>
                                </div>
                            </div>} />
                    </Card>)
            })}
            <Pagination
            style={{position:'fixed', bottom: 20}}
                showSizeChanger
                // onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={totalNum}
                onChange={onShowSizeChange}
                // disabled
            />
            </div>
            </div>
        // </Modal>
    )
}

export default AddNew;