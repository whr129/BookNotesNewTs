import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, UnorderedListOutlined, BookOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import styles from './index.module.scss';
import { Navigate } from "react-router-dom";
import type { MenuProps } from "antd";

const Layouts = () => {
    const { Header, Content, Footer, Sider } = Layout;
    const navigate = useNavigate();
    const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
        (icon, index) => ({
          key: String(index + 1),
          icon: React.createElement(icon),
          label: `nav ${index + 1}`,
        }),
      );
    const menuList = [
      {
        key: '/user-info',
        icon: <UserOutlined />,
        label: 'User Info',
      },
      {
        key: '/to-do-list',
        icon: <UnorderedListOutlined />,
        label: 'To Do List',
      },
      {
        key: '/add-new',
        icon: <BookOutlined />,
        label: 'Add New Books'
      },
      {
        key: '/unread-book',
        icon: <BookOutlined />,
        label: 'UnRead Books'
      },
      {
        key: '/book-in-read',
        icon: <BookOutlined />,
        label: 'Books In Progress'
      },
      {
        key: '/book-finish',
        icon: <BookOutlined />,
        label: 'Books Finished'
      }
    ];
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const onMenuChange : MenuProps['onClick'] = (e) => {
      navigate('/personal-center' + e.key)
    };
    return (
            <Layout className={styles.wrapPage}>
                 <Sider
                    collapsible
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                    console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                    }}
                    style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
                >
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={menuList} onClick={onMenuChange}/>
                </Sider>
            <Layout style={{marginLeft: 200}}>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}> 
                    <Outlet />
                </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
            </Layout>
            </Layout>
    )
}

export default Layouts