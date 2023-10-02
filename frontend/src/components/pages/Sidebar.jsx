import React, { useEffect, useState,useRef } from "react";
import { ChatHook } from "../../hooks/ChatsHook";

import UserGrid from "./UserGrid";
import logo from "../images/logo.jpg";

import {RxCross1} from "react-icons/rx"
import {BiSearchAlt} from "react-icons/bi"
import {IoMdArrowBack} from "react-icons/io"

const Sidebar = () => {

  const { getMyAllChats,myAllChatsState,loadingState } = ChatHook();
  useEffect(() => {
    getMyAllChats();
    // eslint-disable-next-line
  }, []);

  const [keywordState,setKeywordState] = useState("");
  const searchUsersHandleChange = ({target})=>{
    setKeywordState(target.value);
  }

  const refFocus = useRef(null);
  const searchKeyword = ()=>{
    refFocus.current.focus();
  }


  return (
    <>
      <div className="w-[100%]"> 
        <div className="">

          {/* Sidebar's navbar */}
          <div className="sticky top-0 bg-white h-14 text-black flex justify-between items-center px-3">
            <div className="w-full">
              <form>
                <div className="text-gray-500 bg-gray-100 border-2 rounded-md flex justify-between items-center px-3">
                  <input ref={refFocus} className="order-3 bg-gray-100 w-full mx-2 outline-none px-1 py-2 peer" onChange={searchUsersHandleChange} type="text" name="keyword"/>
                  <span onClick={()=>{searchKeyword()}} className="order-1 text-xl cursor-pointer peer-focus:hidden"><BiSearchAlt/></span>
                  <span onClick={()=>{setKeywordState("")}} className={`order-2 text-xl cursor-pointer hidden peer-focus:inline-block`}><IoMdArrowBack/></span>
                  <button onClick={()=>{setKeywordState("")}} className={`order-4 text-lg cursor-pointer ${keywordState.length>0?"inline-block":"hidden"}`} type="reset"><RxCross1/></button>
                </div>
              </form>
            </div>
          </div>

          {/* Chat History will be here */}
          <div className={`${keywordState.length>0?"hidden":"visible"}`}>
            <hr />
            {
              loadingState.loading===false?
              myAllChatsState.map((e)=>{
                return <UserGrid key={e._id} userData={{user:e,userPic:logo}}/>
              }):"Loading..."
            }

          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
