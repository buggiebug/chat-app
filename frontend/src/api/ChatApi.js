import axios from "axios";
const baseUrl = `http://localhost:8000/api`;
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
    try{
        const response = await ax.post("/chats",userId);
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