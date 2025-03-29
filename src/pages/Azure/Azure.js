import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import './Azure.css';

const Azure = ({ messages, onSendMessage }) => {
  return (
    <div className="azure-page">
      <div className="page-header">
        <h1>Azure</h1>
        <p>Chat with Microsoft's Azure OpenAI models</p>
      </div>
      <ChatInterface messages={messages} onSendMessage={onSendMessage} modelName="Azure" />
    </div>
  );
};

export default Azure; 