'use client'
import { useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import styles from '@/app/signup/signupPage.module.scss';
import classNames from 'classnames'
import Link from "next/link";
import { auth, storage } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storeData from "@/firebase/firestore/storeData";
import { LoadingPage } from "../component/Loading";

export default function Page(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const refPreview = useRef();

    const handleForm = async (e) =>{
        e.preventDefault();
        setLoading(true);
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        try{
            const result = await createUserWithEmailAndPassword(auth, email, password);

            const storageRef =  ref(storage, email);
            uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then( async(downloadURL) => {
                    await updateProfile(result.user, { 
                        displayName: displayName,
                        photoURL: downloadURL,
                    });
                    await storeData("users", result.user.uid, {
                        uid: result.user.uid,
                        displayName: displayName,
                        email,
                        photoURL: downloadURL,
                    });
            
                    await storeData("userChats", result.user.uid, {});
                    await storeData("userFriends", result.user.uid, {});
                    await storeData("userFriendsRequest", result.user.uid, {});
                    router.push("/home");
                });
            });
        }
        catch(e){
            console.log(e);
            setError(e);
            setLoading(false);
        }

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
        <div className={styles.main}>
            <div className={styles.nav}>
                <div className={styles.indexicon} onClick={()=>router.push("/")}>
                    <img src={"/chat.png"}></img>
                    <h2>InstantChat</h2>
                </div>
                <div className={styles.btnList}>
                    <div className={styles.btn} onClick={()=>router.push("/signin")}>
                        登入
                    </div>
                    {/* <div className={styles.btn} onClick={()=>router.push("/signup")}>
                        註冊
                    </div> */}
                </div>
            </div>
            { loading && <LoadingPage/>}
            <div className={styles.cardList}>
                <div className={styles.window}>
                    <div className={styles.card}>
                        <div className={styles.headline}>
                            <div className={styles.indexicon} onClick={()=>router.push("/")}>
                                <img src={"/chat.png"}></img>
                                <h2>InstantChat</h2>
                            </div>
                        </div>
                        <form onSubmit={handleForm} className={styles.form}>
                            <div className={styles.inputbox}>
                                <label htmlFor="name">
                                    <p>暱稱</p>
                                    <input required type="text" name="name" id="name" placeholder="小明" />
                                </label>
                            </div>
                            <div className={styles.inputbox}>
                                <label htmlFor="email">
                                    <p>Email</p>
                                    <input required type="email" name="email" id="email" placeholder="example@mail.com" />
                                </label>
                            </div>
                            <div className={styles.inputbox}>
                                <label htmlFor="password">
                                    <p>密碼</p>
                                    <input required type="password" name="password" id="password" placeholder="password" />
                                </label>
                            </div>
                            <div className={styles.inputbox}>
                                <label htmlFor="file">
                                        <p>上傳頭像</p>
                                        <input required type="file" id="file" onChange={handleUpload} style={{display: "none"}} accept="image/*"/>
                                        <div className={styles.upload}>
                                            <img src="/add-image.png"/>
                                            <div className={styles.previewbox} ref={refPreview}>
                                                {file && <><img></img>
                                                <span>{filename}</span>
                                                <button onClick={handleCancel}>X</button></>}
                                            </div>
                                        </div>
                                </label>
                            </div>
                            {error && <span>發生錯誤，請重試</span>}
                            <div className={classNames(styles.container,styles.mb20)}>
                                <button className={classNames(styles.btn)} type="submit">註冊</button>
                            </div>
                        </form>
                        <div className={classNames(styles.container,styles.mt20,styles.grayborder)}>
                            <p>已經有帳號了嗎? 
                            <Link href="/signin">登入</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.text}>Copyright © 2023 JT Ho.</div>
                <div className={styles.btnList}>
                    <div className={styles.btn}>
                        <Link href="https://github.com/stephen533422" target="_blank">
                            <img src="/github.png"/>
                        </Link>
                    </div>
                    <div className={styles.btn}>
                        <Link href="https://www.facebook.com/profile.php?id=100002442890704" target="_blank">
                            <img src="/facebook.png"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
