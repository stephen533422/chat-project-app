import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/posts/postspage.module.scss';
import { db, storage } from "@/firebase/config";
import { v4 as uuid } from 'uuid';
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


function NewPost() {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useContext(AuthContext);

    const refPreview = useRef();

    const handleUpload = (e)=>{
        console.log("file: ",e.target);
        setFile(e.target.files[0]);
        if(e.target.files[0].type.includes("image")){
            var reader = new FileReader();
            reader.onload = function (e) {
              refPreview.current.children[1].src = e.target.result;
              refPreview.current.style.display='flex';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        else{
            refPreview.current.children[1].src = "/file.png";
            refPreview.current.style.display='flex';
        }
    }

    const handleCancel = (e)=>{
        setFile(null);
        refPreview.current.children[1].src="";
        refPreview.current.style.display='none';
    }

    const handlePost = async() => {
        try{
            const postId = uuid();
            if(file){
                const storageRef = ref(storage, uuid());
                uploadBytesResumable(storageRef, file).then(() => {
                    getDownloadURL(storageRef).then( async(downloadURL) => {
                        await setDoc(doc(db, "posts", user.uid),{
                            [postId]:{
                                text,
                                posterId: user.uid,
                                postDate: Timestamp.now(),
                                like: {},
                                comment: {},
                                date: Timestamp.now(),
                                img: downloadURL,
                            }
                        }, {merge: true});
                    });
                });
            }
            else{
                await setDoc(doc(db, "posts", user.uid),{
                    [postId]:{
                        text,
                        posterId: user.uid,
                        postDate: Timestamp.now(),
                        like: {},
                        comment: {},
                        date: Timestamp.now(),
                    }
                }, {merge: true});
            }
        }
        catch (err ){
                    
        }
        setText("");
        setFile(null);
        refPreview.current.children[1].src="";
        refPreview.current.style.display='none';
    };
    
    return (
        <>  
            <div className={styles.newPostContainer}>
                <div className={styles.newPost}>
                    <div className={styles.postTitle}>
                        <img src={user?user.photoURL :"/user.png"} style={{width:"50px", height:"50px", borderRadius:"50%", objectFit:"cover"}}/>
                        <div className={styles.postInfo}>
                            <div className={styles.name}>{user.displayName}</div>
                        </div>
                    </div>
                    <textarea onChange={e=>setText(e.target.value)} value={text} placeholder="在想甚麼?"></textarea>
                    <div className={styles.previewbox} style={{display: "none"}} ref={refPreview}>
                        <div className={styles.previewInfo}>
                            <span>{ file && file.name}</span>
                            <button className={styles.close_btn} onClick={handleCancel}>X</button>
                        </div>
                        <img style={{height:"250px", width:"100%", objectFit:"cover"}}></img>
                    </div>
                    <div className={styles.btnList}>
                        <input type="file" style={{display: "none"}} accept="image/*" id="file" onChange={handleUpload}/>
                            <label className={classNames(styles.btn,styles.pointer,styles.bc_gray)} htmlFor="file">
                                <img src="/img.png" alt="" />
                                加入圖片
                            </label>
                        <button className={classNames(styles.btn,styles.pointer,styles.bc_blue)} onClick={handlePost}>發布</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewPost;