import React, { useState } from "react";
import { ChatHook } from "../../hooks/ChatsHook";
import {AiOutlineMore,AiOutlineArrowLeft} from "react-icons/ai"
import {RiSendPlaneFill} from "react-icons/ri"
import InputButton from "../form_inputs/InputButton";
import InputBox from "../form_inputs/InputBox";
import Messages from "./Messages";
import logo from "../images/logo.jpg"
import ContactInfoModel from "./ContactInfoModel";
import { UserHook } from "../../hooks/UserHook";

const ChatPage = ({soc}) => {
  const {socketConnectedState,typingState,isTypingState,setTypingState} = soc;

  const {openSelectedChat,selectedChatState,sendMessage_C,socket,notificationState} = ChatHook();
  const {myInfoState} = UserHook();

  const [contactInfoState,setContactInfoState] = useState("hidden")
  //  Show contact info model...
  const showContactInfo = ()=>{
    setContactInfoState("visible")
  }
  
  //  Clear state and navigate to chat page...
  const backToChatHistory = ()=>{
    openSelectedChat(undefined)
  }

  //  Onchange message and typing states...
  const [messageState,setMessageState] = useState("")
  const onChangeMessage = ({target})=>{
    setMessageState(target.value);

    if(!socketConnectedState) return;
    if(!typingState){
      setTypingState(true);
      socket.emit("typing",selectedChatState._id);
    }

    let lastTypTime = new Date().getTime();
    let timerLen = 3000;
    setTimeout(()=>{
      let timeNow = new Date().getTime();
      let timeDiffer = timeNow - lastTypTime;
      if(timeDiffer >= timerLen && typingState)
      {
        socket.emit("stopTyping",selectedChatState._id);
        setTypingState(false);
      }
    },timerLen);
  }

  // on send message...
  const sendMessage = async(e)=>{

    console.log(notificationState)

    e.preventDefault();
    if(messageState.length>0)
    {
      const messageData={chatId:selectedChatState._id,message:messageState};
      await sendMessage_C(messageData);
    }
    setMessageState("");
    e.target.reset();
  }

  return (
    <>
      <div className={`h-[100vh] ${contactInfoState==="visible"?"flex justify-between":""}`}>
        {selectedChatState!==undefined?
        <div className={`h-full ${contactInfoState==="visible"?" hidden md:flex flex-col justify-between basis-[60%]":"basis-full"}`}>
          {/* Chats NavBar */}
            <div className={`sticky top-0 bg-white h-14 text-black flex justify-between items-center px-3`}>
              <div className="w-full flex items-center basis-full">
                  <span onClick={()=>{backToChatHistory()}} className="md:hidden mr-3 text-xl hover:bg-[rgba(0.5,0.5,0.5,0.1)] rounded-full cursor-pointer p-2"><AiOutlineArrowLeft/></span>
                  <div className="w-full flex justify-between text-black font-semibold items-center cursor-pointer " onClick={()=>{showContactInfo()}}>
                    <div className="flex justify-center items-center">
                      <img src={logo} alt="user" className="w-8 md:w-10 rounded-full"/>
                      <div className="inline-flex flex-col justify-center items-start">
                        <p className="ml-3">{selectedChatState.isGroupChat?selectedChatState.chatName:myInfoState._id===selectedChatState.users[0]._id?selectedChatState.users[1].name:selectedChatState.users[0].name}</p>
                        <p className="text-xs absolute top-9 ml-3 text-green-500">{isTypingState && !typingState?'typing...':''}</p>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="flex items-center justify-between basis-[20%]">
                <p></p>
                <p className="font-extrabold text-xl hover:bg-[rgba(0.5,0.5,0.5,0.1)] rounded-full p-2 cursor-pointer"><AiOutlineMore/></p>
              </div>
            </div>

            <div className={`h-[80vh] p-3 overflow-y-scroll`}>
              <Messages/>
            </div>
            
            <div className="bg-transparent">
              <div className="sticky bottom-0 bg-transparent py-2 h-20 text-black flex justify-between items-center px-3">
                <div className="w-full h-full overflow-hidden">
                    <div className="w-full text-black font-semibold">
                      {/* {isTypingState && !typingState?<div>Loading..</div>:""} */}
                      <div className="w-full flex justify-between items-center">
                        <form className="w-full flex justify-between items-center" onSubmit={sendMessage}>
                          <div className="hidden">
                            <InputBox onChange={onChangeMessage} label={" "} name={"userId"} placeHolder={" "} type={"hidden"}/>
                          </div>
                          <InputBox onChange={onChangeMessage} label={" "} name={"message"} placeHolder={"Type a message"} type={"text"} restClass={"w-full rounded-full focus:bg-white border-none focus:border-transparent"}/>
                          <InputButton name={<RiSendPlaneFill/>} restClass={"mb-2 text-2xl text-white"} loading={false}/>
                        </form>
                      </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
        :<div className="grid place-items-center h-[100vh]">
          <h1 className="text-xl">Let's do some Gap Sap</h1>
        </div>}

        {/* Contact info model... */}
        {selectedChatState!==undefined?
          <div className={`${contactInfoState} md:visible md:basis-[40%]  ${contactInfoState==="visible"?"basis-[100%]":"basis-[0%]"}`}>
            <ContactInfoModel props={{setContactInfoState,selectedChatState,myInfoState}}/>
          </div>:""
        }
      </div>
    </>
  );
};

export default ChatPage;