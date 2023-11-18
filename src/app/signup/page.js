'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css';
import classNames from 'classnames'
import Link from "next/link";
import { auth, storage } from "@/firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import storeData from "@/firebase/firestore/storeData";

export default function Page(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const router = useRouter();

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
                    router.push("/");
                });
            });
        }
        catch(e){
            console.log(e);
            setError(e);
            setLoading(false);
        }

    }

    return (
        <div className={styles.main}>
            <div className={styles.card}>
                <form onSubmit={handleForm} className={classNames(styles.form,styles.grayborder)}>
                    <div className={classNames(styles.indexicon)}>
                        <h2>InstantChat</h2>
                    </div>
                    <div className={styles.inputbox}>
                        <label htmlFor="name">
                            <p>暱稱</p>
                            <input required type="text" name="name" id="name" placeholder="小明" />
                        </label>
                    </div>
                    <div className={styles.inputbox}>
                        <label htmlFor="email">
                            <p>Email</p>
                            <input  required type="email" name="email" id="email" placeholder="example@mail.com" />
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
                                <input className={styles.input} required type="file" id="file" />
                        </label>
                    </div>
                    {loading && <span>上傳資料中，請稍後</span>}
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
    );
}
