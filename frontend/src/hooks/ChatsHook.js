import { useContext } from "react";
import {CreateChatContext} from "../context/ChatContext"

export const ChatHook = ()=>{
    return useContext(CreateChatContext);
}