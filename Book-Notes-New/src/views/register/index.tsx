import { useState } from 'react'
import { Button, Form, Input, message, Space } from 'antd';
import styles from './index.module.scss';
import axios from 'axios';
import { registerAccount } from '../../service/user';
import { IcurrentUser } from '../../types';

const Register = () => {
    const [form] = Form.useForm();
    const handleRegister = async () => {
        const res: IcurrentUser = await form.validateFields();
        const registerRes = await registerAccount(res);
        message.success(registerRes?.data);
    }
    return (
        <div className={styles.logIn}>
            <div className={styles.title}>Register</div>
            <div className={styles.form}>
                <div className={styles.form_div}>
                    <Form
                        form={form} 
                        layout="vertical">
                        <Form.Item label='User Name' name='userName'>
                            <Input placeholder="please enter user name"></Input>
                        </Form.Item>
                        <Form.Item label='Email' name='email'>
                            <Input placeholder="please enter user name"></Input>
                        </Form.Item>
                        <Form.Item label='Phone number' name='phoneNumber'>
                            <Input placeholder="please enter user name"></Input>
                        </Form.Item>
                        <Form.Item label='Password' name='password'>
                            <Input.Password placeholder="please enter password"></Input.Password>
                        </Form.Item>
                        <Form.Item label='Repeat Password' name='checkPassword'>
                            <Input.Password placeholder="please repeat password"></Input.Password>
                        </Form.Item>
                    </Form>
                    <div>
                    <Button onClick={handleRegister}>
                        Register
                    </Button>
                    <div className={styles.link}>
                    <a href="/loginIn">
                        Log In
                    </a>
                    </div>
                </div>
                </div>
                
            </div>
        </div>
    )
}

export default Register;