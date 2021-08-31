import React from 'react';
import './App.css';
import Socket from './socket';

export const App: React.VFC = () => {
  const [logs, setLog] = React.useState<Array<string>>([])
  const [msg, setMsg] = React.useState<string>('')

  const socketRef = React.useRef<Socket>();
  
  React.useEffect(() => {
    console.log("effect")
    const ws = new WebSocket("ws://localhost:8080/ws");
    socketRef.current = new Socket(ws)

    socketRef.current.on("connect", onConnect)
    socketRef.current.on("disconnect", onDisconnect)
    socketRef.current.onMessage("message", receiveMessage)
  }, [])

  const onConnect = () => {
    console.log("onConnect")
    setLog(prevMessages => [...prevMessages, "onConnect"])
  };

  const onDisconnect = () => {
    console.log("onDisconnect")
    setLog(prevMessages => [...prevMessages, "onDisconnect"])
  };

  const receiveMessage = (e: MessageEvent) => {
    console.log("receiveMSG")
    console.log(e.data)
    setLog(prevMessages => [...prevMessages, e.data])
  }

  const sendMessage = React.useCallback(() => {
    console.log("sendMSG")
    console.log(msg)
    if (typeof socketRef.current !== 'undefined') {
      socketRef.current.emit(msg);
    }
    setMsg('')
  }, [msg])

  const handleChange = (e: any) => {
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

