import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "@/app/chats/chatPage.module.scss"
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/config";
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function  ChatroomInput()  {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");

    const refPreview = useRef();
    const refDragDrop = useRef();

    const {user} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    useEffect(()=>{
        const el = refDragDrop.current;
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('drop', handleDrop);
        el.addEventListener('dragenter', handleDragEnter);
        el.addEventListener('dragleave', handleDragLeave);

        return () => {
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('drop', handleDrop);
            el.removeEventListener('dragenter', handleDragEnter);
            el.removeEventListener('dragleave', handleDragLeave);
        };
    },);
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("dragover");
        refDragDrop.current.style.backgroundColor = "lightgray";
        refDragDrop.current.children[0].style.display="flex";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("drop");
        console.log(e.dataTransfer.files[0]);

        setFile(e.dataTransfer.files[0]);
        setFilename(e.dataTransfer.files[0].name);

        if(e.dataTransfer.files[0].type.includes("image")){
            var reader = new FileReader();
            
            reader.onload = function (e) {
              
              refPreview.current.children[0].src = e.target.result;
              refPreview.current.style.display='flex';
             };
            reader.readAsDataURL(e.dataTransfer.files[0]);
        }
        else{
            refPreview.current.children[0].src = "/file.png";
            refPreview.current.style.display='flex';
        }
        refDragDrop.current.style.backgroundColor = "transparent";
        refDragDrop.current.children[0].style.display = "none";
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("dragenter");
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("dragleave");
    };


    const handleSend = async()=>{
        console.log("data",data);
        const date = Timestamp.now();

        if(file && file.type.includes("image")){
            const storageRef = ref(storage, uuid());
            uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then( async(downloadURL) => {
                    try{
                        await updateDoc(doc(db, "chats", data.chatId),{
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: user.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                                filename: filename,
                            })
                        });
                    }catch (err ){
                        console.log(err);
                    }
                });
            });
            await updateDoc(doc(db, "userChats", user.uid),{
                [data.chatId+".lastMessage"]: {text:"你傳送了圖片"},
                [data.chatId+".date"]: date,
                [data.chatId+"readDate"]: date,
                [data.chatId+".unreadCount"]: 0,
            });

            //
            Object.entries(data.member).forEach(async (obj)=>{
                if(obj[1].userInfo.uid !== user.uid){
                    let readDate=new Date();
                    let unreadCount = 0;                    
                    onSnapshot(doc(db, "userChats", obj[1].userInfo.uid), (doc) => {
                        readDate=doc.data()[data.chatId]["readDate"];
                        unreadCount=doc.data()[data.chatId]["unreadCount"];
                    });
                    if (readDate > date){
                        await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                            [data.chatId+".lastMessage"]: {text:`${user.displayName}傳送了圖片`},
                            [data.chatId+".date"]: date,
                            [data.chatId+".unreadCount"]: unreadCount+1,
                            [data.chatId+".member."+user.uid+".readDate"]: date,
                        });
                    }else{
                        await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                            [data.chatId+".lastMessage"]: {text:`${user.displayName}傳送了圖片`},
                            [data.chatId+".date"]: date,
                            [data.chatId+".member."+user.uid+".readDate"]: date,
                        });
                    }
                }
            });
        } else if (file){
            const storageRef = ref(storage, uuid());
            uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then( async(downloadURL) => {
                    try{
                        await updateDoc(doc(db, "chats", data.chatId),{
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: user.uid,
                                date: date,
                                file: downloadURL,
                                filename: filename,
                            })
                        });
                    }catch (err ){
                        console.log(err);
                    }
                });
            });

            await updateDoc(doc(db, "userChats", user.uid),{
                [data.chatId+".lastMessage"]: {text:"你傳送了檔案"},
                [data.chatId+".date"]: date,
                [data.chatId+".readDate"]: date,
                [data.chatId+".unreadCount"]: 0,
            });
            
            Object.entries(data.member).forEach(async (obj)=>{
                if(obj[1].userInfo.uid !== user.uid){
                    let readDate=new Date();
                    let unreadCount = 0;                    
                    onSnapshot(doc(db, "userChats", obj[1].userInfo.uid), (doc) => {
                        readDate=doc.data()[data.chatId]["readDate"];
                        unreadCount=doc.data()[data.chatId]["unreadCount"];
                    });
                    if (readDate > date){
                        await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                            [data.chatId+".lastMessage"]: {text:`${user.displayName}傳送了圖片`},
                            [data.chatId+".date"]: date,
                            [data.chatId+".unreadCount"]: unreadCount+1,
                            [data.chatId+".member."+user.uid+".readDate"]: date,
                        });
                    }else{
                        await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                            [data.chatId+".lastMessage"]: {text:`${user.displayName}傳送了圖片`},
                            [data.chatId+".date"]: date,
                            [data.chatId+".member."+user.uid+".readDate"]: date,
                        });
                    }
                }
            });
        }else{
            await updateDoc(doc(db, "chats", data.chatId),{
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: user.uid,
                    date: date,
                }),
            });

            await updateDoc(doc(db, "userChats", user.uid),{
                [data.chatId+".lastMessage"]: {text: `你: ${text}`},
                [data.chatId+".date"]: date,
                [data.chatId+".readDate"]: date,
                [data.chatId+".unreadCount"]: 0,
            });


            Object.entries(data.member).forEach(async (obj)=>{
                if(obj[1].userInfo.uid !== user.uid){
                    let readDate=new Date();
                    let unreadCount = 0;                    
                    onSnapshot(doc(db, "userChats", obj[1].userInfo.uid), (doc) => {
                        readDate=doc.data()[data.chatId]["readDate"];
                        unreadCount=doc.data()[data.chatId]["unreadCount"];
                    });
                    if (readDate > date){
                        await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                            [data.chatId+".lastMessage"]: {text: `${user.displayName}: ${text}`},
                            [data.chatId+".date"]: date,
                            [data.chatId+".unreadCount"]: unreadCount+1,
                            [data.chatId+".member."+user.uid+".readDate"]: date,
                        });
                    }else{
                        await updateDoc(doc(db, "userChats", obj[1].userInfo.uid),{
                            [data.chatId+".lastMessage"]: {text: `${user.displayName}: ${text}`},
                            [data.chatId+".date"]: date,
                            [data.chatId+".member."+user.uid+".readDate"]: date,
                        });
                    }
                }
            });
        }
        setText("");
        setFile(null);
        setFilename("");
        refPreview.current.children[0].src="";
        refPreview.current.style.display='none';
    }

    const handleUpload = (e)=>{
        console.log("file: ",e.target);
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);

        if(e.target.files[0].type.includes("image")){
            var reader = new FileReader();
            
            reader.onload = function (e) {
              
              refPreview.current.children[0].src = e.target.result;
              refPreview.current.style.display='flex';
             };
            reader.readAsDataURL(e.target.files[0]);
        }
        else{

            refPreview.current.children[0].src = "/file.png";
            refPreview.current.style.display='flex';
        }
    }
    const handleCancel = (e)=>{
        setFile(null);
        setFilename("");
        refPreview.current.children[0].src="";
        refPreview.current.style.display='none';
    }

    return (
        <div className={styles.chatroominput}>
            <div className={styles.dragdrop} ref={refDragDrop}>
                <div className={styles.dragmessage}>拖曳檔案至此</div>
                <div className={styles.inputbox} >
                    <input 
                        type="text" 
                        placeholder='Type something...'
                        onChange={e=>setText(e.target.value)}
                        value={text} 
                    />
                    <div className={styles.previewbox} ref={refPreview}>
                        <img></img>
                        <span>{filename}</span>
                        <button onClick={handleCancel}>X</button>
                    </div>
                </div>
                <div className={styles.send}>
                    <input type="file" style={{display: "none"}} id="file" onChange={handleUpload}/>
                    <label htmlFor="file">
                        <img src="/attach.png" alt="" />
                    </label>
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};