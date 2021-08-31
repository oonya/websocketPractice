import './App.css';
import Socket from './socket';
import React from "react";

function App() {
  // これがlogsがチャットのlogとして表示されるやつ
  // 
  const [logs, setLog] = React.useState([])
  const [msg, setMsg] = React.useState('')
  const socketRef = React.useRef();

  React.useEffect(() => {
    console.log("effect")
    const ws = new WebSocket("ws://localhost:8080/ws");
    socketRef.current = new Socket(ws);

    socketRef.current.on("connect", onConnect);
    // "connect" eventが呼ばれる -> onConnect関数を呼ぶ 登録
    socketRef.current.on("disconnect", onDisconnect);
    socketRef.current.on("message", receiveMessage);
  }, [])

  const onConnect = () => {
    console.log("onConnect")
    setLog(prevMessages => [...prevMessages, "onConnect"])
  };
  
  const onDisconnect = () => {
    console.log("onDisconnect")
    setLog(prevMessages => [...prevMessages, "onDisconnect"])
  };

  const receiveMessage = (e) => {
    console.log("receiveMSG")
    console.log(e)
    console.log(e.data)
    setLog(prevMessages => [...prevMessages, e.data])
  }

  const sendMessage = React.useCallback(() => {
    console.log("sendMSG")
    console.log(msg)
    socketRef.current.emit(msg);
    setMsg('')
  }, [msg])

  const handleChange = (e) => {
    setMsg(e.target.value)
  }

  return (
    <div>
      <p>text</p>
      <button onClick={sendMessage} />

      <input type="text" placeholder="メッセージ" value={msg} onChange={handleChange} />
      <p>{msg}</p>

      <ul>
        {logs.map((log, i) => {
            return <li key={i}>{log}</li>
        })}
      </ul>
    </div>
  );
}

export default App;
