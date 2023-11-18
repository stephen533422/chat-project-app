import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import classNames from "classnames";
import { ChatContext } from "@/context/ChatContext";
import Message from "./Message";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuid } from "uuid";

export default function  ChatroomContent()  {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);
    console.log(data);
    useEffect(() =>{
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) =>{
            doc.exists() && setMessages(doc.data().messages);
        })

        return ()=>{
            unSub();
        }
    },[data.chatId]);

  return (
        <div className={styles.chatroomcontent}>
            {messages.map(m=>(
                <Message message={m} key={uuid()}/>
            ))}
        </div>
  );
};