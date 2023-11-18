import React, { useContext, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/config";
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function  ChatroomInput()  {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const {user} = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    const handleSend = async()=>{
        console.log("data",data);
        if(img){
            const storageRef = ref(storage, uuid());
            uploadBytesResumable(storageRef, img).then(() => {
                getDownloadURL(storageRef).then( async(downloadURL) => {
                    try{
                        await updateDoc(doc(db, "chats", data.chatId),{
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: user.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            })
                        });
                    }catch (err ){
                        console.log(err);
                    }
                });
            });

            await updateDoc(doc(db, "userChats", user.uid),{
                [data.chatId+".lastMessage"]: {text:"你傳送了圖片"},
                [data.chatId+".date"]: serverTimestamp(),
            });
            //
            Object.entries(data.member).forEach(async (obj)=>{
                if(obj[1].userInfo.uid !== user.uid){
                    await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                        [data.chatId+".lastMessage"]: {text:`${user.displayName}傳送了圖片`},
                        [data.chatId+".date"]: serverTimestamp(),
                    });
                }
            });
        } else{
            await updateDoc(doc(db, "chats", data.chatId),{
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: user.uid,
                    date: Timestamp.now(),
                }),
            });

            await updateDoc(doc(db, "userChats", user.uid),{
                [data.chatId+".lastMessage"]:{
                    text
                },
                [data.chatId+".date"]: serverTimestamp(),
            });

            Object.entries(data.member).forEach(async (obj)=>{
                await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                    [data.chatId+".lastMessage"]:{
                        text
                    },
                    [data.chatId+".date"]: serverTimestamp(),
                });
            });
        }
        setText("");
        setImg(null);
    }

    return (
        <div className={styles.chatroominput}>
            <input 
                type="text" 
                placeholder='Type something...'
                onChange={e=>setText(e.target.value)}
                value={text} 
            />
            <div className={styles.send}>
                <img src="/attach.png" alt=""/>
                <input type="file" style={{display: "none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor="file">
                    <img src="/img.png" alt="" />
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};