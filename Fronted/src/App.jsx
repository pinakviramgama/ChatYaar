import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { v1 as uuidv1 } from "uuid";
import "./App.css";
import ChatWindow from "./ChatWindow";
import Login from "./Login";
import { MyContext } from "./MyContext";
import Sidebar from "./Sidebar";
import Signup from "./Signup";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allthreads, setAllThreads] = useState([]);

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const provideValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allthreads,
    setAllThreads,
  };

  // 🔥 Re-check user whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            user ? (
              <div className="main">
                <MyContext.Provider value={provideValues}>
                  <Sidebar />
                  <ChatWindow />
                </MyContext.Provider>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
