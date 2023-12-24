import axios from "axios";
import { POSTS_URL, USERS_URL } from "../constants/stringConstants";

export const getAPIResponse = async (url: string, timezone?: string) => {
  const response = await axios.get(`${url}${timezone ? "/" + timezone : ""}`);
  return response?.data;
};


// this function helps in getting users and posts data and binding posts to user's
export const getUsersPostsAssignContext = async () => {
  const usersData = await getAPIResponse(USERS_URL);
  const postsData = await getAPIResponse(POSTS_URL);
  const result = usersData.map((user: any) => {
    const userPosts = postsData.filter((post: any) => post.userId === user.id);
    return { ...user, posts: userPosts };
  });
  return result;
};
