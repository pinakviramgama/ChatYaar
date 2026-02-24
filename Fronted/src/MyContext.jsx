import { createContext, useState } from "react";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [allthreads, setAllThreads] = useState([]);
  const [prevChats, setPrevChats] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [newChat, setNewChat] = useState(true);

  return (
    <MyContext.Provider
      value={{
        allthreads,
        setAllThreads,
        prevChats,
        setPrevChats,
        currThreadId,
        setCurrThreadId,
        prompt,
        setPrompt,
        reply,
        setReply,
        newChat,
        setNewChat,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};