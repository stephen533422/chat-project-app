import React, { useContext, useEffect, useRef } from 'react';
import styles from "@/app/chats/chatPage.module.scss"
import classnames from 'classnames';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';

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
                    {data.chatroomInfo.type==="group" && <span>{data.member[message.senderId]?.userInfo.displayName}</span>}
                </div>
                <div className={styles.messageContent}>
                    {message.text && <p>{message.text}</p>}
                    {message.img && <img src={message.img} alt="" />}
                </div>
                <div className={styles.messageTime}>
                    <span>{message.date.toDate().toLocaleTimeString('en-US')}</span>
                </div>
            </div>
            }
        </>
    )
}

export default Message;