import { useContext } from "react";
import { CreateUserContext } from "../context/UserContext";

export const UserHook = ()=> {
  return useContext(CreateUserContext);
}

