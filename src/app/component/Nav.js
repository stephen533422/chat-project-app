'use client'
import React, { useContext, useEffect } from "react";
import Logout from "@/firebase/auth/signout";
import classNames from "classnames";
import styles from '@/app/chats/chatPage.module.scss';
import Link  from 'next/link';
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function Nav() {
    const {user}=useContext(AuthContext);
    const router = useRouter();
    
    
    return (
        <>
            <div className={styles.nav}>
                <div className={classNames(styles.indexicon)}>
                    <h2>InstantChat</h2>
                </div>
                {user && <div className={styles.navUser}>
                    <img src={user.photoURL?user.photoURL:"/user.png"}></img>
                    <span>{user.displayName}</span>
                </div>}
                <Link href="/friends">
                    <div className={styles.navItem}>
                        好友
                    </div>
                </Link>
                <Link href="/chats">
                    <div className={styles.navItem}>
                        聊天
                    </div>
                </Link>
                <Link href="/posts">
                    <div className={styles.navItem}>
                        貼文
                    </div>
                </Link>
                <Link href="/settings">
                    <div className={styles.navItem}>
                        設定
                    </div>
                </Link>
                <button className={classNames(styles.btn)} onClick={()=>{Logout();router.push("/");}}>登出</button>
            </div>
        </>
    );
}

export default Nav;