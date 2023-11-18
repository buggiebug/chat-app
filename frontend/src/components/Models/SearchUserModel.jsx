import React from 'react'
import { ChatHook } from '../../hooks/ChatsHook';
import { CgProfile } from "react-icons/cg"
import { IoPersonAddSharp } from "react-icons/io5"

const UserModel = ({user,isForGroup}) => {

    const {connectWithOneToOneChat,userAddedToGroupState,setUserAddedToGroupState}  = ChatHook();

    
    // Check if chat is for group then add the users to the list else create chat directly...
    const connect = async(user)=>{
        // console.log(user)
        if(user!==undefined && !isForGroup){
            await connectWithOneToOneChat(user._id)
        }
        if(isForGroup){
            let isAlreadyUser = userAddedToGroupState.some((us)=>{
                return us._id===user._id;
            })
            if(!isAlreadyUser)
                setUserAddedToGroupState([...userAddedToGroupState,user]);
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
                    <div className="flex justify-between items-center w-full">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm scale-110"><IoPersonAddSharp/></p>
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