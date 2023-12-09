import React, { useState } from "react";
import styles from '@/app/friends/friendPage.module.scss';
import Search from "./Search";
import FriendList from "./FriendList";
import CreateGroupChat from "./CreateGroupChat";
import Modal from "react-modal";
import FriendRequest from "./FriendRequest";

export default function FriendLists()  {
  const [groupIsOpen, setGroupIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [requestIsOpen, setRequestIsOpen] = useState(false);
    
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
      },
    };
    function openGroup() {
      setGroupIsOpen(true);
    }  
    function closeGroup() {
      setGroupIsOpen(false);
    }
    function openSearch() {
      setSearchIsOpen(true);
    }  
    function closeSearch() {
      setSearchIsOpen(false);
    }
    function openRequest() {
      setRequestIsOpen(true);
    }  
    function closeRequest() {
      setRequestIsOpen(false);
    }

  return (
    <div className={styles.chatlists}>
      <div className={styles.btnList}>
        <div className={styles.btnItem} onClick={openGroup}>
          <img src="/businessmen.png"/>
          <div className={styles.text}>創建群組</div>
        </div>
        <div className={styles.btnItem}  onClick={openSearch}>
          <img style={{width: "16px", height: "16px"}} src="/invite.png"/>
          <div className={styles.text}>添加好友</div>
        </div>
        <div className={styles.btnItem} onClick={openRequest}>
          <img style={{width: "28px", height: "28px"}} src="/handshake.png"/>
          <div className={styles.text}>好友請求</div>
        </div>
      </div>
        <Modal
          isOpen={groupIsOpen}
          style={customStyles}
          onRequestClose={closeGroup}
          contentLabel="Modal"
          ariaHideApp={false}
        >
          <div className={styles.modal}>
            <div className={styles.title}>創建群組</div>
            <button className={styles.closebtn} onClick={closeGroup}>
                <img src="/cross.png"></img>
            </button>
            <CreateGroupChat/>
          </div>
        </Modal>
        <Modal
          isOpen={searchIsOpen}
          style={customStyles}
          onRequestClose={closeSearch}
          contentLabel="Modal"
          ariaHideApp={false}
        >
          <div className={styles.modal}>
            <div className={styles.title}>添加好友</div>
            <button className={styles.closebtn} onClick={closeSearch}>
                <img src="/cross.png"></img>
            </button>
            <Search />
          </div>
        </Modal>
        <Modal
          isOpen={requestIsOpen}
          style={customStyles}
          onRequestClose={closeRequest}
          contentLabel="Modal"
          ariaHideApp={false}
        >
          <div className={styles.modal}>
            <div className={styles.title}>好友請求</div>
            <button className={styles.closebtn} onClick={closeRequest}>
                <img src="/cross.png"></img>
            </button>
            <FriendRequest/>
          </div>
        </Modal>
        <FriendList />
    </div>
  );
};