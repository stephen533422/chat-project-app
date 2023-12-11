import React, { useContext, useEffect, useState } from "react";
import styles from '@/app/friends/friendPage.module.scss';
import { AuthContext } from "@/context/AuthContext";
import { deleteField, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import {v4 as uuid} from "uuid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { UsersContext } from "@/context/UsersContext";

export default function  FriendRequest()  {
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [err,setErr] = useState(false);

    const {user} = useContext(AuthContext);
    const {users} = useContext(UsersContext);

    useEffect(() => {
        const getFriendRequestList = ()=>{
        const unsub = onSnapshot(doc(db, "userFriendsRequest", user.uid), (doc) => {
            setFriendRequestList(doc.data());
        });
        return ()=>{
            unsub();
        };
    };
    if(user)
        user.uid && getFriendRequestList();
    },[user]);

    const handleAccept = async(uid) => {
        try{
            await updateDoc(doc(db, "userFriendsRequest", user.uid),{
                ["request."+uid]: deleteField(),
            });
            await updateDoc(doc(db, "userFriendsRequest", uid),{
                ["send."+user.uid]: deleteField(),
            });

            await updateDoc(doc(db,`userFriends`, user.uid),{
                [uid+".userInfo"]:{
                    uid: uid,
                },
                [uid+".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db,`userFriends`, uid),{
                [user.uid+".userInfo"]:{
                    uid: user.uid,
                },
                [user.uid+".date"]: serverTimestamp(),
            });
        }catch(err){
            setErr(err);
            console.log(err);
        }
    };

    if(!friendRequestList.request || Object.keys(friendRequestList.request).length===0){
        return(
            <div className={styles.chatlist}>
                <div className={styles.null}>沒有好友邀請</div>
            </div>
        ); 
    }

    console.log("friendlist:",friendRequestList);
    return (
        <div className={styles.chatlist}>
            {friendRequestList.request && Object.entries(friendRequestList.request)?.sort((a,b)=>b[1].date - a[1].date).map(friend=>{
                // console.log("friend: ",friend);
                return (
                    <div className={styles.chat} key={friend[0]}>
                        <LazyLoadImage 
                            src={users && users[friend[0]].photoURL}
                            placeholderSrc="/user.png"
                            height={50}
                            width={50}
                            effect='opacity' 
                            alt="Image"
                        />
                        <div className={styles.chatInfo}>
                            <div className={styles.name}>{users[friend[0]].displayName}</div>
                            <div className={styles.info}><span>{users[friend[0]].email}</span></div>
                        </div>
                        <div className={styles.btn} onClick={()=>handleAccept(friend[0])}>接受</div>
                    </div>
                );
            })}
        </div>
    );
};