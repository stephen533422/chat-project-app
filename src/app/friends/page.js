'use client'
import React, { useContext, useEffect } from "react";
import { AuthContext} from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/friends/friendPage.module.scss';
import Nav from '@/app/component/Nav'
import FriendLists from "./FriendLists";
import FriendProfile from "./FriendProfile";
import { useRouter } from "next/navigation";

function Page() {
    const { user } = useContext(AuthContext);
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
                    <FriendProfile/>
                </div>
            </div>
        </>
    );
}

export default Page;