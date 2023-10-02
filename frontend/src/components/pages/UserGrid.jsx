import React from "react";
import { ChatHook } from "../../hooks/ChatsHook";

const UserGrid = ({ userData }) => {

  const {openSelectedChat, selectedUserChatState} = ChatHook();

  const openChat = async(e)=>{
    if(e!==undefined)
    {
      await openSelectedChat(e);
    }
  }

  return (
    <>
      <div className={`py-2 px-3 my-0 flex items-center cursor-pointer ${(userData.user !== undefined && selectedUserChatState!== undefined) && selectedUserChatState._id === userData.user._id?"bg-[rgba(0.5,0.5,0.5,0.5)]":"hover:bg-[rgba(0.5,0.5,0.5,0.3)]"}`} onClick={()=>{openChat(userData.user)}}>
        <div className="w-fit">
          <img
            src={userData.userPic}
            alt="logo"
            className="w-10 md:w-12 rounded-full"
          />
        </div>
        <div className="mx-2 ml-3 flex flex-col justify-between w-full pb-2">
          <div className="flex justify-between w-full">
            <p className="font-medium">{userData.user.isGroupChat?userData.user.chatName:userData.user.users[1].name}</p>
            <p className="text-sm">{userData.user.lastMessageTime}</p>
          </div>
          <div>
            <p className="text-sm">Let's do some gap sap.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserGrid;
