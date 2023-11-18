"use client"
import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();



export const ChatContextProvider = ({children}) => {
    const {user} = useContext(AuthContext);
    /*
    {
        user:{},
        chatId,
    }
    */
    const INITIAL_STATE = {
        chatId:"null",
        chatroomInfo:{},
        member:[],
    }

    const chatReducer = (state, action)=>{
        switch(action.type) {
            case "CHANGE_USER":
                return{
                    chatId: action.payload.chatroomInfo.uid,
                    member: action.payload.member,
                    chatroomInfo: action.payload.chatroomInfo
                }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{data: state, dispatch}}>
            {children}
        </ChatContext.Provider>
    );
}