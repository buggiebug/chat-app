import React, { useState } from "react";
import socialImage from '../images/social_img.png';
import Signup from "./Signup";
import Login from "./Login";

function Auth() {

  const [authState,setAuthState] = useState({signupShow:false,loginShow:true});
  const loginSignupState = (str)=>{
    if(str==="signupShow") {
      setAuthState({signupShow:true,loginShow:false});
    } else {
      setAuthState({signupShow:false,loginShow:true});
    }
  }

  return <>
    <div className="">
      <div className={`flex md:justify-normal justify-around items-center md:items-start md:h-0`}>

        <div className={`hidden md:basis-1/2 md:flex justify-center items-center h-[100vh] px-10`}>
          <img className={`mix-blend-multiply`} src={socialImage} alt='socialImage'/>
        </div>
             
        <div className={`md:basis-1/2 flex flex-col justify-center h-[100vh] w-[70%]`}>
          <div className="w-full uppercase text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-medium text-teal-900">Welcome to Gap Sap</h1>
          </div>
          {authState.signupShow ?
          <div className={`w-full grid place-items-center ${authState.signupShow}`}>
            <Signup loginSignupState={loginSignupState}/>
          </div>:
          <div className={`w-full grid place-items-center ${authState.loginShow}`}>
            <Login loginSignupState={loginSignupState}/>
          </div>}
        </div>

      </div>
    </div>
  </>;
}

export default Auth;

