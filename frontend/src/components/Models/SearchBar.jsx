import React, { useState, useRef } from "react";
import {RxCross1} from "react-icons/rx"
import {BiSearchAlt} from "react-icons/bi"
import {IoMdArrowBack} from "react-icons/io"
import { UserHook } from "../../hooks/UserHook";


const SearchUser = ({someRef}) => {

  const {searchUserKeywordState, setSearchUserKeywordState, searchUserByNameEmail} = UserHook();

  const {closeRef,viewCreateGroupState} = someRef;  

  const searchUsersHandleChange = ({ target }) => {
    setSearchUserKeywordState(target.value);
    searchUserByNameEmail(target.value)
  };

  const [searchButtonState, setSearchButtonState] = useState(true);
  const [backButtonState, setBackButtonState] = useState(false);
  const refFocus = useRef(null);
  const onInputFocus = () => {
    setSearchButtonState(false);
    setBackButtonState(true);
  };
  const searchKeyword = () => {
    refFocus.current.focus();
    setSearchButtonState(false);
    setBackButtonState(true);
  };
  const clearTextButton = () => {
    setSearchUserKeywordState("");
    setSearchButtonState(true);
    setBackButtonState(false);
    refFocus.current.value = "";
  };

  return (
    <>
      <div className="text-gray-500 bg-gray-100 border-2 rounded-md flex justify-between items-center px-3">
        <input ref={refFocus} onFocus={()=>{onInputFocus()}} className="order-3 bg-gray-100 w-full mx-2 outline-none px-1 py-2" onChange={searchUsersHandleChange} type="text" name="keyword" placeholder={`${!viewCreateGroupState?"Search & start GapSap":"Search & add to Group"}`}/>
        <button type="button" onClick={()=>{searchKeyword()}} className={`${searchButtonState?"inline-block":"hidden"} order-1 text-xl cursor-pointer`}><BiSearchAlt/></button>
        <button type="reset" onClick={()=>{clearTextButton()}} className={`${backButtonState?"inline-block":"hidden"} order-2 text-xl cursor-pointer`}><IoMdArrowBack/></button>
        <button ref={closeRef} type="reset"onClick={()=>{clearTextButton()}} className={`order-4 text-lg cursor-pointer ${searchUserKeywordState.length>0?"inline-block":"hidden"}`}><RxCross1/></button>
      </div>
    </>
  );
};

export default SearchUser;
