import React, { createContext, useState } from "react";
import { createNewAccount, loginUser, getUser } from "../api/UserApi";
import { toast } from "react-toastify";

export const CreateUserContext = createContext();

function UserContext(props) {
  const [loadingState, setLoadingState] = useState(false);

  
  //  Create new account...
  const createAccount = async (step, data) => {
    setLoadingState(true);
    const res = await createNewAccount(step, data);
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState(false);
      return true;
    }
    toast.warn(res.message);
    setLoadingState(false);
  };

  //  Login User...
  const loginSubmit = async (data) => {
    setLoadingState(true);
    const res = await loginUser(data);
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState(false);
      return true;
    }
    toast.warn(res.message);
    setLoadingState(false);
  };

  const getUserInfo = async () => {
    setLoadingState(true);
    const res = await getUser();
    console.log(res);
    if (res.success) {
      setLoadingState(false);
      return true;
    }
    toast.warn(res.message);
    setLoadingState(false);
  };

  return (
    <CreateUserContext.Provider
      value={{ loadingState, createAccount, loginSubmit, getUserInfo }}
    >
      {props.children}
    </CreateUserContext.Provider>
  );
}

export default UserContext;
