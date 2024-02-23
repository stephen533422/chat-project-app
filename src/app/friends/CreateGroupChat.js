import React, { useContext, useEffect, useRef, useState } from "react";
import styles from '@/app/friends/friendPage.module.scss';
import { AuthContext } from "@/context/AuthContext";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { v4 as uuid } from "uuid";
import classNames from "classnames";
import { UsersContext } from "@/context/UsersContext";
import { useRouter } from "next/navigation";

export default function CreateGroupChat()  {
    const [chatname, setChatname] = useState("");
    const [friendlist, setFriendlist] = useState([]);
    const [err, setErr] = useState(false);

    const {user} = useContext(AuthContext);
    const {users} = useContext(UsersContext);
    const ref = useRef();
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

    const handleKey = (e) => {
        e.code === "Enter" && handleSubmit();
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(e.target);
        let member={};
        for(let i=2; i<e.target.length; i++)
        {
            if(e.target[i].type === "checkbox" && e.target[i].checked){
                member=Object.assign(member,{
                    [e.target[i].dataset.uid] :{
                        userInfo:{
                            uid: e.target[i].dataset.uid,
                            email: e.target[i].dataset.email,
                            displayName: e.target[i].dataset.name,
                            photoURL: e.target[i].dataset.photo,
                        }
                    }
                });
            }
        }
        member=Object.assign(member,{
            [user.uid] :{
                userInfo:{
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }
            }
        })
        console.log(member);    
        try{
            const chatroomId =  uuid();
            const chatroomName = e.target[0].value;

            await setDoc(doc(db,"chats", chatroomId), {
                    messages: [],   
            });
            // create user chats for each user
            await updateDoc(doc(db, "userChats", user.uid),{
                [chatroomId+".chatroomInfo"]:{
                    uid: chatroomId,
                    displayName: chatroomName,
                    //photoURL: friend.photoURL
                    type: "group",
                },
                [chatroomId+".date"]: serverTimestamp(),
                [chatroomId+".member"]: member,
            });
            for(let i=2; i<e.target.length; i++)
            {
                if(e.target[i].type === "checkbox"){
                    await updateDoc(doc(db, "userChats", e.target[i].dataset.uid),{
                        [chatroomId+".chatroomInfo"]:{
                            uid: chatroomId,
                            displayName: chatroomName,
                            //photoURL: friend.photoURL
                            type: "group",
                        },
                        [chatroomId+".date"]: serverTimestamp(),
                        [chatroomId+".member"]: member,
                    });
                }
            }    
        } catch(err){
            setErr(err);
            console.log(err);
        }
        
        setChatname("");
        router.push("/chats");
    };
  
    return (
    <>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <div className={classNames(styles.searchform, styles.mb10)}>
                    <input 
                        type="text" 
                        placeholder='群組名稱'
                        onKeyDown={handleKey} 
                        onChange={e=>setChatname(e.target.value)}
                        value={chatname}
                    />
                    <button className={styles.btn} type="submit">
                        確認
                    </button>
                </div>
                <div ref={ref} className={styles.chatlist}>
                    <div className={styles.title}>選擇想要加入的好友</div>
                    {friendlist && Object.entries(friendlist)?.sort((a,b)=>b[1].date - a[1].date).map(friend=>{
                        //console.log("friend: ",chat);
                        return (              
                            <div className={styles.chat} key={friend[0]} >
                                <img className={styles.image} src={users[friend[0]].photoURL? users[friend[0]].photoURL: "/user.png"} />
                                <div className={styles.chatInfo}>
                                    <div className={styles.name}>{users[friend[0]].displayName}</div>
                                    <div className={styles.info}>{users[friend[0]].email}</div>
                                </div>
                                <input className={styles.checkbox} type="checkbox" data-uid={users[friend[0]].uid} data-email={users[friend[0]].email} data-name={users[friend[0]].displayName} data-photo={users[friend[0]].photoURL}></input>
                            </div>
                        );
                    })}
                </div>
            </form>
    </>
  );
};