"use client"
import { useState,useEffect } from 'react'
import { Form } from './components/Form'
import { List } from './components/List'
import styles from './page.module.css';
import Link from 'next/link'
import classNames from 'classnames'
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import getData from '@/firebase/firestore/getData';


export default function Accounting(){
    const [data, setData] = useState([]);
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user])

    useEffect(()=>{
        if (user == null) {
            router.push("/");
        }
        else {
            getData(`userdata/${user.uid}/data`).then((docs) => {
                console.log(docs);
                setData(docs);
            });
        }
    },[])
    

    function getTotal(){
        let total = 0;
        for (let i = 0; i < data.length; i++){
            if(data[i].type === '支出'){
                total -= parseInt(data[i].money);
            }
            else{
                total += parseInt(data[i].money);
            }
        }
        return total;
    }
    let total = getTotal();

    return(
        <div className={styles.main}>
            <Form addData={setData}/>
            <hr className={classNames(styles.line,styles.mt20)}/>
            <List listData={data} deleteData={setData}/>
            <div className={classNames(styles.container, styles.mt20)}>
                小計 : {total}
            </div>
            <div className={classNames(styles.container, styles.mt20)}>
                <Link href="/"><button className={styles.btnw90}>返回首頁</button></Link>
            </div>
        </div>
    )
}