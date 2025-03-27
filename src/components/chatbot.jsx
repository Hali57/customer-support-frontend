import React, { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // ⏳ Track bot processing

  const toSentenceCase = (text) => {
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (match) => match.toUpperCase());
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true); // Show "typing..." effect
  
    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
  
      const data = await response.json();
      const formattedResponse = toSentenceCase(data.response);
      const botMessage = { sender: "Bot", text: formattedResponse };
  
      setTimeout(() => {
        setIsTyping(false); // Hide "typing..."
        setMessages((prev) => [...prev, botMessage]); // ✅ Only one update
      }, 1500);
  
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  
    setInput("");
  };
  

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-4">
      <div className="chat-box">
  {messages.map((msg, index) => (
    <p key={index} className={msg.sender === "User" ? "user-msg" : "bot-msg"}>
      {msg.text} {/* ✅ Only display the message text, no "User:" or "Bot:" */}
    </p>
  ))}
  {isTyping && (
          <div className="typing">
            <span></span> <span></span> <span></span>
          </div>
        )} {/* Animated Loader */}
</div>

          
        
        <div className="flex gap-2 border-t pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
