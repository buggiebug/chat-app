import React from 'react'
import { ChatHook } from '../../hooks/ChatsHook';
import { CgProfile } from "react-icons/cg"

const UserModel = ({user}) => {

    const {connectWithOneToOneChat}  = ChatHook();

    const connect = async(user)=>{
        // console.log(user)
        if(user!==undefined){
            await connectWithOneToOneChat(user._id)
        }
    }

    return (
        <div className={`py-2 px-3 my-0 flex items-center cursor-pointer hover:bg-[rgba(0.5,0.5,0.5,0.3)]`} onClick={()=>{connect(user)}}>
            <div className="w-fit">
                <div className='w-12 h-12 flex justify-center items-center border-2 rounded-full overflow-hidden'>
                    {
                        user.profilePicture && user.profilePicture !== ' '
                        ?   <img src={`data:image/*;base64, ${user.profilePicture}`} alt="profile" />
                        :   <span className='text-3xl'><CgProfile/></span>
                    }    
                </div>
            </div>
            <div className="mx-2 ml-3 flex items-center justify-between w-full pb-2">
            <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between w-full">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm">{user.email}</p>
                </div>
                <div>
                <p className="text-sm text-gray-200">start GapSap ...</p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default UserModel