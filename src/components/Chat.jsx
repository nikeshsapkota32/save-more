import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

// Mock message data
const mockMessages = [
  {
    id: '1',
    text: 'Hello, is this food still available?',
    senderId: 'vol-1',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: '2',
    text: 'Yes, it is! When would you like to pick it up?',
    senderId: 'user-1',
    senderName: 'You',
    timestamp: new Date(Date.now() - 1800000) // 30 mins ago
  }
];

const Chat = ({ foodItemId }) => {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Simulate loading messages
    const timer = setTimeout(() => {
      setMessages(mockMessages);
    }, 500);

    return () => clearTimeout(timer);
  }, [foodItemId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add new message to local state
    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      timestamp: new Date()
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.senderId === user.uid 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-600'}`}
            >
              <p className="font-medium">{message.senderName}</p>
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;