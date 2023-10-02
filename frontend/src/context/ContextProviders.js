import React from 'react'
import UserContext from "../context/UserContext";
import ChatContext from "../context/ChatContext";

function ContextProviders({children}) {
  return (
    <UserContext>
      <ChatContext>
        {children}
      </ChatContext>
    </UserContext>
  )
}

export default ContextProviders