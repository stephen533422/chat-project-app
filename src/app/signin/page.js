'use client'
import { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css';
import classNames from 'classnames'
import Link from "next/link";

export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

        if (error) {
            setError(error);
            console.log(error);
            return;
        }

        // else successful
        //console.log(result)
        router.push("/");
    }

    return (
        <div className={styles.main}>
            <div className={styles.card}>
                <form onSubmit={handleForm} className={classNames(styles.form,styles.grayborder)}>
                    <div className={classNames(styles.indexicon)}>
                        <h2>InstantChat</h2>
                    </div>
                    <div className={styles.inputbox}>
                        <label htmlFor="email">
                            <p>Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
                        </label>
                    </div>
                    <div className={styles.inputbox}>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
                    </label>
                    {error && <span>發生錯誤，請重試</span>}
                    </div>
                    <div className={classNames(styles.container,styles.mb20)}>
                        <button className={classNames(styles.btn)} type="submit">登入</button>
                    </div>
                </form>
                <div className={classNames(styles.container,styles.mt20,styles.grayborder)}>
                    <p>還沒有帳號嗎? 
                    <Link href="/signup">註冊</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
