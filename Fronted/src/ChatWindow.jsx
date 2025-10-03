import { useContext, useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";
import Chat from "./Chat";
import "./chatwindow.css";
import { MyContext } from "./MyContext";

function ChatWindow() {
    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId,
        prevChats, setPrevChats
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Auto-focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Auto-focus input every time messages change
    useEffect(() => {
        inputRef.current?.focus();
    }, [prevChats]);

const getReply = async () => {
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
        setAllThreads(prev => [...prev, { threadId, title: data.title }]);
    }

    // Step 2: Save first message in the new/existing thread
    setPrevChats(prev => [...prev, { role: "user", content: prompt }]);
    setPrompt("");
    setLoading(true);

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: prompt, threadId }),
        });
        const res = await response.json();
        setReply(res.reply);
    } catch (err) {
        console.log(err.message);
    }

    setLoading(false);
};



    return (
        <div className="chatwindow">
            <div className="navbar">
                <span>ChatYaar <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv">
                    <i className="fa-solid fa-user"></i>
                </div>
            </div>

            <Chat />
            <SyncLoader className="loader" color="white" loading={loading} />

            <div className="chatInput">
                <div className="userInput">
                    <input
                        ref={inputRef} // keep input focused
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
                        disabled={loading} // disable input while waiting
                    />

                    <div
                        id="submit"
                        onClick={() => {
                            if (!loading) getReply();
                        }}
                        style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1 }}
                    >
                        {loading ? (
                            <i className="fa-solid fa-stop"></i> // icon while waiting
                        ) : (
                            <i className="fa-solid fa-square-up-right"></i> // normal send icon
                        )}
                    </div>
                </div>
            </div>

            <p>
                ChatYaar can make mistakes. Check important info.
                <a href="">See Cookie Preferences.</a>
            </p>
        </div>
    );
}

export default ChatWindow;
