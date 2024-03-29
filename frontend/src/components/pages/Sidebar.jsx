import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom"
import { ChatHook } from "../../hooks/ChatsHook";

import UserGrid from "../Models/UserGrid";

import {HiMiniChatBubbleLeftRight} from "react-icons/hi2"
import {BiLogOutCircle} from "react-icons/bi"
import {HiUserGroup} from "react-icons/hi"
import {CgMenuHotdog,CgProfile} from "react-icons/cg"
import {RiDeleteBin5Line} from "react-icons/ri"
// import {IoPersonAddSharp} from "react-icons/io5"
import {MdOutlineNextPlan,MdOutlineRemoveCircleOutline,MdOutlineBlock} from "react-icons/md"

import {ProfileSvg} from '../utils/SvgCollection';
import { UserHook } from "../../hooks/UserHook";
import SearchUserModel from "../Models/SearchUserModel";
import MyProfile from "./MyProfile";
import SearchBar from "../Models/SearchBar";
import SkletonModel from "../Models/SkletonModel";
import CreateGroup from "./CreateGroup";
import InputButton from "../form_inputs/InputButton";

const Sidebar = ({userAwth}) => {

  const navigate = useNavigate();

  const { getMyAllChats,myAllChatsState,loadingState, deleteChats, userAddedToGroupState, removeFromAddingToGroup } = ChatHook();
  const {confirmState,setConfirmState, promptMessageCall,logoutSubmit, searchUserKeywordState, searchedUsersState} = UserHook();

  const [promptDataState,setPromptDataState] = useState({for:"",chatIds:""});
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

  //  Delete all chats...
  const deleteAllChats = async()=>{
    const chatIds = myAllChatsState?.filter((e)=> e.isGroupChat === false).map((e)=> {return e._id});
    promptMessageCall(`Do you want to delete chats !`,`Please confirm to clear your chat history.`);
    setPromptDataState({for:"deleteAllChats",chatIds:chatIds});
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
    if(viewCreateGroupState)
      setViewCreateGroupState(false);
    else{
      setViewCreateGroupState(true);
      setViewProfileState(false);
    }

    setSubMenuState(false); 
  }


  //  Close user search box...
  const closeRef = useRef();
  const closeUserSearchBoxAndGoToNextStep = ()=>{
    closeRef.current.click();
  }


  //  Blocked users...
  const blockedUsers = ()=>{

  }


  //  Close all tabs...
  const closeAllTabs = ()=>{
    setViewProfileState(false);
    setViewCreateGroupState(false);
    setSubMenuState(false);
  }


  useEffect(()=>{
    if(confirmState && promptDataState.chatIds && promptDataState.for==="deleteAllChats"){
      deleteChats(promptDataState.chatIds);
      setConfirmState(false);
      setPromptDataState({});
    }
    // eslint-disable-next-line
  },[confirmState])


  //  Showing users for create group with Image and Name only...
  const UserShow = (user)=>{
    return(
      <>
        <div className="flex flex-col justify-center items-center">
          <div className='w-12 h-12 flex justify-center items-center border-2 rounded-full overflow-hidden'>
            {
              user.profilePicture && user.profilePicture !== ' '
              ?   <img src={`data:image/*;base64, ${user.profilePicture}`} alt="profile" />
              :   <span className='text-3xl'><CgProfile/></span>
            }
          </div>
          <p className="font-medium">{user.name}</p>    
          <div className='mx-5 mt-2 text-red-800 hover:text-red-600 cursor-pointer'>
            <p className='scale-125' onClick={()=>{removeFromAddingToGroup(user)}}><MdOutlineRemoveCircleOutline/></p>
          </div> 
        </div>
      </>
    )
  }


  return (
    <>
      <div className="w-[100%]"> 
        <div className="">

          {/* Sidebar's navbar */}
          <div className="sticky top-0 min-h-[56px] bg-white h-14 text-black flex justify-between items-center lg:pl-3 pl-1">
            {/* Search Bar... */}
            <div className="w-full">
              <SearchBar someRef={{closeRef,viewCreateGroupState}}/>
            </div>
            {/* Sub menus... */}
            <div className="mx-1 text-gray-400 hover:text-gray-500">
              <button className={`text-2xl ${subMenuState?"rotate-90 scale-110":"rotate-0"} duration-1000`} onBlur={()=>{}} onClick={showSubMenuButton}><CgMenuHotdog/></button>
              <div className={`${subMenuState?'block':'hidden'} absolute right-0 top-14 w-48 text-gray-900 bg-white rounded-lg rounded-tr-none`}>
                  
                  {
                  (viewProfileState || viewCreateGroupState) &&  
                  <button onClick={()=>{closeAllTabs()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <HiMiniChatBubbleLeftRight/>
                    <span className="relative left-2">Chats</span>
                  </button>
                  }

                  <button onClick={()=>{changeProfileView()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <ProfileSvg/>
                    <span>Profile</span>
                  </button>
                  <button onClick={()=>{openCreateGroup()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <HiUserGroup/>
                    <span className="relative left-2">New Group</span>
                  </button>
                  <button onClick={()=>{deleteAllChats()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <RiDeleteBin5Line/>
                    <span className="relative left-2">Delete All Chats</span>
                  </button>
                  <button onClick={()=>{blockedUsers()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <MdOutlineBlock/>
                    <span className="relative left-2">Blocked Users</span>
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

          {!viewProfileState &&
            // Display User will be there...
            <div className={``}>
              {/* Searched user will be here */}
              {searchUserKeywordState?.length > 0?
                searchedUsersState?.length > 0 ?
                  <>
                    {
                      // If selected [create group] then show group creation info else add user to the chat...
                      viewCreateGroupState?
                      <>
                        {/* Show users which will be added into the group... */}
                        <div className={`${userAddedToGroupState.length<=0?"hidden":"block"}`}>
                          <div className={`flex overflow-x-scroll overflow-y-hidden mt-5 mx-1`}>
                            {userAddedToGroupState.map((e)=>{
                              return (
                                <div key={e._id} className="mx-2">
                                  {UserShow(e)}
                                </div>
                              )
                            })}
                          </div>
                          <div className="flex justify-end m-1 -mt-3 cursor-pointer">
                            <div className="rounded-full text-green-800 hover:text-white">
                              <InputButton name={<MdOutlineNextPlan/>} restClass={"border-0 text-3xl px-0 py-0"} btnType="button" onClickMethod={()=>{closeUserSearchBoxAndGoToNextStep()}}/>
                            </div>
                          </div>
                        </div>
                        <hr />
                        {
                          // This is for group chat...
                          searchedUsersState?.map((e)=>{
                            return <SearchUserModel key={e._id} user={e} isForGroup={viewCreateGroupState} closeUserSearchBoxAndGoToNextStep={closeUserSearchBoxAndGoToNextStep}/>
                          })
                        }
                      </>
                      :
                      // This is for create direct chat [oneToOneChat]...
                      searchedUsersState?.map((e)=>{
                        return <SearchUserModel key={e._id} user={e} isForGroup={viewCreateGroupState} closeUserSearchBoxAndGoToNextStep={closeUserSearchBoxAndGoToNextStep}/>
                      })
                    }
                  </>
                : <p className="flex justify-center align-middle">No user found.</p>
              : // {/* Chat History will be here */}
                !viewCreateGroupState?
                loadingState.loading && loadingState.loadingPath === 'allChats' ? <SkletonModel/> :
                myAllChatsState?.length <= 0 ? <div className="mt-10 text-center">
                  <p>No chat found. <span className="text-3xl">🤷‍♂️</span></p>
                  <p className="mt-5 text-sm">Search your fav people and <br/> add to start GapSap</p>
                </div>:
                myAllChatsState?.map((chat)=>{
                  return <UserGrid key={chat._id} userData={chat}/>
                })
                : <CreateGroup closeGroup={setViewCreateGroupState}/>  // Create group...
              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Sidebar;
