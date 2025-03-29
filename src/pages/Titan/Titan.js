import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import './Titan.css';

const Titan = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div className="titan-container">
      <ChatInterface 
        messages={messages} 
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        placeholder="Ask Titan something..."
      />
    </div>
  );
};

export default Titan; 