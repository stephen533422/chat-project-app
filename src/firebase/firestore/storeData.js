import {firebase_app} from "../config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(firebase_app)
export default async function storeData(collection, id, data) {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db, collection, id), data);
    } catch (e) {
        error = e;
        console.log(e);
    }

    return { result, error };
}
