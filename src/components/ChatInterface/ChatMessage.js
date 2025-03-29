import React from 'react';
import ImageResults from '../ImageResults/ImageResults';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const { role, content, imageUrl, imageResults } = message;
  
  return (
    <div className={`chat-message ${role}`}>
      <div className="message-avatar">
        {role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        {content}
        
        {imageUrl && (
          <div className="message-image-container">
            <img src={imageUrl} alt="User uploaded" className="message-image" />
          </div>
        )}
        
        {imageResults && (
          <ImageResults results={imageResults} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 