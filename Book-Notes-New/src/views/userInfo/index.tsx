import { useEffect, useState } from 'react'
import { Button, Form, Input, message, Space, Row, Col, Divider } from 'antd';
import styles from './index.module.scss';
import axios from 'axios';
import { getUserInfo } from '../../service/user';
import { IcurrentUser } from '../../types';
import SignIn from './components/sign-in';
import { getSignIn, signIn } from '../../service/signIn/signIn';
import moment from 'moment';
import ToDoList from './components/to-do-list';

const UserInfo = () => {
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState<IcurrentUser|null>();
    const [signInText, setSignInText] = useState<string>(' Sign In ');
    const getUserProfile = async () => {
        const UserInfo = await getUserInfo();
        setUserInfo(UserInfo.data);
    }
    const getSignInData = async (month: string) => {
        const res = await getSignIn({monthSelected: month});
        if(res.data.length > 0) {
            setSignInText(' Already Signed In');
        }
    }
    useEffect(() => {
        getUserProfile();
        getSignInData(moment().format('YYYY-MM-DD'));
    }, [])
    const handleSignIn = async () => {
        if(signInText !== ' Sign In ') {
            return ;
        }
        const signInRes = await signIn();
        getSignInData(moment().format('YYYY-MM-DD'))
        message.success(signInRes.data);
    }
    return (
        <div className={styles.logIn}>
            <Divider orientation="left" style={{fontSize: 30}}>User Info</Divider>
           <div>
                <Row>
                    <Col span={6}>
                        User Name: {userInfo?.userName}
                    </Col>
                    <Col span={6}>
                        Email: {userInfo?.email}
                    </Col>
                    <Col span={6}>
                        Phone Numer: {userInfo?.phoneNumber}
                    </Col>
                </Row>
           </div>
           <div className={styles.centerBox}>
                <div className={styles.signIn}>
                        <div>Sign In</div>
                        <Button onClick={handleSignIn}>{signInText}</Button>
                        <SignIn />
                </div>
                <div className={styles.signIn}>
                    <div className={styles.toDoList}>To Do List</div>
                    <ToDoList/>
                </div>
           </div>
        </div>
    )
}

export default UserInfo;