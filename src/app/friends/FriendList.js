import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { AuthContext } from "@/context/AuthContext";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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
            const  chatroomId = friend.chatroomId? friend.chatroomId : uuid();
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
                        displayName: friend.userInfo.displayName,
                        photoURL: friend.userInfo.photoURL,
                        type: "private",
                    },
                    [chatroomId+".date"]: serverTimestamp(),
                    [chatroomId+`.member.${friend.userInfo.uid}.userInfo`]:{
                        uid: friend.userInfo.uid,
                        email: friend.userInfo.email,
                        displayName: friend.userInfo.displayName,
                        photoURL: friend.userInfo.photoURL,
                    }, 
                    });
    
                   await updateDoc(doc(db, "userChats", friend.userInfo.uid),{
                    [chatroomId+".chatroomInfo"]:{
                        uid: chatroomId,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        type: "private",
                    },
                    [chatroomId+".date"]: serverTimestamp(),
                    [chatroomId+`.member.${user.uid}.userInfo`]:{
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
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
                console.log("friend: ",friend);
                return (
                    <div className={styles.chat} key={friend[0]} >
                        <LazyLoadImage 
                            src={users && users[friend[0]].photoURL}
                            placeholderSrc="/user.png"
                            height={50}
                            width={50}
                            effect='opacity' 
                            alt="Image"
                        />
                        <div className={styles.chatInfo}>
                            <span>{users[friend[0]].displayName}</span>
                        </div>
                        <button onClick={()=>handleStartChat(friend[1])}>開始聊天</button>
                    </div>
                );
            })}
        </div>
    );
};