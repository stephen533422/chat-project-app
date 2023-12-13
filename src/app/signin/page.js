'use client'
import { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation';
import styles from '@/app/signin/signinPage.module.scss';
import classNames from 'classnames'
import Link from "next/link";
import { LoadingPage } from "../component/Loading";

export default function Page() {
    const [email, setEmail] = useState("test@gmail.com");
    const [password, setPassword] = useState("^#Xs4nd5Mrrt,f=");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()
        setLoading(true);
        const { result, error } = await signIn(email, password);
        // setLoading(false);
        if (error) {
            setError(error);
            console.log(error);
            setLoading(false);
            return;
        }
        // else successful
        //console.log(result)
        router.push("/home");
    }

    return (
        <div className={styles.main}>
            <div className={styles.nav}>
                <div className={styles.indexicon} onClick={()=>router.push("/")}>
                    <img src={"/chat.png"}></img>
                    <h2>InstantChat</h2>
                </div>
                <div className={styles.btnList}>
                    {/* <div className={styles.btn} onClick={()=>router.push("/signin")}>
                        登入
                    </div> */}
                    <div className={styles.btn} onClick={()=>router.push("/signup")}>
                        註冊
                    </div>
                </div>
            </div>
            {loading && < LoadingPage /> }
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
                                <label htmlFor="email">
                                    <p>Email</p>
                                    <input onChange={(e) => setEmail(e.target.value)} value={email} required type="email" name="email" id="email" placeholder="example@mail.com" />
                                </label>
                            </div>
                            <div className={styles.inputbox}>
                            <label htmlFor="password">
                                <p>Password</p>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} required type="password" name="password" id="password" placeholder="password" />
                            </label>
                            </div>
                            {error && <span>發生錯誤，請重試</span>}
                            <div className={styles.container}>
                                <button className={styles.btn} type="submit">登入</button>
                            </div>
                        </form>
                        <div className={classNames(styles.container,styles.mt20,styles.grayborder)}>
                            <p>還沒有帳號嗎? 
                            <Link href="/signup">註冊</Link>
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
