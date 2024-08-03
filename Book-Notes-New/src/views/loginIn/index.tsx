import { useState } from "react";
import { Button, Form, Input, message, Space } from 'antd';
import axios from "axios";
import styles from './index.module.scss';
import { IcurrentUser } from "../../types";
import { logInAccount } from "../../service/user";
import { setCookie } from "typescript-cookie";
import { Navigate, useNavigate } from "react-router-dom";

const LoginIn = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleClick = async () => {
        const res: IcurrentUser = await form.validateFields();
        const loginInRes = await logInAccount(res);
        console.log(loginInRes?.data?.accessToken);
        setCookie('token', loginInRes?.data?.accessToken , { expires: loginInRes?.data?.expireTime });
        message.success('Register Success');
        navigate('/personal-center/user-info');
    }
    return (
        <div className={styles.logIn}>
            <div className={styles.title}>Login In</div>
            <div className={styles.form}>
                <div className={styles.form_div}>
                    <Form
                        form={form}
                        layout="vertical">
                        <Form.Item label='User Name' name='userName'>
                            <Input placeholder="please enter user name"></Input>
                        </Form.Item>
                        <Form.Item label='Password' name='password'>
                            <Input placeholder="please enter password"></Input>
                        </Form.Item>
                    </Form>
                    <div>
                    <Button onClick={handleClick}>
                        Log In
                    </Button>
                    <div className={styles.link}>
                    <a href="/register">
                        Register
                    </a>
                    </div>
                </div>
                </div>
                
            </div>
        </div>
    )
}

export default LoginIn;