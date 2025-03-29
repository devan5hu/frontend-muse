import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ChatInput = ({ onSendMessage, chatMessagesRef, isDisabled }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled || (!message.trim() && !image)) return;
    
    // In a real app, you would handle the image upload and send both the message and image
    onSendMessage(message, image);
    
    // Clear the input fields
    setMessage('');
    setImage(null);
    setImagePreview(null);
  };

  const handleSavePDF = async () => {
    if (!chatMessagesRef || !chatMessagesRef.current) {
      alert('No chat messages to save');
      return;
    }

    try {
      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `chat-history-${timestamp}.pdf`;
      
      // Get the chat messages container
      const messagesContainer = chatMessagesRef.current;
      
      // Add PDF mode class for better styling during capture
      messagesContainer.classList.add('pdf-mode');
      
      // Wait for styling to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create canvas from the messages container
      const canvas = await html2canvas(messagesContainer, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // To handle images from different origins
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000, // Longer timeout for images to load
        allowTaint: true // Allow cross-origin images
      });
      
      // Remove PDF mode class
      messagesContainer.classList.remove('pdf-mode');
      
      // Calculate PDF dimensions
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Chat History', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
      
      // Add image (first page)
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 30);
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    
    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="chat-input-container">
      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button 
            type="button" 
            className="remove-image-button"
            onClick={removeImage}
            disabled={isDisabled}
          >
            ×
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDisabled ? "Processing..." : "Type a message..."}
          className="chat-input"
          disabled={isDisabled}
        />
        <div className="button-group">
          <button 
            type="button" 
            className="upload-image-button"
            onClick={triggerFileInput}
            disabled={isDisabled}
          >
            <span role="img" aria-label="Upload Image">📷</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
            disabled={isDisabled}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isDisabled}
          >
            Send
          </button>
          <button 
            type="button" 
            className="save-pdf-button"
            onClick={handleSavePDF}
            disabled={true}
          >
            Save as PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 