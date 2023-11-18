import React from "react";
import { ChatHook } from "../../hooks/ChatsHook";
import { UserHook } from "../../hooks/UserHook";
import {IoIosNotificationsOutline} from 'react-icons/io'
import {AiOutlineMore} from 'react-icons/ai'
import {CgProfile} from 'react-icons/cg'

const UserGrid = ({ userData }) => {

  const {openSelectedChat, selectedUserChatState,getOneToOneMessages,socket} = ChatHook();
  const {myInfoState} = UserHook();

  const openChat = async(chat)=>{
    // console.log(chat);
    if(chat!==undefined)
    {
      await openSelectedChat(chat);
      await socket.emit("joinChat",chat._id);
      //  Refresh chat page with current user chats...
      getOneToOneMessages(chat._id)
    }
  }

  return (
    <>
      <div className={`py-2 px-3 my-0 text-black flex items-center ${(userData !== undefined && selectedUserChatState!== undefined) && selectedUserChatState._id === userData._id?"bg-[rgba(0.5,0.5,0.5,0.5)]":"hover:bg-[rgba(0.5,0.5,0.5,0.3)]"}`}>
        <div className={` w-[95%] flex items-center cursor-pointer`} onClick={()=>{openChat(userData)}}>
          <div className="w-fit">
            <div className='w-12 h-12 flex justify-center items-center border-2 rounded-full overflow-hidden'>
              {
                !userData.isGroupChat ? myInfoState._id !== userData.users[1]._id ?
                (userData.users[1]?.profilePicture && userData.users[1]?.profilePicture !== ' ')
                ?   <img src={`data:image/*;base64, ${userData.users[1]?.profilePicture}`} alt={`lol`} />
                :   <span className='text-3xl'><CgProfile/></span>
                :   <img src={`data:image/*;base64, ${userData.users[0]?.profilePicture}`} alt={`lol`} />
                :   <span className='text-3xl'>{String(userData.chatName)[0]}</span>
              }
            </div>
          </div>
          <div className="mx-2 ml-3 flex items-center justify-between w-full pb-2">
            <div className="flex flex-col justify-between w-full">
              <div className="flex justify-between w-full">
                <p className="font-medium">
                  {userData.isGroupChat?userData.chatName:myInfoState._id===userData.users[0]._id?userData.users[1].name:userData.users[0].name}
                  </p>
                <p className="text-sm">{userData.lastMessageTime}</p>
              </div>
              <div>
                <p className="text-sm">{userData.latestMessage?
                  String(userData.latestMessage.message).length<=25?userData.latestMessage.message:String(userData.latestMessage.message).slice(0,25) + '...'
                  :"start GapSap ..."}
                </p>
              </div>
            </div>
            <div className="relative top-1">
              <p className="text-xl flex justify-center items-center">
                <IoIosNotificationsOutline/>
                <span className="text-[10px] relative right-[15px] -top-[1px]">
                  { userData.notify }
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className={`flex justify-center items-center`}>
          <p className="text-lg px-1 py-1 rounded-full hover:bg-[rgba(0.5,0.5,0.5,0.5)] cursor-pointer"><AiOutlineMore/></p>
        </div>
      </div>
    </>
  );
};

export default UserGrid;
