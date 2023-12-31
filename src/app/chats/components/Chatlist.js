import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { AuthContext } from "@/context/AuthContext";
import { Timestamp, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ChatContext } from "@/context/ChatContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { UsersContext } from "@/context/UsersContext";
import classnames from "classnames";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function  Chatlist()  {
    const [chatlists, setChatlists] = useState(null);
    const [loading, setLoading] = React.useState(true);

    const {user} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const {users} = useContext(UsersContext);

    useEffect(() => {
        const getChatlists = ()=>{
            const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
                // console.log(doc.data());
                setChatlists(Object.entries(doc.data())?.sort((a,b)=>b[1].date - a[1].date));
            });
            return ()=>{
                unsub();
            };
        };
    if(user)
        user.uid && getChatlists();
    setLoading(false);
    },[user]);

    const handleSelect = async(u)=>{
        // console.log("u",u);
        const date=Timestamp.now();
        dispatch({type:"CHANGE_USER", payload: u});
        await updateDoc(doc(db, "userChats", user.uid),{
            [u.chatroomInfo.uid+".readDate"]: date,
            [u.chatroomInfo.uid+".unreadCount"]: 0,
        });
        Object.entries(u.member).forEach(async (obj)=>{
            if(obj[1].userInfo.uid !== user.uid){
                await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                    [u.chatroomInfo.uid+".member."+user.uid+".readDate"]: date,
                });
            }
        });
        //
    }
    // console.log("chatlists:", chatlists);

    if(chatlists && Object.keys(chatlists).length===0){
        return(
            <div className={styles.chatlist}>
                <div className={styles.null}>未有聊天紀錄</div>
            </div>
        ); 
    }

    return (
        <div className={styles.chatlist}>
            {!chatlists && 
                <div className={styles.chat} >
                    <Skeleton 
                        circle={true}
                    />
                <div className={styles.chatInfo}>
                    <div className={classnames(styles.name)}>
                        <Skeleton height={"100%"} width={"50%"}/>
                    </div>
                    <div className={styles.info}>
                        <span className={classnames(styles.text)}>
                        </span>
                    </div>
                </div>
            </div>
            }
            {chatlists && chatlists?.map(chat=>{
                // console.log("Chats.js chat: ",chat);
                // console.log(users[Object.entries(chat[1].member)[0][0]].displayName);
                return (
                    <div className={styles.chat} key={chat[0]} onClick={()=>handleSelect(chat[1])}>
                        {chat[1].chatroomInfo.type === "group" && 
                            <LazyLoadImage 
                                src="/groupPhoto.png"
                                placeholderSrc="/groupPhoto.png"
                                effect='opacity' 
                                alt="Image"
                            />
                        }
                        {chat[1].chatroomInfo.type === "private" &&
                            <LazyLoadImage
                                src={users[Object.keys(chat[1].member)[0]].photoURL}
                                placeholderSrc="/user.png"
                                effect='opacity' 
                                alt="Image"
                            />
                        }
                        <div className={styles.chatInfo}>
                            <div className={classnames(chat[1].unreadCount!==0 && styles.unread,styles.name)}>
                                {chat[1].chatroomInfo.type==="group" && chat[1].chatroomInfo.displayName }
                                {chat[1].chatroomInfo.type==="private" && users[Object.entries(chat[1].member)[0][0]].displayName }
                            </div>
                            <div className={styles.info}>
                                <span className={classnames(chat[1].unreadCount!==0 && styles.unread, styles.text)}>{chat[1].lastMessage?.text}</span>
                                {chat[1].lastMessage && <span>{" · " + chat[1].date.toDate().toLocaleString()}</span>}
                            </div>
                            {chat[1].unreadCount !== 0  && chat[1].lastMessage && <div className={styles.unreadCount}>{chat[1].unreadCount}</div>}
                        </div>
                    </div>
                );
            })}
            {
                chatlists && Object.keys(chatlists).length===0 && <div className={styles.null}>未有聊天紀錄</div>
            }
        </div>
    );
};