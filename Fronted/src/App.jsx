import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import './App.css';
import ChatWindow from "./ChatWindow";
import { MyContext } from './MyContext';
import Sidebar from "./Sidebar";

function App() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allthreads, setAllThreads] = useState([]);

  const provideValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allthreads,setAllThreads
    };

  return <div className='main' >
    <MyContext.Provider value = {provideValues}>
      <Sidebar />
      <ChatWindow/>
    </MyContext.Provider>
  </div>

}

export default App;
