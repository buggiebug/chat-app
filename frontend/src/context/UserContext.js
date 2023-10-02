import React, { createContext, useState } from "react";
import { createNewAccount, loginUser, getUser } from "../api/UserApi";
import { toast } from "react-toastify";

export const CreateUserContext = createContext();

function UserContext(props) {
  const [loadingState, setLoadingState] = useState({loading:false,loadingPath:""});
  const [myInfoState,setMyInfoState] = useState([]);
  
  //  Create new account...
  const createAccount = async (step, data) => {
    setLoadingState({loading:true,loadingPath:"createAccount"});
    const res = await createNewAccount(step, data);
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState({loading:false,loadingPath:""});
      return true;
    }
    toast.warn(res.message);
    setLoadingState({loading:false,loadingPath:""});
  };

  //  Login User...
  const loginSubmit = async (data) => {
    setLoadingState({loading:true,loadingPath:"login"});
    const res = await loginUser(data);
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState({loading:false,loadingPath:""});
      return true;
    }
    toast.warn(res.message);
    setLoadingState({loading:false,loadingPath:""});
  };

  const getUserInfo = async () => {
    setLoadingState({loading:true,loadingPath:"myInfo"});
    const res = await getUser();
    if (res.success) {
      setLoadingState({loading:false,loadingPath:""});
      setMyInfoState(res.user);
      return true;
    }
    toast.warn(res.message);
    setLoadingState({loading:false,loadingPath:""});
  };

  return (
    <CreateUserContext.Provider
      value={{ loadingState, createAccount, loginSubmit, getUserInfo,myInfoState }}
    >
      {props.children}
    </CreateUserContext.Provider>
  );
}

export default UserContext;
