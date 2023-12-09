import React from "react";
import styles from "@/app/posts/postspage.module.scss"
import Post from "./Post";

export default function  PostList({posts})  {

  return (
        <div className={styles.postList}>
            {posts && posts.map(post=>{
                // console.log(m);
                return <Post post={post} key={post[0]}/>;
            })}
        </div>
  );
};