import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://chat-git-app.onrender.com");

const App = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  // Join room
  const joinRoom = () => {
    if (room && username) {
      socket.emit("join_room", { room, username });
    }
  };

  // Send message function
  const sendMessage = () => {
    if (message) {
      socket.emit("send_message", { room, username, message });
      setMessage("");
    }
  };

  // Listen for messages
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Listen for message deletion
  socket.on("remove_message", (messageIndex) => {
    setChat((prevChat) => prevChat.filter((_, idx) => idx !== messageIndex));
  });

  return (
    <div>
      <h1>Chat Application</h1>
      
      {/* Room and Username Input */}
      <div>
        <input
          type="text"
          placeholder="Room Code"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>

      {/* Chat Section */}
      <div>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Chat Messages */}
      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong> [{msg.timestamp}]: {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
