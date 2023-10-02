import React from 'react'
import logo from "../images/logo.jpg";

import {RxCross1} from "react-icons/rx";
import {HiOutlineDotsVertical} from "react-icons/hi";

const ContactInfoModel = ({props}) => {

  const {setContactInfoState,selectedChatState} = props;  
  
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
                <img
                    src={logo}
                    alt="logo"
                    className="w-12 md:w-16 rounded-full"
                />
                <p className="my-2 text-xl">{selectedChatState.isGroupChat?selectedChatState.chatName:selectedChatState.users[1].name}</p>
            </div>
            <div className=''>
                <hr />
                {selectedChatState.isGroupChat?
                <div>
                    <ul className="">
                        {selectedChatState.users.map((e,i)=>{
                            return <li key={e._id} className="flex justify-between items-center hover:bg-[rgba(.5,.5,.5,.2)] py-4 px-3">
                                <div className='flex'>
                                    <img className="h-10 w-10 rounded-full" src={logo} alt="logo" />
                                    <div className="ml-3 overflow-hidden">
                                        <p className="text-sm font-medium">{e.name}</p>
                                        <p className="text-sm text-slate-200 truncate">{e.email}</p>
                                    </div>
                                </div>
                                <p className='cursor-pointer'><HiOutlineDotsVertical/></p>
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