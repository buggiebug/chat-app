import React, { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom";

import ChatPage from "./ChatPage";
import Sidebar from "./Sidebar";

import { ChatHook } from "../../hooks/ChatsHook";
import { UserHook } from "../../hooks/UserHook";

function Home() {

  const {selectedUserChatState,socket} = ChatHook();
  const {getUserInfo,myInfoState} = UserHook();

  
  const navigate = useNavigate();

  //  Check cookie...
  const tokens = document.cookie.split(";")
  const userToken = tokens.map((e)=>{return e.split("=")[0]});
  //  Return true/false if token is null
  function tokenName(str){
    if(userToken.includes(str)){
      // console.log(tokens[userToken.indexOf(str)])
      return tokens[userToken.indexOf(str)].split("=")[1] === String(null)
    }
  }

  useEffect(()=>{
    if(tokenName(" userawthtoken") || tokenName("userawthtoken")){
      navigate("/",{replace:true})
    }
    else if(!tokenName(" userawthtoken") || !tokenName("userawthtoken")){
      getUserInfo();
    }
    // eslint-disable-next-line 
  },[]);


  //  Check socket connection state...
  const [socketConnectedState,setSocketConnectedState] = useState(false);
  //  Typing State...
  const [typingState,setTypingState] = useState(false);
  const [isTypingState,setIsTypingState] = useState(false);

  useEffect(()=>{
    //  Connect Socket to the chat...
    socket.emit("setup",myInfoState);
    socket.on("connected",()=>setSocketConnectedState(true));
    socket.on("typing",()=>setIsTypingState(true));
    socket.on("stopTyping",()=>setIsTypingState(false));
  });

  return <>
    <div className="bg-[#21ABA5] h-[100vh] text-white flex justify-between">
      {/* Sidebar */}
      <div className={`${selectedUserChatState?"basis-0":"basis-full"} sm:basis-[42%] md:basis-[40%] lg:basis-[30%] sm:border-r-2 md:border-r-2 overflow-x-hidden overflow-y-scroll`}>
        <Sidebar userAwth={tokenName}/>
      </div>
      {/* Chats */}
      <div className={`${selectedUserChatState?"basis-full":"basis-0"} sm:basis-[58%] md:basis-[60%] lg:basis-[70%] overflow-x-hidden overflow-hidden`}>
        <ChatPage soc={{socketConnectedState,typingState,isTypingState,setTypingState}}/>
      </div>
    </div>
  </>;
}

export default Home;
