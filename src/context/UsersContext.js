import React, { useEffect } from 'react';
import {  db } from '@/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';


export const UsersContext = React.createContext({});

export const useUsersContext = () => React.useContext(UsersContext);

export const UsersContextProvider = ({
    children,
}) => {
    const [users, setUsers] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() =>{
        const unSub = async ()=>{
            onSnapshot(collection(db, "users"), (querySnapshot)=>{
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    setUsers(perv=>({
                        ...perv,
                        [doc.id]:doc.data(),
                    }));
                });
            })
            setLoading(false);
        }

        return ()=>{
            unSub();
        }
    },[]);
    // console.log('user: ', user);
    return (
        <UsersContext.Provider value={{ users }}>
            {loading ? <div>Loading...</div> : children}
        </UsersContext.Provider>
    );
};