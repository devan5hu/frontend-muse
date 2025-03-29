import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import './TwelveLabs.css';

const TwelveLabs = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div className="twelvelabs-container">
      <ChatInterface 
        messages={messages} 
        onSendMessage={onSendMessage}
        modelName="Twelve Labs"
        isLoading={isLoading}
      />
    </div>
  );
};

export default TwelveLabs; 