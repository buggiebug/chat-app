import axios from "axios";
const baseUrl = `${process.env.REACT_APP_BE_API}/api`;
const ax = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
const axFiles = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

//  Create new account...
export const createNewAccount = async (step, data) => {
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
};

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

//  Logout user...
export const logOutUser = async () => {
  try {
    const response = await ax.get("/logout");
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

//  Upload Profile photo...
export const uploadProfile = async (formData) => {
  try {
    const response = await axFiles.put("/me/profile-upload", formData);
    return await response.data;
  } catch (err) {
    if (err.response) {
      return await err.response.data;
    } else {
      return err;
    }
  }
};

//  Search user...
export const searchUser = async (keyword) => {
  try {
    const response = await ax.get(`/all-users?search=${keyword}`);
    return await response.data;
  } catch (err) {
    if (err.response) {
      return await err.response.data;
    } else {
      return err;
    }
  }
};

// Block single user...
export const blockUnblockUserApi = async (state,data) => {
  try {
    const response = await ax.post(`/user/${state}`,data);
    return await response.data;
  } catch (err) {
    if (err.response) {
      return await err.response.data;
    } else {
      return err;
    }
  }
};
