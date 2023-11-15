import React from 'react'
import logo from "../images/logo.jpg";

import {RxCross1} from "react-icons/rx";
import {CgProfile} from "react-icons/cg";
import {HiOutlineDotsVertical} from "react-icons/hi";

const ContactInfoModel = ({props}) => {

  const {setContactInfoState,selectedChatState,myInfoState} = props;  

  const removeUser = (id)=>{
    console.log(id);
  }
  
  return (
    <>
    <div className='w-full md:border-l-2 h-full overflow-y-scroll'>
        <div className={`sticky top-0 bg-white h-14 text-black flex justify-between items-center px-3`}>
            <div className="w-full basis-full">
                <div className="w-full flex justify-between text-black font-semibold items-center">
                    <div className="flex justify-center items-center">
                        <p className="ml-3 cursor-pointer hover:bg-[rgba(.5,.5,.5,.1)] p-2 rounded-full" onClick={()=>{setContactInfoState("hidden")}}><RxCross1/></p>
                        <p className="ml-3">Contact Info</p>
                    </div>
                </div>
            </div>
        </div>
        <div className=''>
            <div className='flex flex-col justify-center items-center py-8'>
                <div className="w-20 h-20 flex justify-center items-center border-2 rounded-full overflow-hidden">
                    {
                        !selectedChatState.isGroupChat ? myInfoState._id !== selectedChatState.users[1]._id ?
                        (selectedChatState.users[1]?.profilePicture && selectedChatState.users[1]?.profilePicture !== ' ')
                        ?   <img src={`data:image/*;base64, ${selectedChatState.users[1]?.profilePicture}`} alt={`lol`}/>
                        :   <span className='text-3xl'><CgProfile/></span>
                        :   <img src={`data:image/*;base64, ${selectedChatState.users[0]?.profilePicture}`} alt={`lol`}/>
                        :   <span className='text-3xl relative -top-[2px] left-[1px]'>{String(selectedChatState.chatName)[0]}</span>
                    }
                </div>
                <p className="my-2 text-xl">{selectedChatState.isGroupChat?selectedChatState.chatName:myInfoState._id===selectedChatState.users[0]._id?selectedChatState.users[1].name:selectedChatState.users[0].name}</p>
            </div>
            <div className=''>
                <hr />
                {selectedChatState.isGroupChat?
                <div>
                    <ul className="">
                        {selectedChatState.users.map((e,i)=>{
                            return <li key={e._id} className="flex justify-between items-center hover:bg-[rgba(.5,.5,.5,.2)] py-4 px-3">
                                <div className='flex'>
                                    <div className="w-10 h-10 flex justify-center items-center border-2 rounded-full overflow-hidden">
                                        {
                                            e?.profilePicture && e?.profilePicture !== ' ' && e?.profilePicture!==undefined && e?.profilePicture!==null? 
                                            <img src={`data:image/*;base64, ${e?.profilePicture}`} alt={`lol`}/>
                                            : <span className='text-3xl'><CgProfile/></span>
                                        }
                                    </div>
                                    <div className="ml-3 overflow-hidden">
                                        <p className="text-sm font-medium">{e.name}</p>
                                        <p className="text-sm text-slate-200 truncate">{e.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='cursor-pointer p-1 rounded-full hover:bg-[rgba(.5,.5,.5,.1)] peer'><HiOutlineDotsVertical/></p>
                                    <div className="absolute right-0 invisible hover:visible peer-hover:visible -mt-1 mr-5">
                                        <div className="flex flex-col ring-1 ring-white shadow-lg rounded-sm py-1 text-sm">
                                            <button onClick={()=>{removeUser(e._id)}} className='hover:bg-red-700 text-white'>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
                :""}
                <div>

                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ContactInfoModel