'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from '@/app/introducePage.module.scss';
import classNames from 'classnames'
import { easeIn, motion } from "framer-motion";
import Card from "./Card";
import Link from "next/link";

export default function Page() {
    const router = useRouter();

    const handleScrollDown=()=>{
        const height=window.innerHeight
        window.scrollTo({top: height*0.9, left: 0, behavior: "smooth"});
    }
    const handleScrollUp=()=>{
        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }

    return (
        <div className={styles.main}>
            <div className={styles.nav}>
                <div className={styles.indexicon} onClick={()=>router.push("/home")}>
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
                <div className={styles.headline}>
                    <div className={styles.indexicon}>
                        <img src={"/chat.png"}></img>
                        <h1>InstantChat</h1>
                    </div>
                    <div className={styles.text}>
                        <span>提供一對一以及多人群組的線上聊天室與社群貼文功能</span>
                    </div>
                </div>
                <div className={styles.btn} onClick={()=>router.push("/home")}>開始探索</div>
                <motion.div 
                    className={styles.scrolldownBtn}
                    initial={{
                        y:0
                    }}
                    animate={{
                        y:[0, 10, 0, -5, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        type: easeIn,
                    }}
                    onClick={handleScrollDown}
                >
                    <img src={"/arrow.png"} alt="scrolldown"/>
                </motion.div>
            </div>
            <div className={styles.cardList}>
                <Card img={"/introduce/picture-2.png"} text={"與好友聊天"}/>
                <Card img={"/introduce/picture-3.png"} text={"群組聊天室"}/>
                <Card img={"/introduce/picture-1.png"} text={"發表貼文"}/>
                <motion.div 
                    className={styles.scrolldownBtn}
                    initial={{
                        y:0,
                        rotateX: 180,
                    }}
                    animate={{
                        y:[0, 10, 0, -5, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        type: easeIn,
                    }}
                    onClick={handleScrollUp}
                >
                    <img src={"/arrow.png"} alt="scrolldown"/>
            </motion.div>
            </div>
            <div className={styles.footer}>
                <div className={styles.text}>Copyright © 2023 JT Ho.</div>
                <div className={styles.btnList}>
                    <div className={styles.btn}>
                        <Link href="https://github.com/stephen533422" target="_blank">
                            <img src="/github.png"/>
                        </Link>
                    </div>
                    <div className={styles.btn}>
                        <Link href="https://www.facebook.com/profile.php?id=100002442890704" target="_blank">
                            <img src="/facebook.png"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
