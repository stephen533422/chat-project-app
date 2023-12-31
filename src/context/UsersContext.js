import React from 'react';
import { db } from '@/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { LoadingPage } from '@/app/component/Loading';


export const UsersContext = React.createContext({});

export const useUsersContext = () => React.useContext(UsersContext);

export const UsersContextProvider = ({
    children,
}) => {
    const [users, setUsers] = React.useState(null);
    const [loading, setLoading] = React.useState(true);


    React.useEffect(() =>{
        const unSub = onSnapshot(collection(db, "users"), (querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                console.log(doc.id, doc.data());
                // doc.data() is never undefined for query doc snapshots

                setUsers(perv=>({
                    ...perv,
                    [doc.id]:doc.data(),
                }));
            });
        });
        setLoading(false);
        return ()=>unSub();
    },[]);
    // console.log('user: ', user);
    return (
        <UsersContext.Provider value={{ users }}>
            {loading ? <LoadingPage/> : children}
        </UsersContext.Provider>
    );
};