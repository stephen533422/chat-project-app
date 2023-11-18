import {firebase_app} from "../config";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";


const db = getFirestore(firebase_app)
export default async function dropData(collection, id) {
    let result = null;
    let error = null;

    try {
        result = await deleteDoc(doc(db, collection, id));
    } catch (e) {
        error = e;
    }

    return { result, error };
}