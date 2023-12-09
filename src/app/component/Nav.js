'use client'
import React, { useContext, useEffect } from "react";
import Logout from "@/firebase/auth/signout";
import classNames from "classnames";
import styles from '@/app/component/nav.module.scss';
import Link  from 'next/link';
import { AuthContext } from "@/context/AuthContext";
import { useRouter,usePathname } from "next/navigation";

function Nav() {
    const {user}=useContext(AuthContext);
    const router = useRouter();
    const path = usePathname();
    // console.log(path);
    
    return (
        <>
            <div className={styles.nav}>
                <div className={classNames(styles.indexicon)} onClick={()=>router.push("/")}>
                    <img src={"/chat.png"}></img>
                    <h2>InstantChat</h2>
                </div>
                {user && 
                    // <div className={styles.navUser} onClick={()=>router.push("profile")}>
                    <div className={styles.navUser} >
                        <img src={user.photoURL?user.photoURL:"/user.png"}></img>
                        <span>{user.displayName}</span>
                    </div>
                }
                <Link href="/friends">
                    <div className={styles.navItem}>
                        {path==="/friends" 
                            ?<img src="/nav/friends-dark.png"></img>
                            :<img src="/nav/friends.png"></img>
                        }
                        <div className={styles.title}>好友</div>
                    </div>
                </Link>
                <Link href="/chats">
                    <div className={styles.navItem}>
                        {path==="/chats" 
                            ?<img src="/nav/chats-dark.png"></img>
                            :<img src="/nav/chats.png"></img>
                        }
                        <div className={styles.title}>聊天</div>
                    </div>
                </Link>
                <Link href="/posts">
                    <div className={styles.navItem}>
                        {path==="/posts" 
                                ?<img src="/nav/posts-dark.png"></img>
                                :<img src="/nav/posts.png"></img>
                        }
                        <div className={styles.title}>貼文</div>
                    </div>
                </Link>
                {/* <Link href="/settings"> */}
                <Link href="/profile">
                    <div className={styles.navItem}>
                        {/* {path==="/settings"  */}
                        {path==="/profile"
                                ?<img src="/nav/settings-dark.png"></img>
                                :<img src="/nav/settings.png"></img>
                        }
                        <div className={styles.title}>設定</div>
                    </div>
                </Link>
                <div className={styles.navContainer}>
                    <button className={classNames(styles.btn)} onClick={()=>{Logout();router.push("/");}}>
                        登出
                        <img></img>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Nav;