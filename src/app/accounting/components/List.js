import styles from '../page.module.css';
import classNames from 'classnames'
import dropData from '@/firebase/firestore/dropData';
import { useAuthContext } from '@/context/AuthContext';

export function List({ listData, deleteData}){
    const { user } = useAuthContext()

    function deleteItem(id){
        deleteData(function(prev){
            return prev.filter(item => item.id !== id)
        })
        dropData(`userdata/${user.uid}/data`, id)
    }

    return(
        <div className={classNames(styles.lists, styles.mt20)}>
            { listData.map(function(item){
                const { id, type, money, note } = item;
                return (
                    <div className={styles.item} key={id}>
                        <div className={(type=="支出") ? classNames(styles.type, styles.red) : classNames(styles.type, styles.green)}>{(type=="支出") ? `-${money}` : `${money}`} </div>
                        <div className={styles.note}>{note}</div>
                        <div className={styles.type}>
                            <button className={styles.btnw45} onClick={()=>deleteItem(id)}>刪除</button>
                        </div>
                    </div>
                )
              }
            )}
        </div>
    )
}