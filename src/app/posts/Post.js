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
import Comment from './Comment';
import classNames from 'classnames';

const Post = ({post}) => {
    const {user} = useContext(AuthContext);
    const { users } = useContext(UsersContext);
    const [isLike, setIsLike] = useState(false);
    const [comment, setComment] = useState("");
    const [optionIsOpen, setOptionIsOpen] = useState(false);

    useEffect(()=>{
        const getIsLike=async()=>{
            const res = await getDoc(doc(db, "posts", post[1].posterId));
            if(user.uid in res.data()[post[0]]["like"]){
                setIsLike(true);
            }
            else{
                setIsLike(false);
            }
            return ()=>{
                res();
            }
        }
        getIsLike();
    },[post]);

    const handleDeletePost=async()=>{
        try{
            await updateDoc(doc(db, "posts", post[1].posterId),{
                [post[0]]: deleteField(),
            });
        }catch (err ){
            console.log(err);
        }
    }
    const handleLike=async() => {
        // const res = await getDoc(doc(db, "posts", user.uid));
        // if(post[0] in res.data()){
        //     if(user.uid in res.data()[post[0]]["like"]){
        //         try{
        //             await updateDoc(doc(db, "posts", user.uid),{
        //                 [`${post[0]}.like.${user.uid}`]: deleteField(),
        //             });
        //         }catch (err ){
        //             console.log(err);
        //         }
        //     }
        //     else{
        //         try{
        //             await updateDoc(doc(db, "posts", user.uid),{
        //                 [`${post[0]}.like.${user.uid}`]: Timestamp.now(),
        //             });
        //         }catch (err ){
        //             console.log(err);
        //         }
        //     }
        // }
        if(isLike){
            try{
                await updateDoc(doc(db, "posts", post[1].posterId),{
                    [`${post[0]}.like.${user.uid}`]: deleteField(),
                });
            }catch (err ){
                console.log(err);
            }
        }
        else{
            try{
                await updateDoc(doc(db, "posts", post[1].posterId),{
                    [`${post[0]}.like.${user.uid}`]: Timestamp.now(),
                });
            }catch (err ){
                console.log(err);
            }
        }
    };
    const handleComment=async() => {
        try{
            await updateDoc(doc(db, "posts", post[1].posterId),{
                [post[0]+".date"]: Timestamp.now(),
                [post[0]+".comment."+uuid()]:{
                    text: comment,
                    senderId: user.uid,
                    date: Timestamp.now(),
                    like: {},
                    // img: downloadURL,
                    // filename: filename,
                }
            }
            );
        }catch (err ){
            console.log(err);
        }
        setComment("");
    };

    const handleOptionIsOpen=()=>{
        setOptionIsOpen(!optionIsOpen);
    }

    return(
        <>
            {user && 
                <div className={styles.post}>
                    <div className={styles.postTitle}>
                        <img src={users[post[1].posterId].photoURL} style={{width:"50px", height:"50px", borderRadius:"50%", objectFit:"cover"}}/>
                        <div className={styles.postInfo}>
                            <div className={styles.name}>{users[post[1].posterId].displayName}</div>
                            <div className={styles.date}>{post[1].postDate.toDate().toLocaleString()}</div>
                        </div>
                        <div className={styles.postMenu}>
                            {post[1].posterId===user.uid && <img onClick={handleOptionIsOpen} src="/option.png"/>}
                            { optionIsOpen &&
                                <div className={styles.option}>
                                    <div className={styles.optionBtn} onClick={handleDeletePost}>刪除貼文</div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.postContent}>
                        <div className={styles.text}>{post[1].text}</div>
                        {post[1].img && <img src={post[1].img} alt=""/>}
                    </div>
                    <div className={styles.postBottom}>
                        <div className={styles.like}>
                            <div className={styles.likeBtn} onClick={handleLike}>
                                {isLike ?<img src="/like-color.png"/> :<img src="/like.png"/>}
                            </div>
                            <div className={styles.likeCount}>
                                {post[1].like && Object.keys(post[1].like).length} 個讚
                            </div>
                        </div>
                        <div className={styles.line}></div>
                        <div className={styles.commentList}>
                            {post[1].comment && Object.entries(post[1].comment).sort((a,b)=>b[1].date - a[1].date).map(comment=>{
                                // console.log(comment);
                                // return(
                                //         <div key={comment[0]}>
                                //             {comment[1].senderId} : {comment[1].text} | {comment[1].date.toDate().toLocaleString()}
                                //             <div>
                                //                 Like: {Object.keys(comment[1].like).length}
                                //                 <button onClick={()=>handleLikeComment(comment[0])}>Like</button>
                                //             </div>
                                //             <button onClick={()=>handleDeleteComment(comment[0])}>刪除</button>
                                //         </div>
                                // );
                                return (<Comment post={post} comment={comment} key={comment[0]}/>);
                            })}
                        </div>
                        <div className={styles.commentInput}>
                            <img src={users[user.uid].photoURL}/>
                            <input type="text" onChange={(e)=>setComment(e.target.value)} value={comment} placeholder='留言......'/>
                            <button className={classNames(styles.btn,styles.bc_blue)} onClick={handleComment}>留言</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Post;