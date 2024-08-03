import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Space, Row, Col, Divider, Modal, Card, Pagination, Image } from 'antd';
import styles from './index.module.scss';
import axios from 'axios';
import FormItem from 'antd/es/form/FormItem';
import Meta from 'antd/es/card/Meta';
import type { PaginationProps } from 'antd';
import { updateBookById } from '../../../../service/book/book';
import { IcurrentBookParam, IcurrentBookUpdateParam } from '../../../../types';

const AddNewUnRead = (props: any) => {
    const { isOpen, setIsOpen, onOpenItem, onSearch } = props;
    const [modalForm] = Form.useForm();
    const handleOk = async () => {
        const res: any = modalForm.validateFields();
        const { page, readPage } = res;
        const params: IcurrentBookUpdateParam = {
            id: onOpenItem.id,
            status: 1,
            page: page,
            readPage: readPage,
            rate: null,
        }
        const startRead = await updateBookById(params);
        message.success(startRead.data);
        setIsOpen(false);
        onSearch();
    }

    return (
        <Modal 
            width={600}
            open={isOpen}
            title='Start Reading'
            onCancel={() => {
                setIsOpen(false);
            }}
            onOk={handleOk}>
            <div className={styles.wrap}>
            <div className={styles.bookCard}>
                <Row>
                    <Image src={onOpenItem.picUrl} height={300} className={styles.img}/>
                </Row>
                <Row className={styles.label}>
                    Book Name: {onOpenItem.bookName}
                </Row>
                <Row className={styles.label}>
                    Author Name: {onOpenItem.author}
                </Row>
            </div>
            <div>
            <Form 
                className={styles.form}
                form={modalForm}
                title='Start Reading'>
                <Row>
                <Col span={8}>
                    <Form.Item
                        className={styles.formItem}
                        label='Total Page'
                        name='page'>
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item
                        className={styles.formItem}
                        label='Page Already Read'
                        name='readPage'>
                        <Input></Input>
                    </Form.Item>
                </Col>
                </Row>
            </Form>
           
            </div>
            
            </div>
        </Modal>
    )
}

export default AddNewUnRead;