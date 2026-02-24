import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";
import { MyContext } from "./MyContext";
import "./sidebar.css";

function Sidebar({ className }) {
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

  const API = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const getAllThreads = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(`${API}/api/thread/${user._id}`);
      const data = await response.json();

      const filteredData = data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${API}/api/thread/${user._id}/${newThreadId}`);
      const data = await response.json();
      setPrevChats(data);
      setNewChat(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${API}/api/thread/${user._id}/${threadId}/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      }

      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <section className={`sidebar ${className || ""}`}>
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

      <h4>Chat History</h4>
      <ul className="history">
        {allthreads.length === 0 && <li>No Chats yet!</li>}
        {allthreads?.map((thread, idx) => (
          <li
            key={idx}
            className={`history-item ${currThreadId === thread.threadId ? "active-thread" : ""}`}
            onClick={() => changeThread(thread.threadId)}
          >
            <span>{thread.title}</span>
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
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