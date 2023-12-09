import React, { useContext, useEffect, useState } from "react";
import styles from "@/app/friends/friendPage.module.scss"
import { FriendContext } from "@/context/FriendContext";
import { UsersContext } from "@/context/UsersContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PostList from "../posts/PostList";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export default function FriendProfile()  {
    const { user } =useContext(AuthContext); 
  const { data } = useContext(FriendContext);
  const { users } = useContext(UsersContext);
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  console.log(data);
  console.log(posts);

  useEffect(() =>{
      const unSub = onSnapshot(doc(db, "posts", data.uid), (doc) =>{
          doc.exists() && setPosts(Object.entries(doc.data())?.sort((a,b)=>b[1].date - a[1].date));
      })

      return ()=>{
          unSub();
      }
  },[data.uid]);

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
            [chatroomId+`.member.${friend.uid}.userInfo`]:{
                uid: friend.uid,
            }, 
            });

           await updateDoc(doc(db, "userChats", friend.uid),{
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
                [friend.uid]:{
                    chatroomId: chatroomId
                },
           },{ merge: true });
           await setDoc(doc(db, "userFriends", friend.uid),{
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
    const chatId = friend.chatroomId;
    console.log(chatId);
    await updateDoc(doc(db, "userFriends", user.uid),{
        [friend.uid]: deleteField(),
    });
    await updateDoc(doc(db, "userFriends", friend.uid),{
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

  if(data.uid==="null"){
    return (
      <div className={styles.chatroom}>
        <div className={styles.null}>未選擇好友</div>
      </div>
    );
  }

  return (
    <div className={styles.chatroom} key={data.uid}>
      {users && users[data.uid] && 
      <div className={styles.profilePage}>
        <div className={styles.profile}>
            <div className={styles.background}>
                <LazyLoadImage 
                    src={users[data.uid].backgroundURL?users[data.uid].backgroundURL:"/gray.jpg"} 
                    effect='opacity' 
                    wrapperProps={{
                        style: {display: "inline"},
                    }} 
                    alt="Image"/>
            </div>
            <div className={styles.userbox}>
                <div className={styles.avatar}>
                    <LazyLoadImage src={users[data.uid].photoURL?users[data.uid].photoURL:"/user.png"} height={168} width={168} effect='opacity' alt="Image" />
                </div>
                <div className={styles.information}>
                    <div className={styles.displayName}>
                        <span>{users[data.uid].displayName}</span>
                    </div>
                    <div className={styles.about}>
                        <h3>關於我:</h3>
                        <p>
                            {users[data.uid].about? users[data.uid].about: "暫無資料"}
                        </p>
                    </div>
                </div>
                <div className={styles.btnList}>
                    <div className={styles.btn} onClick={(e)=>{e.stopPropagation();handleStartChat(data);}}>開始聊天</div>
                    <div className={styles.btn} onClick={(e)=>{e.stopPropagation();handleDelFriend(data);}}>刪除好友</div>
                </div>
            </div>
        </div>
        {posts.length!==0 && <PostList posts={posts}/>}
            {/* <div className={styles.null}>
                個人主頁功能開發中
            </div> */}
      </div>
      }
  </div>
  );
};