import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';

function Cohere({ messages, onSendMessage, isLoading }) {
  return (
    <div className="cohere-container">
      <div className="cohere-header">
        <h2>Cohere Image Search</h2>
        <p>Upload an image or describe what you're looking for to find similar images using Cohere's API.</p>
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

export default Cohere; 