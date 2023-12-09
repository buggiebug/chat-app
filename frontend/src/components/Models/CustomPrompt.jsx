import React, { useEffect, useState } from 'react'
import { UserHook } from '../../hooks/UserHook';

const CustomPrompt = () => {

  const [hidePromptState,setHidePromptState] = useState(true);
  const {promptDataState,setPromptDataState,setConfirmState} = UserHook();
  const {title,desc} = promptDataState;

  useEffect(()=>{
    if(title || desc)
      setHidePromptState(false);
    // eslint-disable-next-line
  },[title,desc])

  const hidePrompt = ()=>{
    setPromptDataState({title:"",desc:""})
    setHidePromptState(true);
    setConfirmState(false);
  }

  const confirmPrompt = ()=>{
    setPromptDataState({title:"",desc:""});
    setHidePromptState(true);
    setConfirmState(true);
  }

  return (
    <div className={`${!hidePromptState?"absolute":"hidden"} grid place-items-center top-0 bg-[rgba(.5,.5,.5,.5)] shadow-inner w-[100vw] h-[100vh] z-50`}>
      <div className='w-[280px] md:w-[500px] h-[200px] md:h-[300px] flex flex-col justify-between px-2 md:px-0 py-5 md:py-10 items-center bg-white rounded-md'>
        <div className=''>
          <div className=''>
            {title && <p className='text-xl md:text-2xl'>{title}</p>}
          </div>
          <div className='mt-5'>
            {desc && <p>{desc}</p>}
          </div>
        </div>
        <div className='flex'>
          <button onClick={()=>{hidePrompt()}} className='text-sm md:text-lg rounded-md outline-none border-0 mx-10 px-3 py-2 text-white backdrop:opacity-90 transition-all duration-500 bg-red-500'>Cancel</button>
          <button onClick={()=>{confirmPrompt()}} className='text-sm md:text-lg rounded-md outline-none border-0 mx-10 px-3 py-2 text-white backdrop:opacity-90 transition-all duration-500 bg-blue-500'>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default CustomPrompt;