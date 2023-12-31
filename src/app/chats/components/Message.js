import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from "@/app/chats/chatPage.module.scss"
import classnames from 'classnames';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';
import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { UsersContext } from '@/context/UsersContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';

const Message = ({message,chatroom}) => {
    const {user} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const {users} = useContext(UsersContext);
    const [ count, setCount ] = useState(0);
    // console.log("count: ", count);

    const ref = useRef();

    useEffect(() => {
        // console.log(ref.current);
        // console.log("count: ",count);
        ref.current?.scrollIntoView({ behavior: 'auto' });
    },[message]);
    useEffect(()=>{
        // console.log(data.chatId);
        let newCount = 0;
        if(chatroom){
            Object.entries(chatroom.member).map((arr)=>{
                if(arr[1].readDate > message.date){
                    newCount=newCount+1;
                    setCount(newCount);
                }
            })
        }
    },[chatroom]);
    // console.log(data);
    // console.log("Message.js > message",message);
    return(
        <>
            {user && 
            <div ref={ref} className={message.senderId === user.uid
                                ? classnames(styles.message,  styles.owner)
                                : styles.message}>
                <div className={styles.messageInfo}>
                    <LazyLoadImage 
                        src={message.senderId === user.uid 
                                ? user.photoURL
                                : users[message.senderId].photoURL}
                        placeholderSrc='/user.png'
                        height={40}
                        width={40}
                        effect='opacity' 
                        alt="Image"/>
                    {data.chatroomInfo.type==="group" && 
                        <span>
                            {message.senderId !== user.uid && users[message.senderId].displayName}
                        </span>}
                </div>
                <div className={styles.messageContent}>
                    {message.text && <p>{message.text}</p>}
                    {message.img && <LazyLoadImage 
                                        src={message.img} 
                                        effect='opacity' 
                                        alt="Image" 
                                        height={150}
                                        wrapperProps={{
                                            style: {display: "flex"},
                                        }}
                                        onClick={()=>window.open(message.img)} />}
                    {message.file && 
                    <>
                        <p>
                            <img src="/report.png" alt="" />
                            <Link href={message.file} target="_blank">{message.filename}</Link>
                        </p>
                    </>}
                </div>
                <div className={styles.messageTime}>
                    {data.chatroomInfo.type==="private" && message.senderId === user.uid &&
                        <span>
                            {count===1 
                                ? "已讀"
                                : "未讀"
                            }
                        </span>
                    }
                    {data.chatroomInfo.type==="group" && message.senderId === user.uid &&
                        <span>
                            {"已讀 "+count}
                        </span>
                    }
                    <span className={styles.time}>{message.date.toDate().toLocaleString()}</span>
                </div>
            </div>
            }
        </>
    )
}

export default Message;