import React, { useContext, useEffect, useState } from "react";
import styles from '@/app/friends/friendPage.module.scss';
import { AuthContext } from "@/context/AuthContext";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuid } from "uuid";
import classNames from "classnames";

export default function Search()  {
    const [search, setSearch] = useState("");
    const [result, setResult] = useState(null);
    const [friendsRequestList, setFriendsRequestList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [err, setErr] = useState(false);

    const {user} = useContext(AuthContext);

    useEffect(() => {
        const getFriendsRequestlist = ()=>{
            const unsub = onSnapshot(doc(db, "userFriendsRequest", user.uid), (doc) => {
                setFriendsRequestList(doc.data());
            });
            return ()=>{
                unsub();
            };
        };
        if(user)
            user.uid && getFriendsRequestlist();
    },[user]);

    useEffect(() => {
        const getFriendsList = ()=>{
        const unsub = onSnapshot(doc(db, "userFriends", user.uid), (doc) => {
            setFriendsList(doc.data());
        });
        return ()=>{
            unsub();
        };
    };
    if(user)
        user.uid && getFriendsList();
    },[user]);

    const handleSearch = async() => {
        setResult(null);
        const q = query(
            collection(db, "users"),
            where("email","==",search)
        );
        try{
            setErr(false);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setResult(doc.data());
            });
            if(querySnapshot.empty){
                setErr(true);
            }
        }catch(err){
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async() => {
        const date = Timestamp.now();
        try{
            await updateDoc(doc(db,`userFriendsRequest`, user.uid),{
                ["send."+result.uid]:{
                    uid: result.uid,
                    date: date,
                },
            });
            await updateDoc(doc(db,"userFriendsRequest", result.uid),{
                ["request."+user.uid]:{
                    uid: user.uid,
                    date: date,
                }
            });

        }catch(err){
            setErr(true);
            // console.log(err);
        }
        
        // setResult(null);
        // setSearch("");
    };
  
    return (
    <>
        <div className={styles.searchform}>
            <input 
                type="text" 
                placeholder='以信箱搜尋添加好友'
                onKeyDown={handleKey} 
                onChange={e=>setSearch(e.target.value)}
                value={search}
            />
            <div className={styles.btn} onClick={handleSearch}>
                <img src="/search.png" />
            </div>
        </div>
        <div className={styles.searchlist}>
            {err && <div className={styles.null}>符合的信箱不存在</div>}
            {result && 
                    <div className={styles.chat}>
                        <img className={styles.image} src={result.photoURL?result.photoURL:"/user.png"} />
                        <div className={styles.chatInfo}>
                            <div className={styles.name}>{result.displayName}</div>
                            <div className={styles.info}><span>{result.email}</span></div>
                        </div>
                        {  friendsList && Object.keys(friendsList).includes(result.uid) 
                            ? <div className={styles.btn}>好友</div>
                            : friendsRequestList.send && Object.keys(friendsRequestList.send).includes(result.uid) 
                                ? <div className={styles.btn}>已邀請</div>
                                : result.uid!==user.uid && <div className={classNames(styles.btn, styles.pointer)} onClick={handleSelect}>加好友</div>
                        }
                    </div>
            }
        </div>
    </>
  );
};