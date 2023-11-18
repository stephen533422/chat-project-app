import React, { useContext } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { ChatContext } from "@/context/ChatContext";

export default function  ChatroomBar()  {
  const {data}=useContext(ChatContext);
  console.log(data);
  return (
        <div className={styles.chatroombar}>
            <span>{data.chatroomInfo?.displayName}</span>
            <div className={styles.chatIcons}>
                <img src="/phone.png" alt="" />
                <img src="/video.png" alt="" />
                {data.chatroomInfo.type==="group" && <img src="/add.png" alt="" />}
                {data.chatroomInfo.type==="group" && <img src="/group.png" alt="" />}
                <img src="/more.png" alt="" />
            </div>
        </div>
  );
};