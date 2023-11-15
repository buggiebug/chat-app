import React, { createContext, useState } from "react";
import {
  createNewAccount,
  loginUser,
  logOutUser,
  getUser,
  uploadProfile,
  searchUser,
} from "../api/UserApi";
import { toast } from "react-toastify";

export const CreateUserContext = createContext();

function UserContext(props) {
  const [loadingState, setLoadingState] = useState({
    loading: false,
    loadingPath: "",
  });
  const [myInfoState, setMyInfoState] = useState([]);
  const [searchedUsersState, setSearchedUsersState] = useState([]);

  //  Create new account...
  const createAccount = async (step, data) => {
    setLoadingState({ loading: true, loadingPath: "createAccount" });
    const res = await createNewAccount(step, data);
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState({ loading: false, loadingPath: "" });
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Login User...
  const loginSubmit = async (data) => {
    setLoadingState({ loading: true, loadingPath: "login" });
    const res = await loginUser(data);
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState({ loading: false, loadingPath: "" });
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Logout user...
  const logoutSubmit = async () => {
    setLoadingState({ loading: true, loadingPath: "logout" });
    const res = await logOutUser();
    // console.log(res);
    if (res.success) {
      toast.success(res.message);
      setLoadingState({ loading: false, loadingPath: "" });
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Get user info...
  const getUserInfo = async () => {
    setLoadingState({ loading: true, loadingPath: "myInfo" });
    const res = await getUser();
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setMyInfoState(res.user);
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Upload profile...
  const uploadProfilePhoto = async (formData) => {
    setLoadingState({ loading: true, loadingPath: "photoUpload" });
    const res = await uploadProfile(formData);
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setMyInfoState(res.user);
      toast.success(res.message);
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //  Search user...
  const searchUserByNameEmail = async (keyword) => {
    setLoadingState({ loading: true, loadingPath: "search_user" });
    const res = await searchUser(keyword);
    if (res.success) {
      setLoadingState({ loading: false, loadingPath: "" });
      setSearchedUsersState(res.allUsers);
      return true;
    }
    toast.warn(res.message);
    setLoadingState({ loading: false, loadingPath: "" });
  };

  //
  const [keywordState, setKeywordState] = useState("");

  return (
    <CreateUserContext.Provider
      value={{
        loadingState,
        createAccount,
        loginSubmit,
        logoutSubmit,
        getUserInfo,
        myInfoState,
        uploadProfilePhoto,
        keywordState,
        setKeywordState,
        searchUserByNameEmail,
        searchedUsersState,
      }}
    >
      {props.children}
    </CreateUserContext.Provider>
  );
}

export default UserContext;
