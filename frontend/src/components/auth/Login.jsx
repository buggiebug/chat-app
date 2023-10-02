import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputBox from "../form_inputs/InputBox"
import InputButton from "../form_inputs/InputButton";
import Helper from "../utils/Helper.js";

import {toast} from 'react-toastify';

import {UserHook} from "../../hooks/UserHook";

function Login(props) {

  const {loginSignupState} = props;

  const navigate = useNavigate();
  const {loadingState,loginSubmit} = UserHook();


  // Helper Class which can validate the data...
  const helper = new Helper();

  const [userDataState,setUserDataState] = useState({email:"",password:""});
  const onChange = (e)=>{
    let {target} = e;
    setUserDataState({...userDataState,[target.name]:target.value});
  }

  // Submit user details...
  const onLoginSubmit = async(e)=>{
    e.preventDefault();

    if (!helper.verifyEmail(userDataState.email)) {
        toast.error("Invalid Email.");
        return;
    } else if(!helper.verifyPassword(userDataState.password)){
        toast.error("Invalid Password.");
        return;
    } 

    const res = await loginSubmit(userDataState)
    if(res)
      navigate("/home",{replace:true});
    // e.target.reset();
    // setUserDataState({email:"",password:""});
  }  



  return <>

    <div className="w-full grid place-items-center">
        {/* ! Heading... */}
        <div className="my-5 text-xl md:w-[60%] w-full">
          <h1 className="uppercase text-gray-500">Login to your account</h1>
        </div>

        {/* ! Basic Data... */}
        <div className="md:w-[60%] w-full">
            <form onSubmit={onLoginSubmit}>
                <InputBox type={"email"} name={"email"} label={"Email"} placeHolder={'Email'} autoComplete="email" onChange={onChange}/>
                <InputBox type={"password"} name={"password"} label={"Password"} placeHolder={'Password'} autoComplete="password" onChange={onChange}/>
                <div className="flex justify-end mt-3">
                  <InputButton name={"Login"} restClass={"bg-teal-800 w-1/3 hover:bg-teal-700 text-white"} loading={loadingState.loadingPath==="login"?loadingState.loading:false}/>
                </div>
            </form>

            <p className="mt-3">Create new account <span onClick={()=>{loginSignupState("signupShow")}} className="underline text-blue-600 cursor-pointer">Sign Up</span></p>
        </div>

    </div>
  </>
}

export default Login;