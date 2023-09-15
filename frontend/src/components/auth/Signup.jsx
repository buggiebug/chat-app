import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";

import InputBox from "../form_inputs/InputBox"
import InputButton from "../form_inputs/InputButton";
import Helper from "../utils/Helper.js";

import {toast} from 'react-toastify';

import {UserHook} from "../../hooks/UserHook";


function Signup(props) {

  const {loginSignupState} = props;
  const navigate = useNavigate();
  const {loadingState,createAccount} = UserHook();

  // Helper Class which can validate the data...
  const helper = new Helper();

  const [sendOtpViewState,setSendOtpViewState] = useState(true);
  const [verifyOtpViewState,setVerifyOtpViewState] = useState(false);
  const [basicDataViewState,setBasicDataViewState] = useState(false); 

  // Send OTP on mail...
  const [emailState,setEmailState] = useState({email:""});
  const sendOtpSubmit = async(e)=>{
    e.preventDefault();

    if (!helper.verifyEmail(emailState.email)) {
      toast.error("Enter valid email");
      return;
    } else {
      const res = await createAccount(1,emailState);
      if(res){
        setSendOtpViewState(false);
        setVerifyOtpViewState(true);
        setBasicDataViewState(false);
      }
    }
  }

  //  OTP Design to seperate the value in input fields...
  const otpLength = 4;
  const [otpState,setOtpState] = useState([]);
  const [activeIndexState,setActiveIndexState] = useState(0);
  const inputRef = useRef();

  const focusNextInputField = (index)=>{
    setActiveIndexState(index+1);
  }
  const focusPrevInputField = (index)=>{
    if(index>0)
      setActiveIndexState(index-1);
  }

  const handleOnChange = (el,i)=>{
    let {value} = el.target;
    let newOTP = [...otpState];
    newOTP[i] = value.substring(value.length-1, value.length);
    if (!value) {
      focusPrevInputField(i)
    } else {
      focusNextInputField(i);
    }
    setOtpState(newOTP);
  }
  const handleKeyDown = (e , i) => {
    let {value} = e.target;
    if (e.key === 'Backspace') {
      if(value===""){
        focusPrevInputField(i);
      }
    }
  }

  useEffect (() => {
    inputRef.current?.focus();
  }, [activeIndexState])

  // Verify OTP submit...
  const verifyOtpSubmit = async(e)=>{
    e.preventDefault();
    const myOtp = otpState.join("");
    if(myOtp.length<otpLength || isNaN(myOtp)){
      toast.error("Please enter valid OTP.");
      return;
    } else {
      let otp = {otp:myOtp}
      const res = await createAccount(2,otp);
      if(res)
      {
        setSendOtpViewState(false);
        setVerifyOtpViewState(false);
        setBasicDataViewState(true);
      }
    }
  }
  
  // Submit basic details...
  const [userBaiscDetailsState,setUserBasicDetailsState] = useState({name:"",password:"",cPassword:""})
  const onChangeUserData = (e)=>{
    const {target} = e;
    setUserBasicDetailsState({...userBaiscDetailsState,[target.name]:target.value});
  }
  const basicDataSubmit = async(e)=>{
    e.preventDefault();
    if(!helper.verifyString(userBaiscDetailsState.name))
    {
      toast.error("Please enter valid name.");
      return;
    }  
    if(!helper.verifyPassword(userBaiscDetailsState.password) && !helper.verifyPassword(userBaiscDetailsState.cPassword))
    {
      toast.error("Please enter valid password.");
      return;
    } 
    if(String(userBaiscDetailsState.password) !== String(userBaiscDetailsState.cPassword))
    {
      toast.error("Password and Confirmed password mismatched.");
      return;
    }   
    
    const res = await createAccount(3,userBaiscDetailsState);
    if(res)
      navigate("/home",{replace:true});
  } 

  return <>

    <div className="w-full grid place-items-center">
        {/* ! Heading... */}
        <div className="my-5 text-xl md:w-[60%] w-full">
          <h1 className="uppercase text-gray-500">Create a new Account</h1>
        </div>

        <div className="md:w-[60%] w-full">

            {/* ! Email for OTP verification... */}
            {sendOtpViewState===true?
            <div className="">
              <form onSubmit={sendOtpSubmit}>
                  <InputBox type={"email"} name={"email"} label={"Email"} placeHolder={'Email'} onChange={e=>setEmailState({email:e.target.value})} autoComplete="email" required/>
                  <div className="flex justify-end mt-3">
                      <InputButton name={`Continue`} restClass={"bg-teal-800 w-1/3 hover:bg-teal-900 text-white"} loading={loadingState}/>
                  </div>
              </form>
            </div>:""}

            {/* Enter OTP fields... */}
            {verifyOtpViewState===true?
            <div className="">
                <form onSubmit={verifyOtpSubmit}>
                  <div className="flex flex-col justify-center">
                    <div className="my-5">
                      <p className="text-gray-400">We send an OTP on your email</p>
                    </div>
                    <div className="flex justify-center">
                      {Array.from({length:otpLength},(e,index)=>(
                        <div key={index} className="mx-2">
                          <input 
                          id={index}
                          ref={index === activeIndexState ? inputRef : null}
                          onChange={(e)=>{handleOnChange(e,index)}} 
                          onKeyDown={(e)=>{handleKeyDown(e,index)}} 
                          value={otpState[index] || ""}
                          type="number"
                          className="w-12 h-12 border-2 border-teal-900 outline-none rounded-md focus:border-teal-700 text-center transition-all font-medium text-xl spin_button_none"/>

                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center mt-5">
                    <InputButton name={`Verify OTP`} restClass={"bg-teal-800 hover:bg-teal-700 text-white"} loading={loadingState}/>
                  </div>
                </form>
            </div> : ""}

            {/* Basic Data... */}
            {basicDataViewState===true?
            <div className="">
              <form onSubmit={basicDataSubmit}>
                  <InputBox onChange={onChangeUserData} type={"text"} name={"name"} label={"Name"} placeHolder={'Full Name'} autoComplete="name" required/>
                  <InputBox onChange={onChangeUserData} type={"password"} name={"password"} label={"Password"} placeHolder={'Password'} autoComplete="new-password" required/>
                  <InputBox onChange={onChangeUserData} type={"password"} name={"cPassword"} label={"Confirm Password"} placeHolder={'Confirm Password'} autoComplete="cNew-password" required/>
                  <div className="flex justify-end mt-3">
                    <InputButton name={"Signup"} restClass={"bg-teal-800 w-1/3 hover:bg-teal-700 text-white"} loading={loadingState}/>
                  </div>
              </form>
            </div>:""}

            {/*  */}
            <p className="mt-5">Already account <span onClick={()=>{loginSignupState("loginShow")}} className="underline text-blue-600 cursor-pointer">Login</span></p>

        </div>

    </div>
  </>
}

export default Signup;