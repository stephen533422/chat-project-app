'use client'
import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/chats/chatPage.module.scss';
import Nav from '@/app/component/Nav'


function Page() {

    return (
        <>  
            <div className={styles.main}>
                <Nav />
                <div className={styles.section}>

                    <div className={styles.chatroom}>
                        <div className={styles.null}>
                            設定功能開發中
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Page;