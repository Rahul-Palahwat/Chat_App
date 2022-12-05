import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

const {v4 : uuidv4} = require('uuid')

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const [roomId, setRoomId] = useState("");
  const [show, setShow] = useState(false);
  const createRoom = () => {
    // console.log("createroom clicked");
    const newId = uuidv4()
    setRoomId(newId);
    console.log("createroom clicked",roomId);
    setShow(true);
  }
  useEffect(() => {

  },[roomId])

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
          <button onClick={createRoom}>Create A RoomId</button>
          {show?
      // <div className="chat-header">{roomId}</div>
      <input
            type="text"
            value={roomId}
          />
          :""}
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;