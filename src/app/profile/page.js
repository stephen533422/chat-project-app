'use client'
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/profile/profilePage.module.scss';
import Nav from '@/app/component/Nav'
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import { Loading } from "../component/Loading";


function Page() {
    const {user} = useContext(AuthContext);
    const [userdata, setUserdata] = useState({});
    const [background, setBackground]=useState(null);
    const [avastar, setAvastar]=useState(null);
    const [displayName, setDisplayName]=useState("");
    const [about, setAbout]=useState("");
    const [editIsOpen, setEditIsOpen]=useState(false);
    const [loading, setLoading] = React.useState(true);

    const refBackground=useRef();
    const refAvastar=useRef();
    const router = useRouter();
    
    useEffect(()=>{
        if (user == null) {
          router.push("/signin");
        }
    },);

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
        setLoading(false);
    },[user]);

    const customStyles = {
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          height: "85%",
        },
    };
    const handelEditOpen=()=>{
        setEditIsOpen(!editIsOpen);
    }

    const handleEdit=(e, type)=>{
        setLoading(true);
        switch(type){
            case "background": 
                console.log(e.target.files[0]);
                setBackground(e.target.files[0]);
                var reader = new FileReader();
                reader.onload = function (e) {
                    refBackground.current.children[0].children[0].src = e.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
                break;
            case "avastar":
                console.log(e.target.files[0]);
                setAvastar(e.target.files[0]);
                var reader = new FileReader();
                reader.onload = function (e) {
                    refAvastar.current.children[0].children[0].src = e.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
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
        setLoading(false);
    };
    const handleUpload=async (type)=>{
        setLoading(true);
        const storageRef =  ref(storage, `${user.email}/${type}`);
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
        setLoading(false);
    }

    const handleCancel = (type)=>{
        switch(type){
            case "background":
                setBackground(null);
                refBackground.current.children[0].children[0].src=userdata.backgroundURL;
                break;
            case "avastar":
                setAvastar(null);
                refAvastar.current.children[0].children[0].src=userdata.photoURL;
                break;
        }
    }

    return (
        <>  
            <div className={styles.main}>
                <Nav />
                <div className={styles.section}>
                    {loading ? <Loading/> : <>
                    <div className={styles.profilePage}>
                        <div className={styles.background}>
                            <LazyLoadImage 
                                src={userdata.backgroundURL?userdata.backgroundURL:"/gray.jpg"} 
                                effect='opacity' 
                                wrapperProps={{
                                    style: {display: "inline"},
                                }} 
                                alt="Image"/>
                        </div>
                        <div className={styles.userbox}>
                            <div className={styles.avatar}>
                                <LazyLoadImage src={userdata.photoURL?userdata.photoURL:"/user.png"} height={168} width={168} effect='opacity' alt="Image" />
                            </div>
                            <div className={styles.information}>
                                <div className={styles.displayName}>
                                    <span>{userdata.displayName}</span>
                                </div>
                                <div className={styles.about}>
                                    <h3>關於我:</h3>
                                    <p>
                                        {userdata.about?userdata.about:"暫無資料"}
                                    </p>
                                </div>
                            </div>
                            <div className={classNames(styles.btn, styles.pointer)} onClick={handelEditOpen}>編輯個人檔案</div>
                        </div>
                    </div>
                    <Modal
                        isOpen={editIsOpen}
                        style={customStyles}
                        onRequestClose={handelEditOpen}
                        contentLabel="Modal"
                        ariaHideApp={false}
                    >
                        <div className={styles.modal}>
                            <div className={styles.title}>編輯個人資料</div>
                            <button className={styles.closebtn} onClick={handelEditOpen}>
                                <img src="/cross.png"></img>
                            </button>
                            <div className={styles.profilePage}>
                                <div ref={refBackground} className={styles.background}>
                                    <LazyLoadImage 
                                        src={userdata.backgroundURL?userdata.backgroundURL:"/gray.jpg"} 
                                        effect='opacity' 
                                        wrapperProps={{
                                            style: {display: "inline"},
                                        }} 
                                        alt="Image"/>
                                    <div className={styles.edit}>
                                        <input type="file" style={{display: "none"}} id="background" onChange={(e)=>handleEdit(e,"background")} accept="image/*"/>
                                        {background===null && <label htmlFor="background">上傳</label>}
                                        {background!==null && <>
                                            <button onClick={()=>{handleCancel("background")}}>取消</button>
                                            <button onClick={()=>{handleUpload("background")}}>確認</button>
                                        </>}
                                    </div>
                                </div>
                                <div className={styles.userbox}>
                                    <div ref={refAvastar} className={styles.avatar}>
                                        <LazyLoadImage 
                                            src={userdata.photoURL?userdata.photoURL:"/user.png"}  
                                            effect='opacity' 
                                            wrapperProps={{
                                                style: {display: "flex"},
                                            }}  
                                            alt="Image" />
                                        <div className={styles.edit}>
                                            <input type="file" style={{display: "none"}} id="avastar" onChange={(e)=>handleEdit(e,"avastar")} accept="image/*"/>
                                            {avastar===null && <label htmlFor="avastar">上傳</label>}
                                            {avastar!==null && <>
                                                <button onClick={()=>{handleCancel("avastar")}}>取消</button>
                                                <button onClick={()=>{handleUpload("avastar")}}>確認</button>
                                            </>}
                                        </div>
                                    </div>
                                    <div className={styles.information}>
                                        <div className={styles.displayName}>
                                            {/* <h5>暱稱:</h5> */}
                                            {displayName==="" && <>
                                                    <span>{userdata.displayName}</span>
                                                    </>}
                                            <div className={styles.edit}>
                                                {displayName==="" && <>

                                                    <button onClick={()=>setDisplayName(userdata.displayName)}>編輯</button>
                                                    </>}
                                                {displayName!=="" && <>
                                                    <input type="text" onChange={(e)=>handleEdit(e,"displayName")} value={displayName}/>
                                                    <button onClick={()=>setDisplayName("")}>取消</button>
                                                    <button onClick={()=>handleUpload("displayName")}>確認</button>
                                                </>}
                                            </div>
                                        </div>
                                        <div className={styles.about}>
                                            <p>關於我:</p>
                                                {about==="" && <>
                                                    <span>{userdata.about}</span>
                                                    </>}
                                            <div className={styles.edit}>
                                                {about==="" && <>
                                                    <button onClick={()=>setAbout(userdata.about)}>編輯</button>
                                                    </>}
                                                {about!=="" && <>
                                                    <textarea type="text" onChange={(e)=>handleEdit(e,"about")} value={about} placeholder="介紹下自己吧"/>
                                                    <button onClick={()=>setAbout("")}>取消</button>
                                                    <button onClick={()=>handleUpload("about")}>確認</button>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    </>
                    }
                </div>

            </div>
        </>
    );
}

export default Page;