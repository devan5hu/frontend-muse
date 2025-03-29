import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './ChatInterface.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ChatInterface = ({ messages, onSendMessage, modelName, isLoading }) => {
  const chatMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text, image) => {
    // Pass both text and image to the parent component's handler
    onSendMessage(text, image);
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages" ref={chatMessagesRef}>
        <div className="chat-header">
          <h2>{modelName} Chat</h2>
        </div>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        chatMessagesRef={chatMessagesRef}
        isDisabled={isLoading}
      />
    </div>
  );
};

export default ChatInterface; 