'use client'
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/profile/profilePage.module.scss';
import Nav from '@/app/component/Nav'
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";


function Page() {
    const {user} = useContext(AuthContext);
    const [userdata, setUserdata] = useState({});
    const [background, setBackground]=useState(null);
    const [avastar, setAvastar]=useState(null);
    const [displayName, setDisplayName]=useState("");
    const [about, setAbout]=useState("");

    useEffect(() => {
        const getUserdata = ()=>{
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                console.log(doc.data());
                setUserdata(doc.data());
            });

            return ()=>{
                unsub();
            };
        };
        if(user)
            user.uid && getUserdata();
    },[user]);

    const handleEdit=(e, type)=>{
        switch(type){
            case "background": 
                console.log(e.target.files[0]);
                setBackground(e.target.files[0]);
                break;
            case "avastar":
                console.log(e.target.files[0]);
                setAvastar(e.target.files[0]);
                break;
            case "displayName":
                console.log(e.target.value);
                setDisplayName(e.target.value);
                break;
            case "about":
                console.log(e.target.value);
                setAbout(e.target.value);
                break;
        }
    };
    const handleUpload=async (type)=>{
        const storageRef =  ref(storage, user.email);
        switch(type){
            case "background":
                uploadBytesResumable(storageRef, background).then(() => {
                    getDownloadURL(storageRef).then( async(downloadURL) => {
                        await updateDoc(doc(db, "users", user.uid),{
                            backgroundURL: downloadURL,
                        });
                    });
                });
                setBackground(null);
                break;
            case "avastar":
                uploadBytesResumable(storageRef, avastar).then(() => {
                    getDownloadURL(storageRef).then( async(downloadURL) => {
                        await updateProfile(user, { 
                            photoURL: downloadURL,
                        });
                        await updateDoc(doc(db, "users", user.uid),{
                            photoURL: downloadURL,
                        });
                    });
                });
                setAvastar(null);
                break;
            case "displayName":
                await updateProfile(user, { 
                    displayName: displayName,
                });
                await updateDoc(doc(db, "users", user.uid),{
                    displayName: displayName,
                });
                setDisplayName("");
                break;
            case "about":
                await updateDoc(doc(db, "users", user.uid),{
                    about: about,
                });
                setAbout("");
                break;
        }
    }

    return (
        <>  
            <div className={styles.main}>
                <Nav />
                <div className={styles.section}>

                    <div className={styles.profilePage}>
                        <div className={styles.background}>
                            <LazyLoadImage 
                                src={userdata.backgroundURL?userdata.backgroundURL:"/gray.jpg"} 
                                effect='opacity' 
                                wrapperProps={{
                                    style: {display: "inline"},
                                }} 
                                alt="Image"/>
                            <div className={styles.edit}>
                                <input type="file" style={{display: "none"}} id="background" onChange={(e)=>handleEdit(e,"background")}/>
                                <label htmlFor="background">編輯</label>
                                <button onClick={()=>handleUpload("background")}>確認</button>
                            </div>
                        </div>
                        <div className={styles.userbox}>
                            <div className={styles.avatar}>
                                <LazyLoadImage src={userdata.photoURL?userdata.photoURL:"/user.png"} height={168} width={168} effect='opacity' alt="Image" />
                                <div className={styles.edit}>
                                    <input type="file" style={{display: "none"}} id="avastar" onChange={(e)=>handleEdit(e,"avastar")}/>
                                    <label htmlFor="avastar">編輯</label>
                                    <button onClick={()=>handleUpload("avastar")}>確認</button>
                                </div>
                            </div>
                            <div className={styles.information}>
                                <div className={styles.displayName}>
                                    <span>{userdata.displayName}</span>
                                    <div className={styles.edit}>
                                        <input type="text" onChange={(e)=>handleEdit(e,"displayName")} value={displayName}/>
                                        <button onClick={()=>handleUpload("displayName")}>確認</button>
                                    </div>
                                </div>
                                <div className={styles.about}>
                                    <h3>關於我:</h3>
                                    <p>
                                        {userdata.about?userdata.about:"暫無資料"}
                                    </p>
                                    <div className={styles.edit}>
                                        <input type="text" onChange={(e)=>handleEdit(e,"about")} value={about}/>
                                        <button onClick={()=>handleUpload("about")}>確認</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                            {/* <div className={styles.null}>
                                個人主頁功能開發中
                            </div> */}
                        </div>
                    </div>

            </div>
        </>
    );
}

export default Page;