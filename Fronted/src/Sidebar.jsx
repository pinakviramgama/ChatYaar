import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import "./sidebar.css";

function Sidebar(params) {

    const {allthreads, setAllThreads,currThreadId} = useContext(MyContext);

    const getAllThreads = async () => {

        try {
            const threads = await fetch("http://localhost:3000/api/thread");

            const res = await threads.json();
            console.log(res);
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);

        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);


    return <section className="sidebar" >

        <button>
            <img className="logo" src="https://static.vecteezy.com/system/resources/previews/007/225/199/non_2x/robot-chat-bot-concept-illustration-vector.jpg" alt="gpt-logo" />
            <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>

        <ul className="history">
            {
                allthreads?.map((thread, idx) => (
                    <li key={idx}>{thread.title}</li>
                ))
            }
        </ul>

        <div className="sign">
            <p>By PV &hearts; </p>
        </div>

    </section>
}

export default Sidebar;