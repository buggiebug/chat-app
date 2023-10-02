import React from 'react'

const Messages = ({senderMessage,receiverMessage}) => {

  return (
    <>
        <div className='w-full my-2 flex text-sm'>
            <div className='w-full'>
                {
                    senderMessage!==""?<p className='w-fit bg-white text-black p-2 rounded-2xl rounded-tl-none'>
                        {senderMessage}
                    </p>:""
                }
            </div>
            <div className='w-full flex justify-end'>
                {
                    receiverMessage!==""?<p className='w-fit bg-white text-black p-2 rounded-2xl rounded-br-none'>
                        {receiverMessage}
                    </p>:""
                }
            </div> 
        </div>
    </>
  )
}

export default Messages