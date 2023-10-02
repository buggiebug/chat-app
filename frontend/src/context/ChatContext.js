import { React, createContext, useState } from "react";
import { getAllChats } from "../api/ChatApi";
import { toast } from "react-toastify";

export const CreateChatContext = createContext();

function ChatContext({ children }) {
  const [loadingState, setLoadingState] = useState({
    loading: false,
    loadingPath: "",
  });
  const [myAllChatsState, setMyAllChatsState] = useState([]);
  const [selectedChatState, setSelectedChatState] = useState();
  const [selectedUserChatState, setSelectedUserChatState] = useState("");

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
    setSelectedUserChatState(e);
    setSelectedChatState(e);
    console.log(e);
  };

  return (
    <CreateChatContext.Provider
      value={{
        getMyAllChats,
        loadingState,
        myAllChatsState,
        openSelectedChat,
        selectedChatState,
        selectedUserChatState,
      }}
    >
      {children}
    </CreateChatContext.Provider>
  );
}

export default ChatContext;
