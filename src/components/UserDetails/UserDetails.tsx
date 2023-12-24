import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContextData } from "../../context/ContextWrapper";
import styles from "./UserDetails.module.scss";
import { getAPIResponse } from "../../services/apiservice";
import { LOCATIONS_URL } from "../../constants/stringConstants";

const MAX_SECONDS = 59;
const MAX_MINUTES = 59;
const MAX_HOURS = 23;
const UserDetails = () => {
  const [timerID, setTimerID] = useState();
  const { usersWithPosts, locations } = useContext(ContextData);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();
  const [timerValue, setTimerValue] = useState<string>();
  const [dropdownValue, setDropDownValue] = useState<string>("");
  const savedCallback = useRef();

  // filtering data once we have users and posts data
  useEffect(() => {
    filterUserData();
  }, [usersWithPosts]);

  // setting dropdown value once we have locations
  useEffect(() => {
    setDropDownValue(locations[0]);
  }, [locations]);

  // fetching time once we have dropdownvalue
  useEffect(() => {
    if (dropdownValue) fetchAndSetTimeForSelectedDropdownValue();
  }, [dropdownValue]);

  useEffect(() => {
    savedCallback.current = updateTimerValue;
  });

  function callbackFunctionCall() {
    savedCallback.current();
  }

  async function fetchAndSetTimeForSelectedDropdownValue() {
    const datetimeFromAPI = await fetchTimeForLocation(dropdownValue);
    extractTimeFromDateTime(datetimeFromAPI);
  }

  function extractTimeFromDateTime(datetime: string) {
    const hours = new Date(datetime).getUTCHours();
    const minutes = new Date(datetime).getUTCMinutes();
    const seconds = new Date(datetime).getUTCSeconds();

    const timerString = `${hours} : ${minutes} : ${seconds}`;
    if (timerID) {
      clearInterval(timerID);
      setTimerID(null);
    }
    setTimerValue(timerString);
    const ID = setInterval(callbackFunctionCall, 1000);
    setTimerID(ID);
  }

  function pauseOrStartTimer() {
    if (timerID) {
      clearInterval(timerID);
      setTimerID(null);
    } else {
      const ID = setInterval(callbackFunctionCall, 1000);
      setTimerID(ID);
    }
  }

  function updateTimerValue() {
    if (timerValue) {
      const splittedTimerValue = timerValue?.split(" : ");
      let [hours, minutes, seconds] = splittedTimerValue.map((value) =>
        Number(value)
      );

      let secondsReset,
        minutesReset = false;

      if (seconds < MAX_SECONDS) {
        seconds += 1;
      } else {
        secondsReset = true;
        seconds = 0;
      }

      if (secondsReset) {
        if (minutes < MAX_MINUTES) {
          minutes += 1;
        } else {
          minutesReset = true;
          minutes = 0;
        }
      }

      if (minutesReset) {
        if (hours < MAX_HOURS) {
          hours += 1;
        } else {
          hours = 0;
        }
      }
      const updatedTimerValue = `${hours} : ${minutes} : ${seconds}`;
      setTimerValue(updatedTimerValue);
    }
  }

  const filterUserData = () => {
    const userData = usersWithPosts?.filter(
      (userr: any) => userr.id === Number(userId)
    );
    // as we dont have duplicates taking first and only value in array
    setUser(userData[0]);
  };

  const onDropdownChange = (e: any) => {
    if (timerID) {
      clearInterval(timerID);
      setTimerID(null);
    }
    setDropDownValue(e.target.value);
  };

  async function fetchTimeForLocation(dropdownValue: string) {
    const url = `${LOCATIONS_URL}/${dropdownValue}`;
    const result = await getAPIResponse(url);
    return result?.datetime;
  }

  return (
    <div className={styles.userContainer}>
      <div className={styles.header}>
        <button className={styles.button} onClick={() => navigate("/")}>
          BACK
        </button>

        <div className={styles.headerRight}>
          <div className={styles.countryDropdown}>
            <select onChange={(e) => onDropdownChange(e)}>
              {locations?.length
                ? locations.map((location: string) => {
                    return (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    );
                  })
                : ""}
            </select>
          </div>

          <div className={styles.timer}>{timerValue}</div>
          <button className={styles.button} onClick={() => pauseOrStartTimer()}>
            Pause / Resume
          </button>
        </div>
      </div>

      <div className={styles.userProfileContent}>
        <div className={styles.leftProfile}>
          <div className={styles.userLabel}>
            Name:
            <span className={styles.userInfo}> {user?.name}</span>
          </div>
          <div className={styles.userLabel}>
            Username:
            <span className={styles.userInfo}> {user?.username}</span>
          </div>
        </div>
        <div className={styles.rightProfile}>
          <div className={styles.userLabel}>
            Address:
            <span className={styles.userInfo}>
              {" "}
              {`${user?.address?.street} ${user?.address?.city} ${user?.address?.zipcode}`}
            </span>
          </div>
          <div className={styles.userLabel}>
            Email:
            <span className={styles.userInfo}> {user?.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.postsContainer}>
        {user?.posts?.length
          ? user?.posts?.map((post) => {
              return (
                <div className={styles.post} key={post.id}>
                  <div className={styles.postTitle}>
                    <span className={styles.postHeading}> Title:</span>

                    {post?.title}
                  </div>
                  <div className={styles.postBody}>
                    <span className={styles.postHeading}> Body:</span>

                    {post?.body}
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default UserDetails;
