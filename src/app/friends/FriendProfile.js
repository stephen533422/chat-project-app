import React, { useContext } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { ChatContext } from "@/context/ChatContext";

export default function FriendProfile()  {
  const {data} = useContext(ChatContext);


  if(data.chatId==="null"){
    return (
      <div className={styles.chatroom}>
        <div className={styles.null}>功能開發中</div>
      </div>
    );
  }

  return (
    <div className={styles.chatroom}>

    </div>
  );
};