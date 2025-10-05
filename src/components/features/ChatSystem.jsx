// src/components/features/ChatSystem.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaComments, 
  FaPaperPlane, 
  FaTimes, 
  FaUser,
  FaMicrophone,
  FaStop,
  FaImage,
  FaSmile
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { showToast } from '../../services/notificationService';
import { trackEngagement } from '../../services/analyticsService';

const ChatSystem = ({ isOpen, onClose, chatRoomId, recipientName, recipientType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { user } = useSelector(state => state.auth);
  const { speak, cancel, speaking, supported: speechSupported } = useSpeechSynthesis();
  const { 
    transcript, 
    listening, 
    startListening, 
    stopListening,
    supported: recognitionSupported 
  } = useSpeechRecognition();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat messages
  useEffect(() => {
    if (!chatRoomId) return;

    const q = query(
      collection(db, 'chat_messages'),
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = [];
      snapshot.forEach((doc) => {
        loadedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  // Voice recognition effect
  useEffect(() => {
    if (transcript && !listening) {
      setNewMessage(prev => prev + ' ' + transcript);
    }
  }, [transcript, listening]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !chatRoomId) return;

    try {
      await addDoc(collection(db, 'chat_messages'), {
        chatRoomId,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderType: user.userType || 'user',
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        type: 'text'
      });

      setNewMessage('');
      trackEngagement('message_sent', { chatRoomId, recipientType });
      showToast('Message sent!', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecording = () => {
    if (recognitionSupported) {
      setIsRecording(true);
      startListening();
      trackEngagement('voice_recording_started');
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    stopListening();
    trackEngagement('voice_recording_stopped');
  };

  const speakMessage = (message) => {
    if (speechSupported) {
      speak({ text: message });
      trackEngagement('text_to_speech_used');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center md:justify-end p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', x: 0 }}
          animate={{ y: 0, x: 0 }}
          exit={{ y: '100%', x: 0 }}
          className="bg-white rounded-t-3xl md:rounded-2xl w-full md:w-96 h-[80vh] md:h-[600px] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-t-3xl md:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{recipientName}</h3>
                <p className="text-sm text-emerald-100 capitalize">{recipientType}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FaComments className="mx-auto text-4xl mb-2 text-gray-300" />
                <p>Start your conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative group ${
                      message.senderId === user?.uid
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="break-words">{message.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${
                        message.senderId === user?.uid ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {message.senderId !== user?.uid && speechSupported && (
                        <button
                          onClick={() => speakMessage(message.message)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          <FaSmile className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Type your message..."}
                  className={`w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all ${
                    isRecording ? 'bg-red-50 border-red-300' : ''
                  }`}
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '100px' }}
                />
              </div>
              
              {/* Voice Recording Button */}
              {recognitionSupported && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isRecording ? <FaStop /> : <FaMicrophone />}
                </motion.button>
              )}

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-full transition-colors ${
                  newMessage.trim()
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <FaPaperPlane />
              </motion.button>
            </div>

            {/* Voice Recognition Status */}
            {recognitionSupported && isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center text-red-600 text-sm"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening... Speak now</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatSystem;