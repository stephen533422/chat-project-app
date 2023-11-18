"use client";
import { useState } from 'react'
import { v4 } from "uuid";
import styles from '../page.module.css';
import classNames from 'classnames'
import storeData from '@/firebase/firestore/storeData';
import { useAuthContext } from '@/context/AuthContext';

export function Form({ addData }){
    const { user } = useAuthContext()

    const select = ["收入", "支出"]
    const [type, setType] = useState(select[0])
    function typeChange(e){
        setType(e.target.value)
    }
    const [money, setMoney] = useState("")
    function moneyChange(e){
        setMoney(e.target.value)
    }
    const [note, setNote] = useState("")
    function noteChange(e){
        setNote(e.target.value)
    }

    async function saveData(){
        const id=v4();
        addData(function(prev){
            return [
                {
                    id: id,
                    type,
                    money,
                    note,
                },
                ...prev
            ]
        })
        storeData(`userdata/${user.uid}/data`, id, { type, money, note});
    }
    //console.log(type, money, note)
    return (
        <div className={classNames(styles.form, styles.mt20)}>
            <select className={styles.typeInput} onChange={typeChange}>
                {select.map( (item)=> <option key={item}>{item}</option>) }
            </select>
            <input className={styles.moneyInput} type="text" onChange={moneyChange} placeholder='請輸入金額'/>
            <input className={styles.noteInput} type="text" onChange={noteChange} placeholder='請輸入事項'/>
            <button className={styles.btnw90} onClick={saveData}>新增紀錄</button>
        </div>
    )
}