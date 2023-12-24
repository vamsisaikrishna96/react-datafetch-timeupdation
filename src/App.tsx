import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UsersDirectory from "./components/UsersDirectory/UsersDirectory";
import { useContext } from "react";
import { ContextData } from "./context/ContextWrapper";

import UserDetails from "./components/UserDetails/UserDetails";

function App() {
  const { usersWithPosts } = useContext(ContextData);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route
              path="/"
              exact
              element={<UsersDirectory usersWithPosts={usersWithPosts} />}
            />
            <Route path="/user/:userId" Component={UserDetails} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
