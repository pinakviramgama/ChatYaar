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

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span>ChatYaar <i className="fa-solid fa-chevron-down"></i></span>

        <div className="profile-section">
          {user && (
            <span className="username">Logged in as <strong>{user.username}</strong></span>
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
          <div
            id="submit"
            onClick={() => {
              if (!loading) getReply();
            }}
            style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}
          >
            {loading ? (
              <i className="fa-solid fa-stop"></i>
            ) : (
              <i className="fa-solid fa-square-up-right"></i>
            )}
          </div>
        </div>
      </div>

      <p>
        ChatYaar can make mistakes. Check important info.{" "}
        <a href="">See Cookie Preferences.</a>
      </p>
    </div>
  );
}

export default ChatWindow;
