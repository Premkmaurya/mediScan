import React, { useEffect, useRef, useState } from "react";
import { Send, Upload, Bot, User } from "lucide-react";
import { FaPlus, FaSpinner, FaFilePdf, FaImage } from "react-icons/fa6";
import { io } from "socket.io-client";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imgUrl, setImgUrl] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState();
  const [isSending, setIsSending] = useState()
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Only get the Base64 part (remove the 'data:mime/type;base64,' prefix)
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const socketInstance = io("https://mediscan-1-kap4.onrender.com/", {
      withCredentials: true,
    });
    if (!socketInstance) {
      console.log("not connect to the websocket.");
    }
    setSocket(socketInstance);

    socketInstance.on("chat-response", (data) => {
      setMessages((prevMessages) => {
        return [...prevMessages, data];
      });
      setIsSending(false); // Enable send button after response
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const messageText = newMessage.trim();

    // Check if both text and file are empty
    if (messageText === "" && !file) return;
    if (isSending) return;

    setIsSending(true); // Disable send button immediately

    // 1. Prepare the display message for the UI (user's message is added immediately)
    const displayMessage = {
      id: messages.length + 1,
      text: messageText || `File (${file.name}) sent for analysis.`,
      sender: "me",
      fileName: file ? file.name : null,
      fileType: file ? file.type : null,
      filePreviewUrl: file ? previewUrl : null,
    };

    // Immediately add the user's message/placeholder to the UI
    setMessages((prevMessages) => [...prevMessages, displayMessage]);

    // 2. Prepare the payload for the backend (multimodal)
    let payload = {
      role: "user",
      parts: [{ text: messageText }],
    };

    if (file) {
      try {
        // Convert file to Base64 string for the backend
        payload.file = await readFileAsBase64(file);
        payload.fileType = file.type;
      } catch (error) {
        console.error("File reading error:", error);
        alert("Error reading file. Please try again.");
        setIsSending(false);
        return;
      }
    }

    // 3. Emit the payload to the backend
    if (socket) {
      socket.emit("chat", payload); // Send the full payload object
    } else {
      console.error("Socket connected nahi hai!");
      setIsSending(false);
    }

    // 4. Cleanup UI state
    setNewMessage("");
    handleRemoveFile(); // Clear file upload and preview
  };

  // Handle File Upload
  const handlefile = (e) => {
    const uploaded = e.target.files[0];
    setImgUrl(URL.createObjectURL(uploaded));
    if (uploaded) {
      setFile(uploaded);
    }
  };
  const handleRemoveFile = () => {
    setFile(null);
    setImgUrl(null);
    if (inputRef.current) {
      inputRef.current.value = null; // Clear the actual file input
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">
          Medi<span className="text-blue-500">Scan</span> AI Chat
        </h1>
        <div className="text-sm text-gray-500">HIPAA Compliant & Secure</div>
      </header>

      {/* Chat Section */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-6"
        ref={messagesEndRef}
      >
        {messages.length === 0 ? (
          <div className="flex h-full justify-center items-center text-gray-400 text-lg">
            👋 Start a conversation or upload a medical file to begin.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bot className="text-blue-600 w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.file && (
                  <div className="mt-2">
                    <img
                      src={msg.file}
                      alt="uploaded"
                      className="rounded-lg border border-gray-300 w-48"
                    />
                    <p className="text-xs mt-1 opacity-80">File preview</p>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="text-blue-600 w-5 h-5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      {imgUrl && (
        <div className="mb-3 p-3 bg-white border border-gray-300 rounded-lg flex justify-between items-center">
          <div className="flex items-center max-w-[80%]">
            {file.type.startsWith("image/") ? (
              <img
                src={imgUrl}
                alt="File Preview"
                className="h-12 w-auto object-contain mr-3 rounded"
              />
            ) : (
              <FaFilePdf className="mr-3 text-red-500" size={32} />
            )}
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Remove
          </button>
        </div>
      )}
      <form onSubmit={handleSend} className="flex gap-2 mb-5 px-5">
        <div className="py-2">
          <FaPlus
            size={24}
            onClick={() => {
              if (!isSending) inputRef.current.click();
            }}
            className={
              isSending
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 cursor-pointer hover:text-teal-600"
            }
          />
          <input
            type="file"
            accept="application/pdf, image/*"
            className="hidden"
            ref={inputRef}
            onChange={handlefile}
            disabled={isSending}
          />
        </div>
        <input
          type="text"
          autoFocus
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            file
              ? `File selected: ${file.name}. Type optional message.`
              : "Type a message..."
          }
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isSending} // ⬅️ Disable input while sending
        />
        <button
          type="submit"
          className={`px-6 py-2 font-semibold text-white rounded-full transition ${
            isSending
              ? "bg-teal-400 cursor-wait"
              : "bg-teal-500 hover:bg-teal-600"
          }`}
          disabled={isSending || (newMessage.trim() === "" && !file)} // ⬅️ Disable button while sending or if empty
        >
          {isSending ? (
            <FaSpinner className="animate-spin" size={20} /> // ⬅️ Loader inside button
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;