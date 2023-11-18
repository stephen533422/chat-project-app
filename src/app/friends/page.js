'use client'
import React, { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/chats/chatPage.module.scss';
import Nav from '@/app/component/Nav'
import FriendLists from "./FriendLists";
import FriendProfile from "./FriendProfile";
import { useRouter } from "next/navigation";
import CreateGroupChat from "./CreateGroupChat";


function Page() {
    const { user } = useAuthContext();
    const router = useRouter();
    
    useEffect(()=>{
        if (user == null) {
          router.push("/signin");
        }
      },);

    return (
        <>  
            <div className={styles.main}>
                <Nav />
                <div className={styles.section}>
                    <FriendLists />
                    <div className={styles.chatlists}>
                        <CreateGroupChat/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;