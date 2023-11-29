import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { AuthContext } from "@/context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ChatContext } from "@/context/ChatContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { UsersContext } from "@/context/UsersContext";

export default function  Chatlist()  {
    const [chatlists, setChatlists] = useState([]);

    const {user} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);
    const {users} = useContext(UsersContext);

    useEffect(() => {
        const getChatlists = ()=>{
        const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
            console.log(doc.data());
            setChatlists(Object.entries(doc.data())?.sort((a,b)=>b[1].date - a[1].date));
        });

        return ()=>{
            unsub();
        };
    };
    if(user)
        user.uid && getChatlists();
    },[user]);

    const handleSelect = (u)=>{
        // console.log("u",u);
        dispatch({type:"CHANGE_USER", payload: u});
    }
    console.log("chatlists:", chatlists);

    if(chatlists && Object.keys(chatlists).length===0){
        return(
            <div className={styles.chatlist}>
                <div className={styles.null}>未有聊天紀錄</div>
            </div>
        ); 
    }

    return (
        <div className={styles.chatlist}>
            {chatlists && chatlists?.map(chat=>{
                console.log("Chats.js chat: ",chat);
                return (
                    <div className={styles.chat} key={chat[0]} onClick={()=>handleSelect(chat[1])}>
                        {chat[1].chatroomInfo.type === "group" && 
                            <LazyLoadImage 
                                src={chat[1].chatroomInfo.photoURL}
                                placeholderSrc="/groupPhoto.png"
                                height={50}
                                width={50}
                                effect='opacity' 
                                alt="Image"
                            />
                        }
                        {chat[1].chatroomInfo.type === "private" &&
                            <LazyLoadImage
                                src={users[Object.keys(chat[1].member)[0]].photoURL}
                                placeholderSrc="/user.png"
                                height={50}
                                width={50}
                                effect='opacity' 
                                alt="Image"
                            />
                        }
                        <div className={styles.chatInfo}>
                            <span>{chat[1].chatroomInfo.displayName}</span>
                            <p>{chat[1].lastMessage?.text}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};