import React, { useState } from 'react';
import './ImageResults.css';

const ImageResults = ({ results }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Check if results has the expected structure
  if (!results || !results.images || results.images.length === 0) {
    return <div className="no-results">No similar images found</div>;
  }
  
  // Extract the images array
  const { images } = results;
  
  // Function to get the correct S3 image URL
  const getS3ImageUrl = (image) => {
    // S3 bucket base URL
    const s3BaseUrl = 'https://muse-objects-1.s3.us-east-1.amazonaws.com/all_images/';
    
    // Extract filename from the image object
    let filename = '';
    
    if (image.filename) {
      // Get just the filename without path
      filename = image.filename.split('/').pop();
    } else if (image.file_path) {
      // Extract from file_path (from Twelve Labs results)
      filename = image.file_path.split('/').pop();
    } else if (image.url) {
      // Extract from url (from formatted_results)
      filename = image.url.split('/').pop();
    } else {
      // Fallback
      filename = `unknown_${Math.random().toString(36).substring(7)}`;
    }
    
    // Construct the S3 URL
    return `${s3BaseUrl}${filename}`;
  };

  // Close the image preview modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="image-results">
      <h3>Similar Images</h3>
      
      <div className="image-grid">
        {images.map((image, index) => {
          const s3ImageUrl = getS3ImageUrl(image);
          
          return (
            <div 
              key={index} 
              className="image-result-card"
              onClick={() => setSelectedImage(s3ImageUrl)}
            >
              <div className="image-container">
                <img 
                  src={s3ImageUrl}
                  alt={`Similar image ${index + 1}`} 
                  data-index={index}
                  onError={(e) => {
                    // Try with .jpg extension if .png fails
                    if (!e.target.dataset.retryCount || e.target.dataset.retryCount === '0') {
                      e.target.dataset.retryCount = '1';
                      const jpgUrl = s3ImageUrl.replace('.png', '.jpg');
                      e.target.src = jpgUrl;
                    } else {
                      // If both extensions fail, just mark as error
                      e.target.style.display = 'none';
                      setImageErrors(prev => ({...prev, [index]: true}));
                    }
                  }}
                  onLoad={() => {
                    setImageErrors(prev => ({...prev, [index]: false}));
                  }}
                />
                {imageErrors[index] && (
                  <div className="image-error-overlay">
                    <button 
                      className="retry-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the modal
                        // Reset retry count and try again
                        const img = document.querySelector(`[data-index="${index}"]`);
                        if (img) {
                          img.dataset.retryCount = '0';
                          img.src = s3ImageUrl;
                          img.style.display = 'block';
                        }
                        setImageErrors(prev => ({...prev, [index]: false}));
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
              <div className="image-info">
                <div className="image-filename">
                  {image.filename || image.file_path?.split('/').pop() || `Image ${index + 1}`}
                </div>
                <div className="image-similarity">
                  {image.combined_similarity !== undefined && (
                    <div>Combined: <span className="similarity-score">{image.combined_similarity.toFixed(2)}%</span></div>
                  )}
                  {image.text_similarity !== undefined && (
                    <div>Text: <span className="similarity-score">{image.text_similarity.toFixed(2)}%</span></div>
                  )}
                  {image.image_similarity !== undefined && (
                    <div>Image: <span className="similarity-score">{image.image_similarity.toFixed(2)}%</span></div>
                  )}
                  {image.similarity !== undefined && !image.combined_similarity && !image.text_similarity && !image.image_similarity && (
                    <div>Similarity: <span className="similarity-score">{image.similarity.toFixed(2)}%</span></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>×</button>
            <img src={selectedImage} alt="Preview" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageResults; 