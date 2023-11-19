import React, { useState } from 'react'
import InputBox from '../form_inputs/InputBox'
import InputButton from '../form_inputs/InputButton'
import { ChatHook } from '../../hooks/ChatsHook'
import { CgProfile } from "react-icons/cg"
import { MdOutlineRemoveCircleOutline } from "react-icons/md"
import { MdOutlineCloseFullscreen } from "react-icons/md"
import { toast } from 'react-toastify'

const CreateGroup = ({closeGroup}) => {

  const {loadingState,userAddedToGroupState,setUserAddedToGroupState,removeFromAddingToGroup,createNewGroupChat} = ChatHook();

  //  Create group chat...
  const [groupNameState,setGroupNameState] = useState("");
  const addToTheGroup = async(e)=>{
    e.preventDefault();
    // Take only users id....
    if(String(groupNameState).length<3){
      toast.info("Group name must be 3 char long.")
      return;
    }
    if(userAddedToGroupState.length<2){
      toast.info("Atleast 2 members required.")
      return;
    }
    const userIds = userAddedToGroupState.map(e => {return e._id});
    const groupData = {groupName: groupNameState,groupUsers: JSON.stringify(userIds)}
    await createNewGroupChat(groupData);
    setUserAddedToGroupState([]);
    closeGroup(false);
    e.target.reset()
  }

  //  Close group page...
  const [closeGroupState,setCloseGroupState] = useState(false);
  const closePage = ()=>{
    setCloseGroupState(true)
    setTimeout(()=>{
      closeGroup(false);
    },700);
  }

  return (
    <>
      <div className={`${closeGroupState?"w-60":"w-full"} transition-all duration-1000 flex flex-col justify-center items-center`}>
        <div className='my-2'>
          <h1 className='text-2xl'>Create new Group</h1>
        </div>
        <div className='w-full flex justify-end'>
          <p onClick={()=>{closePage()}} className='mr-2 md:mr-10 cursor-pointer'><MdOutlineCloseFullscreen/></p>
        </div>

        <form onSubmit={addToTheGroup} className='flex flex-col items-center'>
          <div className='my-2'>
            <InputBox onChange={(e)=>{setGroupNameState(e.target.value)}} label={"Group Name"} name={"groupName"} placeHolder={"Enter group name"} type={"text"} restClass={"text-black"}/>
          </div>
          <div className='my-2'>
            <InputButton name={"Create Group"} loading={loadingState.loadingPath==="create_group_chat"?loadingState.loading:false} restClass={"rounded-lg"}/>
          </div>
        </form>

        <div>
          <div>
            <h1>Member's:</h1>
          </div>          
          <div className='my-5'>
            {
              userAddedToGroupState.map((user)=>{
                return (
                  <div key={user._id} className='w-full'>
                    <div className='flex justify-start items-center my-2'>
                      <div className="">
                        <div className='w-12 h-12 flex justify-center items-center border-2 rounded-full overflow-hidden'>
                          {
                            user.profilePicture && user.profilePicture !== ' '
                            ?   <img src={`data:image/*;base64, ${user.profilePicture}`} alt="profile" />
                            :   <span className='text-3xl'><CgProfile/></span>
                          }    
                        </div>
                      </div>
                      <div className="mx-2 flex items-center w-full">
                        <div className="flex flex-col w-[60vw] sm:w-[25vw] md:w-[20vw]">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm">{user.email}</p>
                        </div>
                        <div className='text-red-800 hover:text-red-600 cursor-pointer'>
                          <p className='scale-125' onClick={()=>{removeFromAddingToGroup(user)}}><MdOutlineRemoveCircleOutline/></p>
                        </div>
                      </div>
                    </div>
                    <hr className='bg-gray-100'/>
                  </div>
                )
              })
            }
          </div>
        </div>  
      </div>
    </>
  )
}

export default CreateGroup