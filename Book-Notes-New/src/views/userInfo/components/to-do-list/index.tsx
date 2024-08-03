import React, { useEffect, useState } from 'react';
import { Button, Divider, List, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { IcurrentSchedule } from '../../../../types';
import { getToDoList } from '../../../../service/toDoList/toDoList';
import styles from './index.module.scss';

const ToDoList = () => {
    const [data, setData] = useState<Array<IcurrentSchedule>>([]);

    const getToDoListData = async () => {
        const toDoData = await getToDoList();
        setData(toDoData.data);
      }
    
    useEffect(() => {
    getToDoListData();
    }, [])
    return (
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
                // extra={
                //     // <div>
                        
                //     //     <ButtonGroup>
                //     //         <Button>Edit</Button>
                //     //         <Button onClick={() => {
                //     //             onFinish(item.id);
                //     //         }}>Finish</Button>
                //     //     </ButtonGroup>
                //     // </div>
                // }
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
    )
}

export default ToDoList;