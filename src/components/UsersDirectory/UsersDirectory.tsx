import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UsersDirectory.module.scss";

export const UsersDirectory = ({ usersWithPosts }) => {
  const navigate = useNavigate();
  function navigateToUser(id: number) {
    navigate(`/user/${id}`);
  }

  return (
    <div>
      <div className={styles.title}>USERS DIRECTORY</div>
      {usersWithPosts?.length
        ? usersWithPosts.map((user: any) => {
            return (
              <div
                className={styles.userInfo}
                key={user?.id}
                onClick={() => navigateToUser(user?.id)}
              >
                <div className={styles.name}>Name: {user?.name}</div>

                <div className={styles.posts}>Posts: {user?.posts?.length}</div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default UsersDirectory;
