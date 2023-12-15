import axios from "axios";
const baseUrl = `${process.env.REACT_APP_BE_API}/api`;
const ax = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

//  Get all chats of the user...
export const getAllChats = async()=>{
    try {
        const response = await ax.get("/chats");
        return await response.data;
    } catch (err) {
        if (err.response) {
            return await err.response.data;
        } else {
            return err;
        }
    }
}

//  Create new one to one chat with user...
export const createOneToOneChat = async(userId)=>{
    const id = {userId:userId};
    try{
        const response = await ax.post("/chats",id);
        return await response.data;
    }catch(err){
        if(err.message)
            return await err.response.data
        else
            return err;
    }
}

//  Create new group chats...
export const createGroupChat = async(data)=>{
    try{
        const response = await ax.post("/chats/group",data);
        return await response.data;
    }catch(err){
        if(err.message)
            return await err.response.data
        else
            return err;
    }
}


//  Delete all chats...
export const deleteAllChats = async(ids)=>{
    const chats = {chatIds:ids};
    try{
        const response = await ax.post("/chats/delete",chats);
        return await response.data;
    }catch(err){
        if(err.message)
            return await err.response.data
        else
            return err;
    }
}

//  Get all messages...
export const getAllMessages = async(chatId)=>{
    try{
        const response = await ax.get(`/chat/message/${chatId}`);
        return await response.data;
    }catch(err){
        if(err.message)
            return await err.response.data
        else
            return err;
    }
}

//  Send messages...
export const sendMessage = async(messageData)=>{
    try{
        const response = await ax.post(`/chat/message/send`,messageData);
        return await response.data;
    }catch(err){
        if(err.message)
            return await err.response.data
        else
            return err;
    }
}

//  Delete all messages of a chat...
export const deleteAllMessagesOfChat = async(chatId)=>{
    try {
        const response = await ax.delete(`/chat/message/${chatId}`);
        return await response.data;
    } catch (err) {
        if(err.message)
            return await err.response.data;
        else
            return err;
    }
}