import React, { useContext, useEffect, useState } from "react";
import styles from '@/app/friends/friendPage.module.scss';
import { AuthContext } from "@/context/AuthContext";
import { deleteDoc, deleteField, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { FriendContext } from "@/context/FriendContext";
import {v4 as uuid} from "uuid";
import { useRouter } from "next/navigation";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { UsersContext } from "@/context/UsersContext";

export default function  Friendlist()  {
    const [friendlist, setFriendlist] = useState([]);

    const {user} = useContext(AuthContext);
    const {dispatch} = useContext(FriendContext);
    const {users} = useContext(UsersContext);
    
    const router = useRouter();

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

    const handleSelect = (u)=>{
        dispatch({type:"CHANGE_USER", payload: u})
        // console.log("u:",u);
    }
    const handleStartChat = async(friend) =>{
            // check whether the group (chats in firestore) exists, if not: create
            const chatroomId = friend.chatroomId? friend.chatroomId : uuid();
            // console.log("friend:", friend);
            try{
                const res = await getDoc(doc(db, "chats", chatroomId));
                console.log("res:",res);
                // console.log(res.exists());
                if(!res.exists()){
                    // create a chat in chats collection
                    await setDoc(doc(db,"chats", chatroomId), { 
                        messages: [],
                    });
                    // create user chats for each user
                    /*
                    userChat:{
                        user.uid:{
                            chatroomid(combineId):{
                                userInfo{
                                    displayName, img, id
                                },
                                lastMessage:"",
                                date:""
                            }
                        }
                    }
                    */
                    await updateDoc(doc(db, "userChats", user.uid),{
                    [chatroomId+".chatroomInfo"]:{
                        uid: chatroomId,
                        type: "private",
                    },
                    [chatroomId+".date"]: serverTimestamp(),
                    [chatroomId+`.member.${friend.userInfo.uid}.userInfo`]:{
                        uid: friend.userInfo.uid,
                    }, 
                    });
    
                   await updateDoc(doc(db, "userChats", friend.userInfo.uid),{
                    [chatroomId+".chatroomInfo"]:{
                        uid: chatroomId,
                        type: "private",
                    },
                    [chatroomId+".date"]: serverTimestamp(),
                    [chatroomId+`.member.${user.uid}.userInfo`]:{
                        uid: user.uid,
                    },
                   });

                   await setDoc(doc(db, "userFriends", user.uid),{
                        [friend.userInfo.uid]:{
                            chatroomId: chatroomId
                        },
                   },{ merge: true });
                   await setDoc(doc(db, "userFriends", friend.userInfo.uid),{
                        [user.uid]:{
                            chatroomId: chatroomId
                        },
                   },{merge: true});
                }
            }catch(err){
                console.log(err);
            }
            router.push("/chats");
    }
    const handleDelFriend = async(friend)=>{
        try{
            const chatId = friend[1].chatroomId;
            console.log(chatId);
            await updateDoc(doc(db, "userFriends", user.uid),{
                [friend[0]]: deleteField(),
            });
            await updateDoc(doc(db, "userFriends", friend[0]),{
                [user.uid]: deleteField(),
            });
            if(chatId){
                await updateDoc(doc(db, "userChats", user.uid),{
                    [chatId]: deleteField(),
                });
                await updateDoc(doc(db, "userChats", friend.uid),{
                    [chatId]: deleteField(),
                });
                await deleteDoc(doc(db,"chats", data.chatId));
            }
        }catch(err){
            console.log(err);
        }
    }

    if(friendlist && Object.keys(friendlist).length===0){
        return(
            <div className={styles.chatlist}>
                <div className={styles.null}>添加好友開始聊天</div>
            </div>
        ); 
    }

    console.log("friendlist:",friendlist);
    return (
        <div className={styles.chatlist}>
            {friendlist && Object.entries(friendlist)?.sort((a,b)=>b[1].date - a[1].date).map(friend=>{
                // console.log("friend: ",friend);
                return (
                    <div className={styles.chat} key={friend[0]} onClick={()=>handleSelect(friend[1])}>
                        <LazyLoadImage 
                            src={users && users[friend[0]].photoURL}
                            placeholderSrc="/user.png"
                            effect='opacity' 
                            alt="Image"
                        />
                        <div className={styles.chatInfo}>
                            <div className={styles.name}>{users[friend[0]].displayName}</div>
                            <div className={styles.info}><span>{users[friend[0]].email}</span></div>
                        </div>
                        <div className={styles.btnList}>
                            <div className={styles.btn} onClick={(e)=>{e.stopPropagation();handleStartChat(friend[1]);}}>開始聊天</div>
                            <div className={styles.btn} onClick={(e)=>{e.stopPropagation();handleDelFriend(friend);}}>刪除好友</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};