import axios from "axios";
const baseUrl = `http://localhost:8000/api`;
const ax = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


//  Create new account...
export const createNewAccount = async(step,data)=>{
  try {
    const response = await ax.post(`/signup?step=${step}`, data);
    return await response.data;
  } catch (err) {
    if (err.response) {
      return await err.response.data;
    } else {
      return err;
    }
  }
}

//  Login user...
export const loginUser = async (data) => {
  try {
    const response = await ax.post("/login", data);
    return await response.data;
  } catch (err) {
    if (err.response) {
      return await err.response.data;
    } else {
      return err;
    }
  }
};

//  Get user...
export const getUser = async (data) => {
    try {
      const response = await ax.get("/me");
      return await response.data;
    } catch (err) {
      if (err.response) {
        return await err.response.data;
      } else {
        return err;
      }
    }
  };