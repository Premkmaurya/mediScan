import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaSpinner, FaFilePdf } from "react-icons/fa6"; // Added FaSpinner, FaFilePdf, FaImage
import { io } from "socket.io-client";
import ReactMarkdown from 'react-markdown'

// ELI5: Ye function file ko Base64 string mein convert karta hai.
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Only get the Base64 part (remove the 'data:mime/type;base64,' prefix)
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileUpload, setFileUpload] = useState(null); // Changed initial to null
  const [previewUrl, setPreviewUrl] = useState(null); // ⬅️ NEW: For file preview
  const [isSending, setIsSending] = useState(false); // ⬅️ NEW: For disabling input/button
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  // ⬅️ UPDATED: Handle file selection and generate preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      // Create a local URL for image preview
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFileUpload(null);
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFileUpload(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = null; // Clear the actual file input
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ⬅️ UPDATED: Handle sending message/file
  const handleSend = async (e) => {
    e.preventDefault();
    const messageText = newMessage.trim();

    // Check if both text and file are empty
    if (messageText === "" && !fileUpload) return;
    if (isSending) return;

    setIsSending(true); // Disable send button immediately

    // 1. Prepare the display message for the UI (user's message is added immediately)
    const displayMessage = {
      id: messages.length + 1,
      text: messageText || `File (${fileUpload.name}) sent for analysis.`,
      sender: "me",
      fileName: fileUpload ? fileUpload.name : null,
      fileType: fileUpload ? fileUpload.type : null,
      filePreviewUrl: fileUpload ? previewUrl : null,
    };

    // Immediately add the user's message/placeholder to the UI
    setMessages((prevMessages) => [...prevMessages, displayMessage]);

    // 2. Prepare the payload for the backend (multimodal)
    let payload = {
      role:"user",
      parts: [{ text: messageText }],
    };

    if (fileUpload) {
      try {
        // Convert file to Base64 string for the backend
        payload.file = await readFileAsBase64(fileUpload);
        payload.fileType = fileUpload.type;
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

  // ⬅️ NEW: Component to render messages with loading state
  const renderMessage = (message) => {
    const isModelResponsePending =
      message.sender === "model" && message.isPending;

    return (
      <div
        key={message.id}
        className={`flex ${
          message.sender === "me" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[75%] p-3 rounded-2xl ${
            message.sender === "me"
              ? "bg-emerald-100 rounded-tr-md"
              : "bg-white rounded-tl-md"
          } ${message.isPending ? "opacity-70" : ""}`}
        >
          {/* File Preview in User's Message */}
          {message.filePreviewUrl && (
            <div className="mb-2 p-2 border border-gray-300 rounded-lg">
              {message.fileType.startsWith("image/") ? (
                <img
                  src={message.filePreviewUrl}
                  alt="File Preview"
                  className="max-h-40 w-auto rounded"
                />
              ) : (
                <div className="flex items-center text-gray-600">
                  <FaFilePdf className="mr-2 text-red-500" size={24} />
                  {message.fileName || "Document"}
                </div>
              )}
            </div>
          )}

          {/* Actual Text Content */}
          <ReactMarkdown>{message.text}</ReactMarkdown>

          {/* ⬅️ LOADING LOGO: Show only for pending model responses */}
          {isModelResponsePending && (
            <div className="flex items-center mt-2 text-teal-600">
              {/* Using FaSpinner, you can replace this with an animated logo component */}
              <FaSpinner className="animate-spin mr-2" size={20} />
              <span className="text-sm text-black">Model is thinking...</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full h-[700px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">
          Medi<span className="text-blue-500">Scan</span> AI Chat
        </h1>
        <div className="text-sm text-gray-500">HIPAA Compliant & Secure</div>
      </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-200">
          {messages.map((message) => renderMessage(message))}
          <div ref={messagesEndRef} />
        </main>

        {messages.length <=0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-400">
          <p className="text-lg">✨Start the conversation by sending a message or uploading a file.</p>
        </div>
        )}

        <footer className="p-4 bg-gray-100 border-t border-gray-200">
          {/* ⬅️ FILE PREVIEW AREA */}
          {previewUrl && (
            <div className="mb-3 p-3 bg-white border border-gray-300 rounded-lg flex justify-between items-center">
              <div className="flex items-center max-w-[80%]">
                {fileUpload.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="File Preview"
                    className="h-12 w-auto object-contain mr-3 rounded"
                  />
                ) : (
                  <FaFilePdf className="mr-3 text-red-500" size={32} />
                )}
                <span className="text-sm font-medium truncate">
                  {fileUpload.name}
                </span>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 font-semibold text-sm"
              >
                Remove
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-2">
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
                onChange={handleFileChange}
                disabled={isSending}
              />
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
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
              disabled={isSending || (newMessage.trim() === "" && !fileUpload)} // ⬅️ Disable button while sending or if empty
            >
              {isSending ? (
                <FaSpinner className="animate-spin" size={20} /> // ⬅️ Loader inside button
              ) : (
                "Send"
              )}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
