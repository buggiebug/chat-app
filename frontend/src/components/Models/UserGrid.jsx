import React,{useEffect, useState} from "react";
import { ChatHook } from "../../hooks/ChatsHook";
import { UserHook } from "../../hooks/UserHook";
import {IoIosNotificationsOutline} from 'react-icons/io'
import {CgProfile} from 'react-icons/cg'

const UserGrid = ({ userData }) => {

  const {openSelectedChat, selectedUserChatState, getAllOneToOneMessages, socket, notificationState} = ChatHook();
  const {myInfoState} = UserHook();

  const openChat = async(chat)=>{
    // console.log(chat);
    if(chat!==undefined)
    {
      await openSelectedChat(chat);
      await socket.emit("joinChat",chat._id);
      //  Refresh chat page with current user chats...
      getAllOneToOneMessages(chat._id)
    }
  }

  // Show notification...
  const [totalNotificationState,setTotalNotificationState] = useState(0);
  useEffect(()=>{
    for(let i=0;i<notificationState?.length;i++){
      if(userData?._id===notificationState[i]?.chatId?._id)
      {
        setTotalNotificationState(totalNotificationState+1);
      }
    }
    // eslint-disable-next-line
  },[notificationState.length])

  return (
    <>
      <div className={`py-2 px-3 my-0 text-white flex items-center ${(userData !== undefined && selectedUserChatState!== undefined) && selectedUserChatState._id === userData._id?"bg-[rgba(0.5,0.5,0.5,0.5)]":"hover:bg-[rgba(0.5,0.5,0.5,0.3)]"}`}>
        <div className={`w-full flex items-center cursor-pointer`} onClick={()=>{openChat(userData)}}>
          <div className="w-fit">
            <div className='w-12 h-12 flex justify-center items-center border-2 rounded-full overflow-hidden'>
              {
                !userData.isGroupChat ? myInfoState._id !== userData.users[1]._id ?
                (userData.users[1]?.profilePicture && userData.users[1]?.profilePicture !== ' ')
                ?   <img src={`data:image/*;base64, ${userData.users[1]?.profilePicture}`} alt={`img`} />
                :   <span className='text-3xl'><CgProfile/></span>
                :   userData.users[0]?.profilePicture && userData.users[0]?.profilePicture !== ' '
                ?   <img src={`data:image/*;base64, ${userData.users[0]?.profilePicture}`} alt={`img`} />
                :   <span className='text-3xl'><CgProfile/></span>
                :   <span className='text-3xl'>{String(userData.chatName)[0]}</span>
              }
            </div>
          </div>
          <div className="mx-2 ml-3 flex items-center justify-between w-full pb-2">
            <div className="flex flex-col justify-between w-full">
              <div className="flex justify-between w-full">
                <p className="font-medium w-[55vw] sm:w-[22vw] md:w-[22vw] lg:w-[18vw] truncate">
                  {userData.isGroupChat?userData.chatName:myInfoState._id===userData.users[0]._id?userData.users[1].name:userData.users[0].name}
                  </p>
                <p className="text-sm">{userData.lastMessageTime}</p>
              </div>
              <div>
                <p className="text-sm w-[55vw] sm:w-[18vw] truncate">{userData?.latestMessage ? userData?.latestMessage?.message
                  :"start GapSap ..."}
                </p>
              </div>
            </div>
            <div className="relative top-1">
              {
                totalNotificationState > 0 && <>
                  <p className="text-xl flex justify-center items-center">
                    <span className="text-4xl"><IoIosNotificationsOutline/></span>
                    <span className="text-[10px] relative right-[23px] -top-[1px]">{totalNotificationState}</span>
                  </p>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserGrid;
