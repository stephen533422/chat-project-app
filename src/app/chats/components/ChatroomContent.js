import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import classNames from "classnames";
import { ChatContext } from "@/context/ChatContext";
import Message from "./Message";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuid } from "uuid";
import { AuthContext } from "@/context/AuthContext";

export default function  ChatroomContent()  {
    const {user}=useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [chatroom,setChatroom]=useState(0);

    const { data } = useContext(ChatContext);
    // console.log(data);
    useEffect(() =>{
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) =>{
            doc.exists() && setMessages(doc.data().messages);
        })

        return ()=>{
            unSub();
        }
    },[data.chatId]);
    useEffect(() => {
        const getChatlists = ()=>{
            const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
                console.log(doc.data()[data.chatId].member);
                setChatroom(doc.data()[data.chatId]);
            });
            return ()=>{
                unsub();
            };
        };
    if(user){
        user.uid && getChatlists();
    }
    },[]);

  return (
        <div className={styles.chatroomcontent}>
            {messages.map(m=>(
                <Message message={m} chatroom={chatroom} key={m.id}/>
            ))}
        </div>
  );
};