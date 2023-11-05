import React, { useEffect, useState,useRef,Suspense } from "react";
import {useNavigate} from "react-router-dom"
import { ChatHook } from "../../hooks/ChatsHook";

import UserGrid from "./UserGrid";
import logo from "../images/logo.jpg";

import {RxCross1} from "react-icons/rx"
import {BiSearchAlt,BiLogOutCircle} from "react-icons/bi"
import {IoMdArrowBack} from "react-icons/io"
import {HiUserGroup} from "react-icons/hi"
import {CgMenuHotdog} from "react-icons/cg"
import {RiDeleteBin5Line} from "react-icons/ri"

import {ProfileSvg,SettingSvg} from '../utils/SvgCollection';
import { UserHook } from "../../hooks/UserHook";
import UserModel from "../Models/UserModel";
import SkletonModel from "../Models/SkletonModel";
import MyProfile from "./MyProfile";

const Sidebar = ({userAwth}) => {

  const navigate = useNavigate();

  const { getMyAllChats,myAllChatsState,loadingState, deleteChats, notificationState } = ChatHook();
  const {logoutSubmit, allUsersState ,searchUserByNameEmail} = UserHook();

  useEffect(() => {
    if(userAwth(" userawthtoken") || userAwth("userawthtoken")){
      navigate("/")
    }
    else if(!userAwth(" userawthtoken") || !userAwth("userawthtoken")){
      getMyAllChats();
    }
    // eslint-disable-next-line
  }, []);

  const [keywordState,setKeywordState] = useState("");
  const searchUsersHandleChange = ({target})=>{
    setKeywordState(target.value);
    // console.log(target.value);
    searchUserByNameEmail(target.value)
  }

  const [searchButtonState,setSearchButtonState] = useState(true);
  const [backButtonState,setBackButtonState] = useState(false);
  const refFocus = useRef(null);
  const onInputFocus = ()=>{
    setSearchButtonState(false);
    setBackButtonState(true)
  }
  // const onInputFocusOut = ()=>{
  //   refFocus.current.value = '';
  //   setKeywordState('')
  //   setSearchButtonState(true);
  //   setBackButtonState(false)
  // }
  const searchKeyword = ()=>{
    refFocus.current.focus();
    setSearchButtonState(false);
    setBackButtonState(true);
  }
  const clearTextButton = ()=>{
    setKeywordState("")
    setSearchButtonState(true);
    setBackButtonState(false);
    refFocus.current.value = '';
    // console.log(myAllChatsState)
  }

  const [subMenuState,setSubMenuState] = useState(false);
  const showSubMenuButton = ()=>{
    if(subMenuState)
      setSubMenuState(false);
    else
      setSubMenuState(true);
  }

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

  const Skleton = ()=>{
    return (
      <>
        <SkletonModel/>
        <SkletonModel/>
        <SkletonModel/>
        <SkletonModel/>
        <SkletonModel/>
        <SkletonModel/>
        <SkletonModel/>
        <SkletonModel/>
      </>
    )
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


  return (
    <>
      <div className="w-[100%]"> 
        <div className="">

          {/* Sidebar's navbar */}
          <div className="sticky top-0 bg-white h-14 text-black flex justify-between items-center px-3">
            <div className="w-full">
              {/* <form> */}
                <div className="text-gray-500 bg-gray-100 border-2 rounded-md flex justify-between items-center px-3">
                  <input ref={refFocus} onFocus={()=>{onInputFocus()}} className="order-3 bg-gray-100 w-full mx-2 outline-none px-1 py-2" onChange={searchUsersHandleChange} type="text" name="keyword" placeholder="Search"/> {/**onBlur={()=>{onInputFocusOut()}} */}
                  <button type="button" onClick={()=>{searchKeyword()}} className={`${searchButtonState?"inline-block":"hidden"} order-1 text-xl cursor-pointer`}><BiSearchAlt/></button>
                  <button type="reset" onClick={()=>{clearTextButton()}} className={`${backButtonState?"inline-block":"hidden"} order-2 text-xl cursor-pointer`}><IoMdArrowBack/></button>
                  <button type="reset"onClick={()=>{clearTextButton()}} className={`order-4 text-lg cursor-pointer ${keywordState.length>0?"inline-block":"hidden"}`}><RxCross1/></button>
                </div>
              {/* </form> */}
            </div>
            <div className="mx-2 text-gray-400 hover:text-gray-500">
              <button className="text-2xl" onBlur={()=>{}} onClick={showSubMenuButton}><CgMenuHotdog/></button>
              <div className={`${subMenuState?'block':'hidden'} absolute right-0 top-14 w-48 text-gray-900 bg-white rounded-lg rounded-tr-none`}>
                  <button onClick={(e)=>{changeProfileView()}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <ProfileSvg/>
                    <span>Profile</span>
                  </button>
                  <button onClick={(e)=>{onClick(e)}} type="button" className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700">
                    <HiUserGroup/>
                    <span className="relative left-2">Create Group</span>
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
            

          { viewProfileState?
            <div className={`text-ellipsis break-words`}>
              <MyProfile/>
            </div>
          :
            // Display User will be there...
            <div className={``}>
              {/* Searched user will be here */}
              {keywordState?.length>0?
              <Suspense fallback={<Skleton/>}>
                {
                  allUsersState?.length > 0 ?
                  allUsersState?.map((e)=>{
                    return <UserModel key={e._id} user={e}/>
                  })
                  :<p className="flex justify-center align-middle">No user found.</p>
                }
              </Suspense>
              : // {/* Chat History will be here */}
              <Suspense fallback={<Skleton/>}>
                {
                  loadingState.loading === true && loadingState.loadingPath === 'allChats' ? <p className="flex justify-center align-middle">Loading...</p>:
                  myAllChatsState?.map((chat)=>{
                    return <UserGrid key={chat._id} userData={chat}/>
                  })
                }
              </Suspense>
              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Sidebar;
