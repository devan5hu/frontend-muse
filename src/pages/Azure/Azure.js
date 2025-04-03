import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import './Azure.css';

function Azure({ messages, onSendMessage, isLoading }) {
  return (
    <div className="azure-container">
      <div className="azure-header">
        <h2>Azure Image Search</h2>
        <p>Upload an image or describe what you're looking for to find similar images using Azure's API.</p>
      </div>
      <ChatInterface 
        messages={messages} 
        onSendMessage={onSendMessage} 
        isLoading={isLoading}
        placeholder="Describe what you're looking for or upload an image..."
        allowImageUpload={true}
      />
    </div>
  );
}

export default Azure; 