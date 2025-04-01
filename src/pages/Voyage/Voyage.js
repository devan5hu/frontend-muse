import React from 'react';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import './Voyage.css';

function Voyage({ messages, onSendMessage, isLoading }) {
  return (
    <div className="voyage-container">
      <div className="voyage-header">
        <h2>Voyage Image Search</h2>
        <p>Upload an image or describe what you're looking for to find similar images using Voyage's API.</p>
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

export default Voyage; 