import React from 'react'
import UserContext from "../context/UserContext";;


function ContextProviders({children}) {
  return (
    <UserContext>
        {children}
    </UserContext>
  )
}

export default ContextProviders