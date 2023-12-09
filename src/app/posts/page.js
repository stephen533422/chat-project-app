'use client'
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import classNames from "classnames";
import styles from '@/app/posts/postspage.module.scss';
import Nav from '@/app/component/Nav'
import PostList from "./PostList";
import NewPost from "./NewPost";
import { ref } from "firebase/storage";
import { db, storage } from "@/firebase/config";
import { v4 as uuid } from 'uuid';
import { Timestamp, arrayUnion, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";


function Page() {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const router = useRouter();
    
    useEffect(()=>{
        if (user === null) {
          router.push("/signin");
        }
    },);

    useEffect(() =>{
        const getPosts=()=>{
            const unSub = onSnapshot(doc(db, "posts", user.uid), (doc) =>{
                doc.exists() && setPosts(Object.entries(doc.data())?.sort((a,b)=>b[1].date - a[1].date));
            })
            return ()=>{
                unSub();
            }
        }
        if(user){
            getPosts();
        }
    },[user]);
 
    return (
        <>  
            {user && 
            <div className={styles.main}>
                <Nav />
                <div className={styles.section}>
                    <div className={styles.postPage}>
                        <NewPost />
                        <PostList posts={posts}/>
                        {/* <div className={styles.null}>
                            貼文功能開發中
                        </div> */}
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default Page;