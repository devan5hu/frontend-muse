import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import './Vertex.css';

const Vertex = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div className="vertex-page">
      <div className="page-header">
        <h1>Vertex AI</h1>
        <p>Chat with Google's Vertex AI models</p>
      </div>
      <ChatInterface 
        messages={messages} 
        onSendMessage={onSendMessage} 
        modelName="Vertex AI"
        isLoading={isLoading}
      />
    </div>
  );
};

export default Vertex; 