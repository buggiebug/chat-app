import React, { useEffect } from "react";
import { UserHook } from "../../hooks/UserHook";

function Home() {
  const { getUserInfo } = UserHook();
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line
  }, []);
  return <div>Home</div>;
}

export default Home;
