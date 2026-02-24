import "highlight.js/styles/github.css";
import { useContext, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { MyContext } from "./MyContext";
import "./chat.css";

function Chat() {
  const { prevChats, reply, setPrevChats, setReply } = useContext(MyContext);
  const chatEndRef = useRef(null);
  const [latestReply, setLatestReply] = useState("");
  const indexRef = useRef(0);
  const wordsRef = useRef([]);

  // Word-by-word typing for AI reply
  useEffect(() => {
    if (!reply) return;

    setLatestReply("");
    indexRef.current = 0;
    wordsRef.current = reply.split(" ");

    const typeNextWord = () => {
      if (indexRef.current < wordsRef.current.length) {
        setLatestReply(prev =>
          prev ? prev + " " + wordsRef.current[indexRef.current] : wordsRef.current[indexRef.current]
        );
        indexRef.current += 1;
        setTimeout(typeNextWord, 50);
      } else {
        // Once typing is done, add AI reply to history
        setPrevChats(prev => [...prev, { role: "assistant", content: reply }]);
        setReply(null); // clear reply so next one can start
      }
    };

    typeNextWord();
  }, [reply, setPrevChats, setReply]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  return (
  <div className="chat-wrapper">
    <div className="chat-messages">
      {prevChats.map((chat, idx) => (
        <div
          key={idx}
          className={chat.role === "user" ? "message user" : "message ai"}
        >
          <div className="bubble">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {chat.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {/* Typing AI */}
      {reply && latestReply && (
        <div className="message ai">
          <div className="bubble typing">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  </div>
);
}

export default Chat;
