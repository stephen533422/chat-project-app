import React from "react";
import styles from "@/app/chats/chatPage.module.scss"
import Search from "./Search";
import Chatlist from "./Chatlist";

export default function  Chatlists()  {
  return (
    <div className={styles.chatlists}>
        <Search />
        <Chatlist />
    </div>
  );
};