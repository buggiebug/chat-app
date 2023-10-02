import React from "react";

import ChatPage from "./ChatPage";
import Sidebar from "./Sidebar";

import { ChatHook } from "../../hooks/ChatsHook";

function Home() {

  const {selectedUserChatState} = ChatHook();

  return <>
    <div className="bg-[#21ABA5] h-[100vh] text-white flex justify-between">
      {/* Sidebar */}
      <div className={`${selectedUserChatState?"basis-0":"basis-full"} sm:basis-[50%] md:basis-[30%] sm:border-r-2 md:border-r-2 overflow-x-hidden overflow-y-scroll`}>
        <Sidebar/>
      </div>
      {/* Chats */}
      <div className={`${selectedUserChatState?"basis-full":"basis-0"} sm:basis-[50%] md:basis-[70%] overflow-x-hidden overflow-hidden`}>
        <ChatPage/>
      </div>
    </div>
  </>;
}

export default Home;
