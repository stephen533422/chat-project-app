"use client"
import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const FriendContext = createContext();



export const FriendContextProvider = ({children}) => {
    const {user} = useContext(AuthContext);
    /*
    {
        user:{},
        chatId,
    }
    */
    const INITIAL_STATE = {
        chatroomId: "",
        friendInfo: {},
    }

    const chatReducer = (state, action)=>{
        switch(action.type) {
            case "CHANGE_USER":
                return{
                    chatroomId: action.payload.chatroom?.chatroomId,
                    friendInfo: action.payload.userInfo
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