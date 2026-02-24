import { useContext, useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";
import Chat from "./Chat";
import "./chatwindow.css";
import { MyContext } from "./MyContext";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    setCurrThreadId,
    setAllThreads,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // 🔹 Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [prevChats]);

  const getReply = async () => {
    setNewChat(false);
    if (!prompt.trim()) return;

    let threadId = currThreadId;

    // Step 1: Create thread if not exists
    if (!threadId) {
      const res = await fetch("http://localhost:3000/api/thread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      const data = await res.json();
      threadId = data.threadId;
      setCurrThreadId(threadId);
      setAllThreads((prev) => [...prev, { threadId, title: data.title }]);
    }

    // Step 2: Save first message in the new/existing thread
    setPrevChats((prev) => [...prev, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, threadId ,userId:user?._id,}),
      });
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err.message);
    }

    setLoading(false);
  };

  const handleProfileClick = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const [open, setOpen] = useState(false);
const menuRef = useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);



  return (
    <div className="chatwindow">

      <div className="navbar">

  <div className="chat-menu" ref={menuRef}>
    <span
      className="chatYaar"
      onClick={() => setOpen(prev => !prev)}
    >
      ChatYaar <i className="fa-solid fa-chevron-down"></i>
    </span>

    {open && (
      <div className="dropdown">
        <div className="dropdown-item">Upgrade to Plus &nbsp; <i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div className="dropdown-item">Settings &nbsp; <i class="fa-solid fa-gear"></i></div>
      </div>
    )}
  </div>

  <div className="profile-section">
    {user && (
      <span className="fw-username">
        Logged in as <strong>{user.username}</strong>
      </span>
    )}
    <div className="userIconDiv" onClick={handleProfileClick}>
      <i className="fa-solid fa-user"></i>
    </div>
  </div>

</div>

      {newChat && <h1>START A NEW CHAT!</h1>}

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            Upgrade Plan <i className="fa-solid fa-up-right-from-square"></i>
          </div>
          <div className="dropDownItem">
            Settings <i className="fa-solid fa-gear"></i>
          </div>
          <div className="dropDownItem" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>
      )}

      <Chat />
      <SyncLoader className="loader" color="white" loading={loading} />

      <div className="chatInput">
<div className="userInput">
  <input
    ref={inputRef}
    placeholder={loading ? "Receiving response..." : "Ask Anything"}
    type="text"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !loading) {
        e.preventDefault();
        getReply();
      }
    }}
    disabled={loading}
  />

  <button
    className="submitBtn"
    onClick={() => {
      if (!loading) getReply();
    }}
    disabled={loading}
  >
    {loading ? (
      <i className="fa-solid fa-stop"></i>
    ) : (
      <i className="fa-solid fa-paper-plane"></i>
    )}
  </button>
</div>
      </div>

      <p className="chat-footer">
        ChatYaar can make mistakes. Check important info.
        <a href="#"> See Cookie Preferences.</a>
      </p>
    </div>
  );
}

export default ChatWindow;
