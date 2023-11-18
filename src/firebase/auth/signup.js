import {firebase_app, storage} from "../config";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import storeData from "../firestore/storeData";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const auth = getAuth(firebase_app);

export default async function signUp(name, email, password, file){
    let result = null, error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);

        const storageRef =  ref(storage, email);
        uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then( async(downloadURL) => {
                await updateProfile(result.user, { 
                    displayName: name,
                    photoURL: downloadURL,
                });
                await storeData("users", result.user.uid, {
                    uid: result.user.uid,
                    displayName: name,
                    email,
                });
        
                await storeData("userChats", result.user.uid, {});
                await storeData("userFriends", result.user.uid, {});
            })
        });
        
    } catch (e) {
        error = e;
    }

    return { result, error };
}