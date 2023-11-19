import React, { useContext, useEffect, useRef } from 'react';
import styles from "@/app/chats/chatPage.module.scss"
import classnames from 'classnames';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';
import Link from 'next/link';

const Message = ({message}) => {
    const {user} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        // console.log(ref.current);
        ref.current?.scrollIntoView({ behavior: 'auto' });
    },[message]);
    // console.log(data);
    // console.log("Message.js > message",message);
    return(
        <>
            {user && 
            <div ref={ref} className={message.senderId === user.uid
                                ? classnames(styles.message,  styles.owner)
                                : styles.message}>
                <div className={styles.messageInfo}>
                    <img 
                        src={message.senderId === user.uid 
                                ? user.photoURL
                                : data.member[message.senderId]?.userInfo.photoURL } 
                        alt="" 
                    />
                    {data.chatroomInfo.type==="group" && <span>{message.senderId !== user.uid && data.member[message.senderId]?.userInfo.displayName}</span>}
                </div>
                <div className={styles.messageContent}>
                    {message.text && <p>{message.text}</p>}
                    {message.img && <><img src={message.img} alt="" onClick={()=>window.open(message.img)} /></>}
                    {message.file && 
                    <>
                        <p>
                            <img src="/report.png" alt="" />
                            <Link href={message.file} target="_blank">{message.filename}</Link>
                        </p>
                    </>}
                </div>
                <div className={styles.messageTime}>
                    <span>{message.date.toDate().toLocaleString()}</span>
                </div>
            </div>
            }
        </>
    )
}

export default Message;