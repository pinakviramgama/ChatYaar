import './App.css';
import ChatWindow from "./ChatWindow";
import { MyContext } from './MyContext';
import Sidebar from "./Sidebar";

function App() {

  const provideValues = {};

  return <div className='main' >
    <MyContext.Provider value = {provideValues}>
      <Sidebar />
      <ChatWindow/>
    </MyContext.Provider>
  </div>

}

export default App;

