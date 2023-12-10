import React from "react";
import styles from "@/app/posts/postspage.module.scss"
import Post from "./Post";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function  PostList({posts})  {

  return (
        <div className={styles.postList}>
          {
            !posts &&
              <div className={styles.post}>
                <div className={styles.postTitle}>
                    <Skeleton height={50} width={50} circle={true}/>
                    <div className={styles.postInfo}>
                        <div className={styles.name}>
                          <Skeleton height={"100%"} width={"50%"}/>
                        </div>
                        <div className={styles.date}>
                          <Skeleton height={"100%"} width={"50%"}/>
                        </div>
                    </div>
                    <div className={styles.postMenu}>
                    </div>
                </div>
                <div className={styles.postContent}>
                    <div className={styles.text}>
                      <Skeleton height={"100%"} width={"50%"} count={3}/>
                    </div>
                </div>
                <div className={styles.postBottom}>
                    <div className={styles.like}>
                        <div className={styles.likeBtn} >
                        </div>
                        <div className={styles.likeCount}>
                        </div>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.commentList}>
                    </div>
                    <div className={styles.commentInput}>
                    </div>
                </div>
            </div>
          }          
          {posts && posts.map(post=>{
              // console.log(m);
              return <Post post={post} key={post[0]}/>;
          })}
        </div>
  );
};