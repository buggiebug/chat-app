import React, { useState } from "react";
import { ChatHook } from "../../hooks/ChatsHook";
import {AiOutlineMore,AiOutlineArrowLeft,AiOutlineLoading3Quarters} from "react-icons/ai"
import {RiSendPlaneFill} from "react-icons/ri"
import {CgProfile} from "react-icons/cg"
import {CiCirclePlus} from "react-icons/ci"
import {MdOutlineDeleteSweep,MdBlockFlipped} from "react-icons/md"
import InputButton from "../form_inputs/InputButton";
import InputBox from "../form_inputs/InputBox";
import Messages from "./Messages";
import ContactInfoModel from "./ContactInfoModel";
import { UserHook } from "../../hooks/UserHook";
import CustomPrompt from "../Models/CustomPrompt";

const ChatPage = ({soc}) => {
  const {socketConnectedState,typingState,isTypingState,setTypingState} = soc;

  const {socket, loadingState, openSelectedChat, selectedChatState, sendMessage_C, deleteAllMessagesFromChat, notificationState} = ChatHook();
  const {myInfoState,blockSingleUserById} = UserHook();

  //  Open Sub menu...
  const [subMenuState,setSubMenuState] = useState(false);
  const showSubMenuButton = ()=>{
    if(subMenuState)
      setSubMenuState(false);
    else
      setSubMenuState(true);
  }

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

    // console.log(notificationState)
    console.log(selectedChatState)

    e.preventDefault();
    if(messageState.length>0)
    {
      const messageData={chatId:selectedChatState._id,message:messageState};
      await sendMessage_C(messageData);
    }
    setMessageState("");
    e.target.reset();
  }

  //  Delete messages by using chat id...
  const clearChatHistory = async(chat)=>{
    await deleteAllMessagesFromChat(chat._id);
    setSubMenuState(false)
  }
  
  //  Block user by using user id...
  const blockUser = async(selectUser)=>{
    const selectedUser = selectUser?.users?.filter(e=>e._id!==myInfoState._id);
    await blockSingleUserById(selectedUser[0]?._id)
    setSubMenuState(false)
  }


  return (
    <>
      <div className={`h-[100vh] ${contactInfoState==="visible"?"flex justify-between":""}`}>
        {selectedChatState!==undefined?
        <div className={`h-full ${contactInfoState==="visible"?"hidden lg:flex flex-col justify-between w-0 basis-[0%] lg:w-auto lg:basis-[60%]":"basis-full"} flex flex-col justify-between`}>
          {/* Chats NavBar */}
            <div className={`sticky top-0 bg-white min-h-[56px] h-14 text-black flex justify-between items-center px-1 sm:px-3`}>
              <div className="w-full flex items-center basis-full">
                  <span onClick={()=>{backToChatHistory()}} className="md:hidden mr-1 sm:mr-3 text-xl hover:bg-[rgba(0.5,0.5,0.5,0.1)] rounded-full cursor-pointer p-2"><AiOutlineArrowLeft/></span>
                  <div className="w-full flex justify-between text-black font-semibold items-center cursor-pointer " onClick={()=>{showContactInfo()}}>
                    <div className="flex justify-center items-center overflow-hidden">
                      <div className="w-12 h-12 flex justify-center items-center border-2 rounded-full overflow-hidden">
                        {
                          !selectedChatState.isGroupChat ? myInfoState._id !== selectedChatState.users[1]._id ?
                          (selectedChatState.users[1]?.profilePicture && selectedChatState.users[1]?.profilePicture !== ' ')
                          ?   <img src={`data:image/*;base64, ${selectedChatState.users[1]?.profilePicture}`} alt={`lol`}/>
                          :   <span className='text-3xl'><CgProfile/></span>
                          :   selectedChatState.users[0]?.profilePicture && selectedChatState.users[0]?.profilePicture !== ' '
                          ?   <img src={`data:image/*;base64, ${selectedChatState.users[0]?.profilePicture}`} alt={`img`} />
                          :   <span className='text-3xl'><CgProfile/></span>
                          :   <span className='text-3xl relative -top-[2px] left-[1px]'>{String(selectedChatState.chatName)[0]}</span>
                        }
                      </div>
                      <div className="inline-flex flex-col justify-center items-start">
                        <p className="ml-3 w-[50vw] sm:w-[22vw] md:w-[22vw] lg:w-[18vw] truncate">{selectedChatState.isGroupChat?selectedChatState.chatName:myInfoState._id===selectedChatState.users[0]._id?selectedChatState.users[1].name:selectedChatState.users[0].name}</p>
                        <p className="text-xs absolute top-9 ml-3 text-green-500">{isTypingState && !typingState?'typing...':''}</p>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="flex items-center justify-between basis-[20%]">
                <p></p>
                <p onClick={showSubMenuButton} className="font-extrabold text-xl hover:bg-[rgba(0.5,0.5,0.5,0.1)] rounded-full p-2 cursor-pointer"><AiOutlineMore/></p>
                {/* Sub menus... */}
                <div className="absolute top-0 -right-1 mx-1 text-gray-400 hover:text-gray-500">
                  <div className={`${subMenuState?'block':'hidden'} absolute right-0 top-14 w-32 text-gray-900 bg-white rounded-lg rounded-tr-none`}>
                      <button onClick={()=>{clearChatHistory(selectedChatState)}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                        <span className="text-lg"><MdOutlineDeleteSweep/></span>
                        <span className="relative left-2">Clear Chat</span>
                      </button>
                      <button onClick={()=>{blockUser(selectedChatState)}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                        <span className=""><MdBlockFlipped/></span>
                        <span className="relative left-3">Block</span>
                      </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages drops here... */}
            <div className={`p-3 overflow-y-scroll w-full min-h-[80vh]`} id="messageDrops">
              {
                loadingState.loading===true && loadingState.loadingPath==="delete_messages" ?
                  <div className="h-full flex justify-center items-center text-3xl animate-spin duration-1000"><AiOutlineLoading3Quarters/></div>
                :<></>
              }
              <Messages/>
              {/* // TODO */}
              {/* <CustomPrompt info={{message:"Delete this"}}/>  */}
            </div>
            
            {/* Send messages... */}
            <div className="bg-[#154f4dde]">
              <div className="sticky bottom-0 bg-transparent py-2 h-16 text-black flex justify-between items-center px-1">
                <div className="w-full h-full overflow-hidden flex items-center">
                    <div className="w-full text-black font-semibold">
                      {/* {isTypingState && !typingState?<div>Loading..</div>:""} */}
                      <div className="w-full flex justify-between items-center">
                        <form className="w-full flex justify-between items-center" onSubmit={sendMessage}>
                          <div className="hidden">
                            <InputBox onChange={onChangeMessage} label={" "} name={"userId"} placeHolder={" "} type={"hidden"}/>
                          </div>
                            <div className="flex w-full items-center">
                              <p className="text-3xl text-white mr-1 cursor-pointer"><CiCirclePlus/></p>
                              <InputBox onChange={onChangeMessage} label={" "} name={"message"} placeHolder={"Type a message"} type={"text"} restClass={"w-full rounded-full focus:bg-white border-none focus:border-transparent"} autoComplete="off"/>
                            </div>
                            <InputButton name={<RiSendPlaneFill/>} restClass={"mb-2 text-2xl text-white border-0"} loading={false}/>
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
          <div className={`${contactInfoState} md:visible md:basis-full lg:basis-[40%] ${contactInfoState==="visible"?"basis-[100%]":"basis-[0%]"}`}>
            <ContactInfoModel props={{setContactInfoState,selectedChatState,myInfoState}}/>
          </div>:""
        }
      </div>
    </>
  );
};

export default ChatPage;
