'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from '@/app/introduce/introducePage.module.scss';
import classNames from 'classnames'
import Link from "next/link";

export default function Page() {
    const router = useRouter()


    return (
        <div className={styles.main}>
            <div className={styles.nav}>
                <div className={styles.indexicon} onClick={()=>router.push("/")}>
                    <img src={"/chat.png"}></img>
                    <h2>InstantChat</h2>
                </div>
                <div className={styles.btnList}>
                    <div className={styles.btn} onClick={()=>router.push("/signin")}>
                        登入
                    </div>
                    <div className={styles.btn} onClick={()=>router.push("/signup")}>
                        註冊
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <dic className={styles.headline}>
                    <div className={styles.indexicon}>
                        <img src={"/chat.png"}></img>
                        <h1>InstantChat</h1>
                    </div>
                    <div className={styles.text}>
                        <h2>提供一對一以及多人群組的線上聊天室與社群貼文功能</h2>
                    </div>
                </dic>
                <div className={styles.btn} onClick={()=>router.push("/signin")}>開始探索</div>
            </div>
            <div className={styles.cardList}>
                <div className={styles.card}>
                    <div className={styles.text}><h2>與好友聊天</h2></div>
                    <img src="/introduce/picture-2.png"></img>
                </div>
                <div className={styles.card}>
                    <div className={styles.text}><h2>群組聊天室</h2></div>
                    <img src="/introduce/picture-3.png"></img>
                </div>
                <div className={styles.card}>
                    <div className={styles.text}><h2>發表貼文</h2></div>
                    <img src="/introduce/picture-1.png"></img>
                </div>
            </div>
        </div>
    );
}