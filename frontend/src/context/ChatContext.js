import { React, createContext, useState } from "react";
import { getAllChats, createOneToOneChat, getAllMessages, sendMessage, deleteAllChats,createGroupChat, deleteAllMessagesOfChat } from "../api/ChatApi";
import { toast } from "react-toastify";

import { io } from "socket.io-client";
const API = "http://localhost:8000"; //process.env.REACT_APP_API_URL;
let socket;

export const CreateChatContext = createContext();

function ChatContext({ children }) {
  socket = io(API);

  const [loadingState, setLoadingState] = useState({
    loading: false,
    loadingPath: "",
  });
  const [myAllChatsState, setMyAllChatsState] = useState([]);
  const [selectedChatState, setSelectedChatState] = useState();
  const [selectedUserChatState, setSelectedUserChatState] = useState("");
  const [oneToOneMessagesState, setOneToOneMessagesState] = useState([]);
  const [notificationState, setNotificationState] = useState([]);

  const getMyAllChats = async () => {
    setLoadingState({ loading: true, loadingPath: "allChats" });
    const res = await getAllChats();
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setMyAllChatsState(res.chats);
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Open Selected Chat...
  const openSelectedChat = (e) => {
    // console.log("Chat : ",e);
    setSelectedUserChatState(e);
    setSelectedChatState(e);
  };

  //  Create OneToOne Chat...
  const connectWithOneToOneChat = async(userId)=>{
    setLoadingState({ loading: true, loadingPath: "oneToOneChat" });
    const res = await createOneToOneChat(userId);
    if (res.success) {
      if(Array.isArray(res.isChat)){
        setMyAllChatsState([...res.isChat,...myAllChatsState]);
      }else{
        setMyAllChatsState([res.isChat,...myAllChatsState]);
      }
      setLoadingState({ loading: false, loadingPath: "" });
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  }

  //  Get all messages...
  const getAllOneToOneMessages = async (chatId) => {
    setLoadingState({ loading: true, loadingPath: "chatBox" });
    const res = await getAllMessages(chatId);
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setOneToOneMessagesState(res.message);
      return true;
    }
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Send message...
  const sendMessage_C = async (messageData) => {
    setLoadingState({ loading: true, loadingPath: "sendMessage" });
    const res = await sendMessage(messageData);
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setOneToOneMessagesState([...oneToOneMessagesState, res.message]);
      //  Send new messages...
      await socket.emit("newMessage", res.message);
      await socket.emit("stopTyping", selectedChatState._id);
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Delete all chats...
  const deleteChats = async(ids)=>{
    setLoadingState({ loading: true, loadingPath: "chatsDelete" });
    const res = await deleteAllChats(ids);
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setMyAllChatsState(res.chats);
      toast.info(res.message);
      return true;
    }
    toast.info(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  }

  //  Users for group chats...
  const [userAddedToGroupState,setUserAddedToGroupState] = useState([]);
  //  Remove users form adding to the group...
  const removeFromAddingToGroup = (user)=>{
    setUserAddedToGroupState(userAddedToGroupState.filter((e)=>e._id !== user._id));
  }

  // Create group chats...
  const createNewGroupChat = async(groupChatData)=>{
    setLoadingState({ loading: true, loadingPath: "create_group_chat" });
    const res = await createGroupChat(groupChatData);
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setMyAllChatsState(res.chats);
      toast.info(res.message);
      return true;
    }
    toast.info(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  }

  //  Delete all messages of a chat...
  const deleteAllMessagesFromChat = async(chatId)=>{
    setLoadingState({ loading: true, loadingPath: "delete_messages" });
    const res = await deleteAllMessagesOfChat(chatId);
    if(res.success){
      setOneToOneMessagesState([]);
      setLoadingState({loading:false,loadingPath:""});
      toast.success(res.message);
      return true;
    }
    toast.info(res.message);
    setLoadingState({loading:false,loadingPath:""});
  }

  return (
    <CreateChatContext.Provider
      value={{
        socket,
        loadingState,
        getMyAllChats,
        myAllChatsState,
        openSelectedChat,
        selectedChatState,
        selectedUserChatState,
        connectWithOneToOneChat,
        oneToOneMessagesState,
        setOneToOneMessagesState,
        getAllOneToOneMessages,
        sendMessage_C,
        notificationState,
        setNotificationState,
        deleteChats,
        userAddedToGroupState,
        setUserAddedToGroupState,
        removeFromAddingToGroup,
        createNewGroupChat,
        deleteAllMessagesFromChat
      }}
    >
      {children}
    </CreateChatContext.Provider>
  );
}

export default ChatContext;
