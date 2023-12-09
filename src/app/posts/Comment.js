import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "@/app/posts/postspage.module.scss"
import classnames from 'classnames';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';
import Link from 'next/link';
import { Timestamp, arrayUnion, collection, deleteField, doc, getDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { v4 as uuid } from "uuid";
import { UsersContext } from '@/context/UsersContext';
import classNames from 'classnames';

const Comment = ({post, comment}) => {
    const {user} = useContext(AuthContext);
    const { users } = useContext(UsersContext);
    const [isLike, setIsLike] = useState(false);
    const [optionIsOpen, setOptionIsOpen]=useState(false);
    // console.log(comment);

    useEffect(()=>{
        const getIsLike=async()=>{
            if(user.uid in comment[1]["like"]){
                setIsLike(true);
            }
            else{
                setIsLike(false);
            }
        }
        getIsLike();
    },[comment]);

    const handleLikeComment=async(id)=>{
        // const res = await getDoc(doc(db, "posts", user.uid));
        // if(post[0] in res.data()){
        //     if(id in res.data()[post[0]]["comment"] && user.uid in res.data()[post[0]]["comment"][id]["like"]){
        //         try{
        //             await updateDoc(doc(db, "posts", user.uid),{
        //                 [post[0]+".comment."+id+".like."+user.uid]: deleteField(),
        //             });
        //         }catch (err ){
        //             console.log(err);
        //         }
        //     }
        //     else{
        //         try{
        //             await updateDoc(doc(db, "posts", user.uid),{
        //                 [post[0]+".comment."+id+".like."+user.uid]: Timestamp.now(),
        //             });
        //         }catch (err ){
        //             console.log(err);
        //         }
        //     }
        // }
        if(isLike){
            try{
                await updateDoc(doc(db, "posts", post[1].posterId),{
                    [post[0]+".comment."+id+".like."+user.uid]: deleteField(),
                });
            }catch (err ){
                console.log(err);
            }
        }
        else{
            try{
                await updateDoc(doc(db, "posts", post[1].posterId),{
                    [post[0]+".comment."+id+".like."+user.uid]: Timestamp.now(),
                });
            }catch (err ){
                console.log(err);
            }
        }
    }
    const handleDeleteComment=async(id) => {
        try{
            await updateDoc(doc(db, "posts", post[1].posterId),{
                [post[0]+".comment."+id]: deleteField(),
            });
        }catch (err ){
            console.log(err);
        }
    }
    const handleOptionIsOpen=(e)=>{
        e.stopPropagation();
        setOptionIsOpen(!optionIsOpen);
    }

    return(
        <>
            <div className={styles.comment}>
                <div className={styles.commentContent}>
                    <img src={users[comment[1].senderId].photoURL}/>
                        <div className={styles.commentInfo}>
                            <div className={styles.name}>{users[comment[1].senderId].displayName}</div>
                            <div className={styles.text}>{comment[1].text}</div>
                        </div>
                        <div className={styles.commentMenu}>
                            { (comment[1].senderId === user.uid || post[1].posterId === user.uid) && 
                                <img onClick={(e)=>handleOptionIsOpen(e)} src="/option.png"/>}
                            { optionIsOpen &&
                                <div className={styles.option}>
                                    <div className={styles.optionBtn} onClick={()=>handleDeleteComment(comment[0])}>刪除留言</div>
                                </div>
                            }
                        </div>
                </div>
                <div className={styles.commentBottom}>
                    <div className={styles.like}>
                        <div className={isLike ?classNames(styles.likeBtn, styles.c_blue) :styles.likeBtn} onClick={()=>handleLikeComment(comment[0])}>
                            讚
                        </div>
                        <div className={styles.likeCount}>
                            {Object.keys(comment[1].like).length + " 個讚"}
                        </div>
                    </div>
                    <div className={styles.date}>{comment[1].date.toDate().toLocaleString()}</div>
                </div>
            </div>
        </>
    )
}

export default Comment;
