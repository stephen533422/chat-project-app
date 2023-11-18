import React from "react";
import styles from "@/app/chats/chatPage.module.scss"
import Search from "./Search";
import FriendList from "./FriendList";
import CreateGroupChat from "./CreateGroupChat";

export default function FriendLists()  {
  return (
    <div className={styles.chatlists}>
        <Search />
        
        <FriendList />
    </div>
  );
};