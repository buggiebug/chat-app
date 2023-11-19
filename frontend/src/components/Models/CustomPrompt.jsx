import React from 'react'

const CustomPrompt = ({info}) => {
  const {message} = info;  
  return (
    <div className='absolute bg-black w-[400px] h-[400px]'>
        <h1>{message}</h1>
    </div>
  )
}

export default CustomPrompt;