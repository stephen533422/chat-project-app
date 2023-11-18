import {firebase_app} from "../config";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app)
export default async function getDocument(col) {
    let result = null;
    let error = null;
    let data= [];
    try {
        const querySnapshot = await getDocs(collection(db, col));
        querySnapshot.forEach((doc)=>{
            //console.log(doc.id);
            //console.log(doc.data());
            var rObj = {
                id: doc.id,
                type: doc.data().type,
                money: doc.data().money,
                note: doc.data().note,
            };
            data.push(rObj);
        })
        //console.log("data: ",data);
    } catch (e) {
        error = e;
    }
    return data;
}

