import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { MyContext } from "./MyContext";
import "./sidebar.css";

function Sidebar() {
  const {
    allthreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setReply,
    setPrompt,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const API = process.env.VITE_URL;
  // 🟢 Get the logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all threads for that user
  const getAllThreads = async () => {
    if (!user?._id) return; // No user logged in

    try {
      const response = await fetch(
        `${API}/api/thread/${user._id}`
      );
      const data = await response.json();

      const filteredData = data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (err) {
      console.error("Error fetching threads:", err.message);
    }
  };

  useEffect(() => {
    getAllThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a new chat
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  // Switch to a different thread
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `${API}/api/thread/${user._id}/${newThreadId}`
      );
      const data = await response.json();

      console.log("Thread data:", data);

      setPrevChats(data);
      setNewChat(false);
    } catch (err) {
      console.error("Error fetching thread:", err.message);
    }
  };

  // Delete a thread
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${API}/api/thread/${user._id}/${threadId}/delete`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setAllThreads((prev) =>
          prev.filter((thread) => thread.threadId !== threadId)
        );
      }

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting thread:", err.message);
    }
  };

  return (
    <section className="sidebar">
      <button className="new-chat-button" onClick={createNewChat}>
        <img
          className="logo"
          src="https://static.vecteezy.com/system/resources/previews/007/225/199/non_2x/robot-chat-bot-concept-illustration-vector.jpg"
          alt="gpt-logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <br />
      <h4>Chat History</h4>

      <ul className="history">

        {allthreads.length === 0 && <li>No Chats yet!</li>}
        {allthreads?.map((thread, idx) => (
          <li
            key={idx}
            className={`history-item ${
              currThreadId === thread.threadId ? "active-thread" : ""
            }`}
            onClick={() => changeThread(thread.threadId)}
          >
            <span>{thread.title}</span>
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // prevent click overlap
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By PV &#10084;</p>
      </div>
    </section>
  );
}

export default Sidebar;
