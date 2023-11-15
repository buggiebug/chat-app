import React, { useEffect,useRef, useState } from 'react'
import { UserHook } from '../../hooks/UserHook'
import {convertImageToBase64} from "../utils/FileHandling";

import {CgProfile} from "react-icons/cg" 
import {MdOutlineCloseFullscreen} from "react-icons/md" 
import { toast } from 'react-toastify'

const MyProfile = ({changeProfileView}) => {

    const refBrowseFiles = useRef();

    const {getUserInfo,myInfoState,uploadProfilePhoto} = UserHook();
    useEffect(()=>{
        getUserInfo();
        // eslint-disable-next-line
    },[]);


    // Close profile...
    const closeProfile = ()=>{
        changeProfileView?.changeProfileView(false)
    }

    //  Update profile picture...
    const loadPhoto = ()=>{
        refBrowseFiles.current.click();
    }
    const [profilePhotoState,setProfilePhotoState] = useState();
    const onFileChange = async({target})=>{
        try {
            const uploadPhoto = new FormData();
            uploadPhoto.append("avatar",target.files[0]);
            setProfilePhotoState(await convertImageToBase64(uploadPhoto));
            await uploadProfilePhoto(uploadPhoto);
        } catch (err) {
            toast.error(err.message);
        }
    }

  return (
    <>
        <div className='flex flex-col justify-center items-center mt-10'>
            <div className='w-full flex flex-col justify-center'>
                <div className='flex justify-end mr-5 text-sm text-gray-300'>
                    <input type="file" ref={refBrowseFiles} accept='image/*' name='avatar' onChange={onFileChange} className='hidden'/>
                    <button onClick={closeProfile} className='cursor-pointer text-2xl text-white' title='close'><MdOutlineCloseFullscreen/></button>
                </div>
                <div className='flex justify-center'>
                    <div onClick={loadPhoto} className='hover: w-28 h-28 flex justify-center items-center border-2 rounded-full overflow-hidden cursor-pointer'>
                        {
                            myInfoState.profilePicture && myInfoState.profilePicture !== ' '
                            ?
                            <img src={`${profilePhotoState ? profilePhotoState : 'data:image/*;base64,' + myInfoState.profilePicture}`} alt="profile" />
                            :
                            <span className='text-3xl'><CgProfile/></span>
                        }
                    </div>
                </div>
            </div>
            <div className='mt-5'>
                <p className='text-center font-medium text-xl'>{myInfoState.name}</p>
                <div className='mt-3'>
                    <p className=''>{myInfoState.email}</p>
                    <p className=''>
                        <span>Active Status : </span>
                        <select name="activeStatus" className='text-black outline-none bg-transparent'>
                            <option className='capitalize' value="online">{myInfoState.activeStatus}</option>
                            <option className='capitalize' value="away">Away</option>
                            <option className='capitalize' value="offline">Offline</option>
                        </select>
                    </p>
                </div>
            </div>
        </div>
    </>
  )
}

export default MyProfile