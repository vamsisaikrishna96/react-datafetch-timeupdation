import React, { createContext, useEffect, useState } from "react";
import {
  getAPIResponse,
  getUsersPostsAssignContext,
} from "../services/apiservice";
import {
  LOCATIONS_URL,
} from "../constants/stringConstants";

export const ContextData = createContext([]);

export const ContextWrapper = ({ children }) => {
  const [usersWithPosts, setUsersWithPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationTime, setLocationTime] = useState({});

  useEffect(() => {
    getData();
    getLocations();
  }, []);

  const getData = async () => {
    if (!usersWithPosts?.length) {
      console.log("fetching data");

      const result = await getUsersPostsAssignContext();
      setUsersWithPosts(result);
    }
  };

  const getLocations = async () => {
    const locations = await getAPIResponse(LOCATIONS_URL);
    setLocations(locations);
  };

  return (
    <ContextData.Provider
      value={{
        usersWithPosts,
        setUsersWithPosts,
        locations,
        setLocations,
        locationTime,
        setLocationTime,
      }}
    >
      {children}
    </ContextData.Provider>
  );
};

export default ContextWrapper;
