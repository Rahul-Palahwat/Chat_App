import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes()+":"+new Date(Date.now()).getSeconds(),
      };

      await socket.emit("send_message", messageData);
      // setMessageList((list) => [...list, messageData]);
      setMessageList([...messageList, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {

    if(socket==null) return;

    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      // setMessageList([...messageList, data]);
    });

    return ()=> socket.off("receive_message");
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent,i) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
                key={i}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <div className="symbol">&#914;</div>
        <div className="symbol" style={{"borderRight":"0.1px solid grey","paddingRight":"1rem"}}>&#73;</div>
        <div className="symbol">&#128625;</div>
        <div className="symbol">&#128625;</div>
        <div className="symbol" style={{"color":"white","backgroundColor":"black"}}>&#x1F650;</div>
      </div>
      <div className="chat-footer">
        <input
          className="chatinput"
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <div className="chat-footer">
        <div className="symbol" style={{"borderRight":"0.1px solid grey","paddingRight":"1rem","paddingLeft":".5rem"}}>&#43;</div>
        <div className="symbol">&#128512;</div>
        <div className="symbol">&#64;</div>

      </div>
    </div>
  );
}

export default Chat;