import React from 'react'

const CustomPrompt = ({info}) => {
  const {message} = info;  
  return (
    <div className='absolute grid place-items-center left-[20%] top-[25%] bg-black w-[50px] h-[400px] z-50'>
      <h1>{message}</h1>
    </div>
  )
}

export default CustomPrompt;