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

  // Fetch all threads from backend
  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/thread");
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

  // Load threads once on mount
  useEffect(() => {
    getAllThreads();
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
        `http://localhost:3000/api/thread/${newThreadId}`
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
        `http://localhost:3000/api/thread/${threadId}/delete`,
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

      <h3>Chats</h3>

      <ul className="history">
        {allthreads?.map((thread, idx) => (
          <li
            key={idx}
            className="history-item"
            onClick={() => changeThread(thread.threadId)}
          >
            <span>{thread.title}</span>
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // Prevent switching thread
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By PV ♥</p>
      </div>
    </section>
  );
}

export default Sidebar;
