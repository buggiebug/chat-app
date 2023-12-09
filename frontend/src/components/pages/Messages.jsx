import React, {useEffect,useRef } from 'react'
import { ChatHook } from '../../hooks/ChatsHook';
import { UserHook } from '../../hooks/UserHook';
import {CgProfile} from "react-icons/cg";
import addNotification from 'react-push-notification';

let selectedChatCompare;

const Messages = () => {

  const {loadingState,selectedChatState,oneToOneMessagesState,setOneToOneMessagesState,getAllOneToOneMessages,socket,notificationState,setNotificationState} = ChatHook();  
  const {myInfoState} = UserHook();  

  const ref = useRef(null);

  // useEffect(()=>{
  //   if(selectedChatState!==undefined)
  //     getAllOneToOneMessages(selectedChatState._id);
  // },[selectedChatState])


  useEffect(()=>{
    if(selectedChatState!==undefined)
      getAllOneToOneMessages(selectedChatState._id);

    if(oneToOneMessagesState.length){
        ref.current?.scrollIntoView({behavior:"smooth",block:"end"})
    }    

    selectedChatCompare = selectedChatState;

    // eslint-disable-next-line
  },[oneToOneMessagesState.length]);
  

  //    check whether the chatId is same or different if different then send notification...
  useEffect(()=>{
    socket.on("messageReceived",(newMessage)=>{
        if(!selectedChatCompare || (selectedChatCompare._id !== newMessage.chatId._id))
        {
          //  send notification...
          if(!notificationState.includes(newMessage)){
            console.log(newMessage)
            setNotificationState([newMessage,...notificationState]);
            addNotification({
              title: `New message from ${newMessage.sender.name}`,
              message:`Message: ${newMessage?.message} \n\nOpen GapSap to start convertation with ${newMessage.sender.name}`,
              native: true,
              duration: 10000,
              vibrate:500
            })
          }
        }else{
          setOneToOneMessagesState([...oneToOneMessagesState,newMessage])
        }
    });
  });

  return (
    <>
        <div className='w-full text-sm break-all' ref={ref}>
            {loadingState.loading===true && loadingState.loadingPath==="chatBox"?
              <div className='grid place-items-center'>Loading...</div>:
            oneToOneMessagesState.map((e,i)=>{
            return <div key={e._id} className='my-2 flex '>
                    {/* Receiver's message... */}
                    <div className={`${e.sender._id===myInfoState._id?'w-[0px]':'w-full'}`}>
                        {
                          e.sender._id!==myInfoState._id?
                          <div className='flex items-start justify-center w-fit max-w-[90%] md:max-w-[50%]'>
                            {/* This is for image... */}
                            {e.sender._id!==myInfoState._id && selectedChatState.isGroupChat===false &&
                              selectedChatState.users?.[1]?.profilePicture!==" "?
                              selectedChatState.users?.[1]._id=== e.sender?._id?
                              <img src={`data:image/*;base64, ${selectedChatState.users?.[1]?.profilePicture}`} alt={`img`} className='min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full'/>
                              :<img src={`data:image/*;base64, ${selectedChatState.users?.[0]?.profilePicture}`} alt={`img`} className='min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full'/>
                              :<span className='text-3xl'><CgProfile/></span>
                            }
                            <p className='bg-white text-black py-1 px-2 ml-2 rounded-2xl rounded-tl-none flex flex-col items-end'>
                              {e.message}
                              <span className='mt-1 text-[10px] ml-3'>{new Date(e.createdAt).toLocaleDateString() !== new Date().toLocaleDateString() ? new Date(e.createdAt).toLocaleString() : new Date(e.createdAt).toLocaleTimeString()}</span>
                            </p>
                          </div>:""
                        }
                    </div>
                    {/* Sender's message... */}
                    <div className={`${myInfoState._id!==e.sender._id?'w-[0px]':'w-full'} flex justify-end`}>
                        {
                          myInfoState._id===e.sender._id?
                          <div className='flex items-end justify-center w-fit max-w-[90%] md:max-w-[50%]'>
                            <p className='bg-black text-white py-1 px-2 mr-2 rounded-2xl rounded-br-none flex flex-col items-end'>
                              {e.message}
                              <span className='mt-1 text-[10px] ml-3'>{new Date(e.createdAt).toLocaleDateString() !== new Date().toLocaleDateString() ? new Date(e.createdAt).toLocaleString() : new Date(e.createdAt).toLocaleTimeString()}</span>
                            </p>

                            {/* This is for image... */}
                            {e.sender._id===myInfoState._id && selectedChatState.isGroupChat===false &&
                              selectedChatState.users?.[1]?.profilePicture!==" "?
                              selectedChatState.users?.[1]._id=== e.sender?._id?
                              <img src={`data:image/*;base64, ${selectedChatState.users?.[1]?.profilePicture}`} alt={`img`} className='min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full'/>
                              :<img src={`data:image/*;base64, ${selectedChatState.users?.[0]?.profilePicture}`} alt={`img`} className='min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full'/>
                              :<span className='text-3xl'><CgProfile/></span>
                            }
                          </div>:""
                        }
                    </div> 
                </div>
            })}
        </div>
    </>
  )
}

export default Messages