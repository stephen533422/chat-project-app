import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { ChatContext } from "@/context/ChatContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { UsersContext } from "@/context/UsersContext";
import { Squash as Hamburger } from 'hamburger-react'
import Modal from "react-modal";
import { AuthContext } from "@/context/AuthContext";
import { Timestamp, arrayUnion, deleteDoc, deleteField, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuid } from "uuid";

export default function  ChatroomBar()  {
  const {user}=useContext(AuthContext);
  const {data,dispatch}=useContext(ChatContext);
  const {users}=useContext(UsersContext);
  const [menuOpen, setMenuOpen]=useState(false);
  const [memberOpen, setMemberOpen]=useState(false);
  const [addOpen, setAddOpen]=useState(false);
  const [changeOpen, setChangeOpen]=useState(false);
  const [changeName, setChangeName]=useState(data.chatroomInfo.displayName);
  const [memberList, setMemberList]=useState([]);
  const [friendlist, setFriendlist]=useState([]);

  useEffect(() => {
    const getFriendlist = ()=>{
      const unsub = onSnapshot(doc(db, "userFriends", user.uid), (doc) => {
          setFriendlist(doc.data());
      });
      return ()=>{
          unsub();
      };
    };
    if(user)
        user.uid && getFriendlist();
  },[user]);

  useEffect(()=>{
    if(data.chatroomInfo.type==="group"){
      setMemberList(Object.entries(data.member).map(m=>m[0]));
    }
  },[data]);

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
  // console.log(data);
  const handleMenu=()=>{
    setMenuOpen(!menuOpen);
  }
  const handleMember=()=>{
    setMenuOpen(false);
    setMemberOpen(!memberOpen);
  }
  const handleAdd=()=>{
    setMenuOpen(false);
    setAddOpen(!addOpen);
  }
  const handleChange=()=>{
    setMenuOpen(false);
    setChangeOpen(!changeOpen);
  };

  const handleChangeName=async()=>{
    Object.entries(data.member).forEach(async (obj)=>{
      // console.log(obj);
      await updateDoc(doc(db, "userChats", obj[0]),{
          [data.chatId+".chatroomInfo.displayName"]: changeName,
      });
    });
    data.chatroomInfo.displayName=changeName;
    handleChange();
  }

  const handleDelChat=async()=>{
    const member=data.member;
    const chatId=data.chatId;
    try{
      Object.entries(member).forEach(async (obj)=>{
        await updateDoc(doc(db, "userChats", obj[0]),{
          [chatId]: deleteField(),
        });
        await updateDoc(doc(db, "userFriends", obj[0]),{
          [user.uid+".chatroomId"]: deleteField(),
        });
        if(data.chatroomInfo.type==="private"){
          await updateDoc(doc(db, "userChats", user.uid),{
            [chatId]: deleteField(),
          });
          await updateDoc(doc(db, "userFriends", user.uid),{
            [obj[0]+".chatroomId"]: deleteField(),
          });
        }
      })
      await deleteDoc(doc(db,"chats", data.chatId));
      dispatch({type:"RESET", payload: {}});
    }catch(error){
      console.log(error);
    }
  };

  const handleQuit=async()=>{
    try{
      const member=data.member;
      const chatId=data.chatId;
      const date=Timestamp.now();

      await updateDoc(doc(db, "chats", data.chatId),{
        messages: arrayUnion({
            id: uuid(),
            text:`${users[user.uid].displayName}退出了群組`,
            senderId: user.uid,
            date: date,
        })
      });
      Object.entries(member).forEach(async (obj)=>{
        if(obj[0]!== user.uid){
          let readDate=new Date();
          let unreadCount = 0;                    
          onSnapshot(doc(db, "userChats", obj[0]), (doc) => {
              readDate=doc.data()[chatId]["readDate"];
              unreadCount=doc.data()[chatId]["unreadCount"];
          });
          await updateDoc(doc(db, "userChats", obj[0]),{
            [data.chatId+".lastMessage"]: {text: `${user.displayName}退出了群組`},
            [data.chatId+".date"]: date,
            [data.chatId+".unreadCount"]: unreadCount+1,
          });
          await updateDoc(doc(db, "userChats", obj[0]),{
            [chatId+".member."+user.uid]: deleteField(),
          });
        }
      });
      await updateDoc(doc(db, "userChats", user.uid),{
        [chatId]: deleteField(),
      });
      dispatch({type:"RESET", payload: {}});
    }catch(error){

    }
  };

  const handleDelFriend=async()=>{
    handleDelChat();
    try{
      const member = data.member;
      Object.entries(member).forEach(async (obj)=>{
        await updateDoc(doc(db, "userFriends", user.uid),{
            [obj[0]]: deleteField(),
        });
        await updateDoc(doc(db, "userFriends", obj[0]),{
            [user.uid]: deleteField(),
        });
      });
    }catch(err){
        console.log(err);
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    // console.log(e.target);
    let member=data.member;
    const date = Timestamp.now();
    // console.log(member);
    for(let i=0; i<e.target.length-1; i++)
    {
        if(e.target[i].type === "checkbox" && e.target[i].checked){
            member=Object.assign(member,{
                [e.target[i].dataset.uid] :{
                    userInfo:{
                        uid: e.target[i].dataset.uid,
                    },
                    readDate: date,
                }
            });
        }
        await updateDoc(doc(db, "chats", data.chatId),{
          messages: arrayUnion({
              id: uuid(),
              text:`${users[e.target[i].dataset.uid].displayName}加入群組`,
              senderId: user.uid,
              date: Timestamp.now(),
          })
        });
    }
    // console.log(member);    
    try{
      // create user chats for each user
      Object.entries(member).forEach(async (obj)=>{
        // console.log(obj);
        await updateDoc(doc(db, "userChats", obj[0]),{
            [data.chatId+".chatroomInfo"]:{
                uid: data.chatroomInfo.uid,
                displayName: data.chatroomInfo.displayName,
                //photoURL: chatroomInfo.photoURL
                type: "group",
            },
            [data.chatId+".member"]: member,
        });
        for(let i=0; i<e.target.length-1; i++){
          if(obj[0] !== user.uid){
            let readDate=new Date();
            let unreadCount = 0;                    
            onSnapshot(doc(db, "userChats", obj[0]), (doc) => {
              if(doc.data()[data.chatId]){
                readDate=doc.data()[data.chatId]["readDate"];
                unreadCount=doc.data()[data.chatId]["unreadCount"];
              }
            });
            await updateDoc(doc(db, "userChats", obj[0]),{
              [data.chatId+".lastMessage"]: {text: `${user.displayName}將${users[e.target[i].dataset.uid].displayName}加入群組`},
              [data.chatId+".date"]: date,
              [data.chatId+".unreadCount"]: unreadCount+1,
              [data.chatId+".member."+user.uid+".readDate"]: date,
            });
          }
          await updateDoc(doc(db, "userChats", user.uid),{
            [data.chatId+".lastMessage"]: {text:`你將${users[e.target[i].dataset.uid].displayName}加入群組`},
            [data.chatId+".date"]: date,
            [data.chatId+".readDate"]: date,
            [data.chatId+".unreadCount"]: 0,
          });
        }   
      }); 
    } catch(err){
        console.log(err);
    }
  }


  return (
        <div className={styles.chatroomBar}>
          <div className={styles.chatroomHeadline}>
            {data.chatroomInfo.type === "group" && 
                <LazyLoadImage 
                    src="/groupPhoto.png"
                    placeholderSrc="/groupPhoto.png"
                    height={44}
                    width={44}
                    effect='opacity' 
                    alt="Image"
                />
            }
            {data.chatroomInfo.type === "private" &&
                <LazyLoadImage
                    src={users[Object.keys(data.member)[0]].photoURL}
                    placeholderSrc="/user.png"
                    height={44}
                    width={44}
                    effect='opacity' 
                    alt="Image"
                />
            }
            <div className={styles.chatroomName}>
              {data.chatroomInfo.type==="group" && data.chatroomInfo.displayName }
              {data.chatroomInfo.type==="private" && users[Object.entries(data.member)[0][0]].displayName }
            </div>
          </div>
          <div className={styles.chatroomIcons}>
              {data.chatroomInfo.type==="group" && <img src="/users-medical.png" alt="" onClick={handleAdd}/>}
              {data.chatroomInfo.type==="group" && <img src="/users-alt.png" alt="" onClick={handleMember} />}
              <div className={styles.menu}>
                <Hamburger toggled={menuOpen} size={24} toggle={handleMenu} />
                {menuOpen 
                  ? <div className={styles.menuList}>
                      {data.chatroomInfo.type==="group" && <div className={styles.menuItem} onClick={handleChange}>更改群組名</div>}
                      <div className={styles.menuItem} onClick={handleDelChat}>刪除聊天室</div>
                      {data.chatroomInfo.type==="group" && <div className={styles.menuItem} onClick={handleQuit}>退出群組</div>}
                      {data.chatroomInfo.type==="private" && <div className={styles.menuItem} onClick={handleDelFriend}>刪除好友</div>}
                    </div> 
                  : <></>}
              </div>
              {data.chatroomInfo.type==="group" && <>
                <Modal
                  isOpen={memberOpen}
                  style={customStyles}
                  onRequestClose={handleMember}
                  contentLabel="Modal"
                  ariaHideApp={false}
                >
                  <div className={styles.modal}>
                    <div className={styles.title}>成員</div>
                    <button className={styles.closebtn} onClick={handleMember}>
                        <img src="/cross.png"></img>
                    </button>
                    <div className={styles.chatlist}>
                      {memberList && memberList.map(uid=>{
                          return (
                              <div className={styles.chat} key={uid}>
                                  <LazyLoadImage 
                                      src={users && users[uid].photoURL}
                                      placeholderSrc="/user.png"
                                      height={56}
                                      width={56}
                                      effect='opacity' 
                                      alt="Image"
                                  />
                                  <div className={styles.chatInfo}>
                                      <div className={styles.name}>{users[uid].displayName}</div>
                                      <div className={styles.info}><span>{users[uid].email}</span></div>
                                  </div>
                              </div>
                          );
                      })}
                    </div>
                  </div>
                </Modal>
                <Modal
                isOpen={addOpen}
                style={customStyles}
                onRequestClose={handleAdd}
                contentLabel="Modal"
                ariaHideApp={false}
              >
                <div className={styles.modal}>
                  <div className={styles.title}>從好友添加成員</div>
                  <button className={styles.closebtn} onClick={handleAdd}>
                      <img src="/cross.png"></img>
                  </button>
                  <form onSubmit={(e)=>handleSubmit(e)}>
                    <div className={styles.chatlist}>
                      {friendlist && Object.entries(friendlist)?.filter(f=>!memberList.includes(f[0])).map(friend=>{
                            return (              
                                <div className={styles.chat} key={friend[0]} >
                                    <img className={styles.image} src={users[friend[0]].photoURL? users[friend[0]].photoURL: "/user.png"} />
                                    <div className={styles.chatInfo}>
                                        <span className={styles.name}>{users[friend[0]].displayName}</span>
                                        <div className={styles.info}><span>{users[friend[0]].email}</span></div>
                                    </div>
                                    <input type="checkbox" data-uid={users[friend[0]].uid} data-email={users[friend[0]].email} data-name={users[friend[0]].displayName} data-photo={users[friend[0]].photoURL}></input>
                                </div>
                            );
                        })}
                        { Object.entries(friendlist)?.filter(f=>!memberList.includes(f[0])).length===0                 
                            && <div className={styles.null}>沒有可添加的好友</div>}
                    </div>
                    <div className={styles.btnList}>
                      <button class={styles.btn} type="submit">加入群組</button>
                    </div>
                  </form>
                </div>
              </Modal>
              <Modal
                  isOpen={changeOpen}
                  style={customStyles}
                  onRequestClose={handleChange}
                  contentLabel="Modal"
                  ariaHideApp={false}
                >
                  <div className={styles.modal}>
                    <div className={styles.title}>更改群組名稱</div>
                    <button className={styles.closebtn} onClick={handleChange}>
                        <img src="/cross.png"></img>
                    </button>
                    <div className={styles.searchform}>
                      <input 
                        type="text" 
                        placeholder='更改群組名稱'
                        onChange={(e)=>setChangeName(e.target.value)}
                        value={changeName}
                      />
                      <div className={styles.btn} onClick={handleChangeName}>
                        確認
                      </div>
                    </div>
                  </div>
                </Modal>
            </>}
          </div>
        </div>
  );
};