import React, { useContext, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { AuthContext } from "@/context/AuthContext";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuid } from "uuid";

export default function Search()  {
    const [username, setUsername] = useState("");
    const [friend, setFriend] = useState(null);
    const [err, setErr] = useState(false);

    const {user} = useContext(AuthContext);

    const handleSearch = async() => {
        const q = query(
            collection(db, "users"),
            where("email","==",username)
        );
        try{
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setFriend(doc.data());
            });
        }catch(err){
            setErr(true);
        }
        console.log(friend);
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async() => {
        try{
            await updateDoc(doc(db,`userFriends`, user.uid),{
                [friend.uid+".userInfo"]:{
                    uid: friend.uid,
                    displayName: friend.displayName,
                    email: friend.email,
                    photoURL: friend.photoURL,
                },
                [friend.uid+".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db,`userFriends`, friend.uid),{
                [user.uid+".userInfo"]:{
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                },
                [user.uid+".date"]: serverTimestamp(),
            });

        }catch(err){
            setErr(err);
            console.log(err);
        }
        
        setFriend(null);
        setUsername("");
    };
  
    return (
    <>
        <div className={styles.border}>
        <div className={styles.searchform}>
            <input 
                type="text" 
                placeholder='以信箱搜尋添加好友'
                onKeyDown={handleKey} 
                onChange={e=>setUsername(e.target.value)}
                value={username}
            />
            <button className={styles.btn} onClick={handleSearch}>
                <img src="/search.png" />
            </button>
        </div>
        <div className={styles.searchlist}>
            {err && <span>User not find</span>}
            {friend && 
                    <div className={styles.chat}>
                        <img className={styles.image} src={friend.photoURL?friend.photoURL:"/user.png"} />
                        <div className={styles.chatInfo}>
                            <span>{friend.displayName}</span>
                        </div>
                        <button onClick={handleSelect}>添加好友</button>
                    </div>
            }
        </div>
        </div>
    </>
  );
};