'use client'
import React, { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/chats/chatPage.module.scss';
import { useRouter } from "next/navigation";
import Nav from '@/app/component/Nav'
import Chatlists from "./components/Chatlists";
import Chatroom from "./components/Chatroom"; 

function Page() {
    const { user } = useAuthContext();
    const router = useRouter();
    useEffect(()=>{
        if (user == null) {
            console.log("user is null ->/siginin");
            router.push("/signin");
        }
      },);

    return (
        <>  
            <div className={styles.main}>
                <Nav />
                <div className={styles.section}>
                    <Chatlists />
                    <Chatroom />
                </div>
            </div>
        </>
    );
}

export default Page;
