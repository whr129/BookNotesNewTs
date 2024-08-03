import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from './index.module.scss';
import { Button } from "antd";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.home}>
            <div className={styles.title}>
                BookShelf
            </div>
            <div className={styles.content}>
                It's a book management system!
            </div>
            <div className={styles.btn}>
            <Button 
                size="large"
                type="primary"
                onClick={() => {
                    navigate('/loginIn');
                }}>
                Get Started -&gt;
            </Button>
            </div>
        </div>
    )
}

export default Home;