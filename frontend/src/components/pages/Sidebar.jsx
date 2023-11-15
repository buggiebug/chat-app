import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { ChatHook } from "../../hooks/ChatsHook";

import UserGrid from "./UserGrid";

import {BiLogOutCircle} from "react-icons/bi"
import {HiUserGroup} from "react-icons/hi"
import {CgMenuHotdog} from "react-icons/cg"
import {RiDeleteBin5Line} from "react-icons/ri"

import {ProfileSvg,SettingSvg} from '../utils/SvgCollection';
import { UserHook } from "../../hooks/UserHook";
import UserModel from "../Models/UserModel";
import MyProfile from "./MyProfile";
import SearchUser from "../Models/SearchUser";
import CreateGroup from "./CreateGroup";

const Sidebar = ({userAwth}) => {

  const navigate = useNavigate();

  const { getMyAllChats,myAllChatsState,loadingState, deleteChats, notificationState } = ChatHook();
  const {logoutSubmit, keywordState, searchedUsersState} = UserHook();

  useEffect(() => {
    if(userAwth(" userawthtoken") || userAwth("userawthtoken")){
      navigate("/")
    }
    else if(!userAwth(" userawthtoken") || !userAwth("userawthtoken")){
      getMyAllChats();
    }
    // eslint-disable-next-line
  }, []);

  //  Open Sub menu...
  const [subMenuState,setSubMenuState] = useState(false);
  const showSubMenuButton = ()=>{
    if(subMenuState)
      setSubMenuState(false);
    else
      setSubMenuState(true);
  }

  //  Dummy function..
  const onClick = (e)=>{
    console.log(e)
  }

  //  Delete all chats...
  const deleteAllChats = async()=>{
    const chatIds = myAllChatsState?.filter((e)=> e.isGroupChat === false).map((e)=> {return e._id});
    await deleteChats(chatIds);
    setSubMenuState(false);
  }
  
  //  Logout User...
  const logoutUser = async()=>{
    if((!userAwth(" userawthtoken")) || !userAwth(" userawthtoken"))
    {
      await logoutSubmit();
      document.cookie = "userawthtoken=" + null;
      navigate("/",{replace:true});
    }
  }

  //  Change Profile View State...
  const [viewProfileState,setViewProfileState] = useState(false);
  const changeProfileView = ()=>{
    if(viewProfileState)
      setViewProfileState(false);
    else
      setViewProfileState(true);

    setSubMenuState(false);  
  }

  //  Open Create Group...
  const [viewCreateGroupState,setViewCreateGroupState] = useState(false);
  const openCreateGroup = ()=>{
    setViewCreateGroupState(viewCreateGroupState)
  }


  return (
    <>
      <div className="w-[100%]"> 
        <div className="">

          {/* Sidebar's navbar */}
          <div className="sticky top-0 bg-white h-14 text-black flex justify-between items-center px-3">
            <div className="w-full">
              <SearchUser/>
            </div>
            <div className="mx-2 text-gray-400 hover:text-gray-500">
              <button className="text-2xl" onBlur={()=>{}} onClick={showSubMenuButton}><CgMenuHotdog/></button>
              <div className={`${subMenuState?'block':'hidden'} absolute right-0 top-14 w-48 text-gray-900 bg-white rounded-lg rounded-tr-none`}>
                  <button onClick={(e)=>{changeProfileView()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <ProfileSvg/>
                    <span>Profile</span>
                  </button>
                  <button onClick={(e)=>{openCreateGroup()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <HiUserGroup/>
                    <span className="relative left-2">New Group</span>
                  </button>
                  <button onClick={()=>{deleteAllChats()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <RiDeleteBin5Line/>
                    <span className="relative left-2">Delete All Chats</span>
                  </button>
                  <button onClick={(e)=>{onClick(e)}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 hover:bg-gray-100 hover:rounded-b-lg hover:text-blue-700">
                    <SettingSvg/>
                     <span>Settings</span>
                  </button>
                  <button onClick={()=>{logoutUser()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 hover:bg-gray-100 hover:rounded-b-lg hover:text-blue-700">
                    <BiLogOutCircle/>
                     <span className="relative left-2">Logout</span>
                  </button>
              </div>
            </div>
          </div>
            

          {/* My Profile... */}
          <div className={`${viewProfileState?"w-[100%] h-[100%]":"w-[0px] h-[0px]"} transition-all duration-1000 text-ellipsis break-words overflow-hidden`}>
            <MyProfile changeProfileView={{changeProfileView}}/>
          </div>

          <CreateGroup/>

          {!viewProfileState &&
            // Display User will be there...
            <div className={``}>
              {/* Searched user will be here */}
              {keywordState?.length > 0?
                searchedUsersState?.length > 0 ?
                  searchedUsersState?.map((e)=>{
                    return <UserModel key={e._id} user={e}/>
                  })
                : <p className="flex justify-center align-middle">No user found.</p>
              : // {/* Chat History will be here */}
                loadingState.loading === true && loadingState.loadingPath === 'allChats' ? <p className="flex justify-center align-middle">Loading...</p>:
                myAllChatsState?.map((chat)=>{
                  return <UserGrid key={chat._id} userData={chat}/>
                })
              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Sidebar;
