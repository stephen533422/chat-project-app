import React, { useContext } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import ChatroomBar from "./ChatroomBar";
import ChatroomContent from "./ChatroomContent";
import ChatroomInput from "./ChatroomInput";
import { ChatContext } from "@/context/ChatContext";

export default function  Chatroom()  {
  const {data} = useContext(ChatContext);


  if(data.chatId==="null"){
    return (
      <div className={styles.chatroom}>
        <div className={styles.null}>未選擇任何聊天室</div>
      </div>
    );
  }

  return (
    <div className={styles.chatroom} key={data.chatId}>
        <ChatroomBar />
        <ChatroomContent />
        <ChatroomInput />
    </div>
  );
};