import React, { useEffect, useState } from 'react';
import { Divider, List, Typography, Form, Input, DatePicker, Space, Button, message, Modal } from 'antd';
import styles from './index.module.scss';
import type { DatePickerProps } from 'antd';
import { addNewToDo, finishTodo, getToDoList, updateToDo } from '../../service/toDoList/toDoList';
import moment from 'moment';
import ButtonGroup from 'antd/es/button/button-group';
import { IcurrentSchedule } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

const ToDoListPage = () => {
    const [data, setData] = useState<Array<IcurrentSchedule>>([]);
      const [form] = Form.useForm();
      const [modalform] = Form.useForm();
      const { TextArea } = Input;
      const [isEditModal, setIsEditModal] = useState<boolean>(false);

      const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
      };

      const getToDoListData = async () => {
        const toDoData = await getToDoList();
        setData(toDoData.data);
      }

      const onSubmit = async () => {
        const formRes = await form.validateFields();
        const res = await addNewToDo({
            title: formRes.title,
            content: formRes.content,
            dueDate: formRes && formRes.dueDate ? formRes.dueDate.format('YYYY-MM-DD') :
                moment().format('YYYY-MM-DD'),
        });
        getToDoListData();
        message.success(res.data);
      }

      const onFinish = async(id: string) => {
        const res = await finishTodo({id: id});
        console.log(res);
        getToDoListData();
      }

      const handleOk = async () => {
        const res = await modalform.validateFields();
        const updateRes = await updateToDo({
            ...res,
            dueDate: res.dueDate.format('YYYY-MM-DD'),
        });
        message.success(updateRes.data);
        setIsEditModal(false);
        getToDoListData();
      }
      
      useEffect(() => {
        getToDoListData();
      }, [])
    return (
        <div > 
            <Divider orientation="left" style={{fontSize: 30}}>To Do List</Divider>
            <div className={styles.flexDis}>
            <div className={styles.newToDoForm}>
                <div className={styles.title}>New To Do Item</div>
                <Form
                    form={form} 
                    layout="vertical"
                    >
                    <Form.Item label='Title' name='title'>
                        <Input placeholder="please enter title"></Input>
                    </Form.Item>
                    <Form.Item label='Due Date' name='dueDate'>
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                    <Form.Item label='content' name='content'>
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
                <Button onClick={onSubmit}>Submit</Button>
            </div>
            <div className={styles.toDoList}>
                <List
                    header={<div>TO DO LIST</div>}
                    size="large"
                    bordered
                    dataSource={data}
                    itemLayout={'vertical'}
                    renderItem={(item) => 
                    <List.Item
                        key={item.title}
                        extra={
                            <div>
                                
                                <ButtonGroup>
                                    <Button onClick={() => {
                                        setIsEditModal(true);
                                        const dueDate = dayjs(item.dueDate);
                                        modalform.setFieldValue('title', item.title);
                                        modalform.setFieldValue('dueDate', dueDate);
                                        modalform.setFieldValue('content', item.content);
                                        modalform.setFieldValue('id', item.id);
                                        }}>Edit</Button>
                                    <Button onClick={() => {
                                        onFinish(item.id);
                                    }}>Finish</Button>
                                </ButtonGroup>
                            </div>
                        }
                      >
                        <List.Item.Meta
                        //   avatar={<Avatar src={item.avatar} />}
                          title={<div>{item.title} {item.overDue && <span style={{color: 'red', fontSize: 14, fontWeight: '400'}}>OverDue</span>}</div>}
                          description={<div>Due Date: {item.dueDate}</div>}
                        />
                        {item.content}
                      </List.Item>}
                />
            </div>
            </div>
            {isEditModal && 
            <Modal 
                open={isEditModal}
                title='Edit TO DO Item'
                onCancel={() => setIsEditModal(false)}
                onOk={handleOk}>
                <Form
                    form={modalform} 
                    layout="vertical"
                    >
                    <Form.Item label='Title' name='title'>
                        <Input placeholder="please enter title"></Input>
                    </Form.Item>
                    <Form.Item label='Due Date' name='dueDate'>
                        <DatePicker onChange={onChange} />
                    </Form.Item>
                    <Form.Item label='content' name='content'>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name='id' hidden>

                    </Form.Item>
                </Form>
            </Modal>}
        </div>
        
    )
}

export default ToDoListPage;