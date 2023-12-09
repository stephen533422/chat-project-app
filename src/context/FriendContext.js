"use client"
import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const FriendContext = createContext();



export const FriendContextProvider = ({children}) => {
    /*
    {
        user:{},
        chatId,
    }
    */
    const INITIAL_STATE = {
        chatroomId: "null",
        date: null,
        uid: "null",
    }

    const chatReducer = (state, action)=>{
        switch(action.type) {
            case "CHANGE_USER":
                return{
                    chatroomId: action.payload.chatroomId,
                    date: action.payload.date,
                    uid: action.payload.userInfo.uid,
                }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <FriendContext.Provider value={{data: state, dispatch}}>
            {children}
        </FriendContext.Provider>
    );
}