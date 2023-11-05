import React, {useEffect,useRef } from 'react'
import { ChatHook } from '../../hooks/ChatsHook';
import { UserHook } from '../../hooks/UserHook';

let selectedChatCompare;

const Messages = () => {

  const {loadingState,selectedChatState,oneToOneMessagesState,setOneToOneMessagesState,getOneToOneMessages,socket,notificationState,setNotificationState} = ChatHook();  
  const {myInfoState} = UserHook();  

  const ref = useRef(null);

  useEffect(()=>{
    if(selectedChatState!==undefined)
      getOneToOneMessages(selectedChatState._id);
  },[selectedChatState])

  useEffect(()=>{
    if(selectedChatState!==undefined)
      getOneToOneMessages(selectedChatState._id);

    if(oneToOneMessagesState.length){
        ref.current?.scrollIntoView({behavior:"smooth",block:"end"})
    }    

    selectedChatCompare = selectedChatState;

    // eslint-disable-next-line
  },[oneToOneMessagesState.length]);
  

  //    check whether the chatId is same or different if different then send notification...
  useEffect(()=>{
    socket.on("messageReceived",(newMessage)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chatId._id)
        {
          //  send notification...
          if(!notificationState.includes(newMessage)){
            setNotificationState([newMessage,...notificationState]);
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
                            e.sender._id!==myInfoState._id?<p className='w-fit bg-white text-black p-2 rounded-2xl rounded-tl-none max-w-[90%] md:max-w-[50%]'>
                              {e.message}
                            </p>:""
                        }
                    </div>
                    {/* Sender's message... */}
                    <div className={`${myInfoState._id!==e.sender._id?'w-[0px]':'w-full'} flex justify-end`}>
                        {
                            myInfoState._id===e.sender._id?<p className='w-fit bg-black text-white p-2 rounded-2xl rounded-br-none max-w-[90%] md:max-w-[50%]'>
                            {e.message}
                        </p>:""
                        }
                    </div> 
                </div>
            })}
        </div>
    </>
  )
}

export default Messages