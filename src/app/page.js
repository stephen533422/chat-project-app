"use client"
import styles from '@/app/chats/chatPage.module.scss'
import classNames from 'classnames'
import { useAuthContext } from '@/context/AuthContext';
import { useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/app/component/Nav'



export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();

  useLayoutEffect(()=>{
    if (user == null) {
      router.push("/signin");
    }
    // else {
    //   router.push("/chats");
    // }
  },);
  return (
    <>
    <div className={styles.main}>
        <Nav />
        <div className={styles.section}>
          <div className={styles.chatroom}>
            <div className={styles.null}>
              歡迎使用InstantChat
            </div>
          </div>
        </div>
    </div>
</>
  )
}
