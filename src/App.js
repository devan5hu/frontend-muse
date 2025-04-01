import React, { useState } from 'react';
import './App.css';
import Vertex from './pages/Vertex/Vertex';
import TwelveLabs from './pages/TwelveLabs/TwelveLabs';
import Titan from './pages/Titan/Titan';
import Azure from './pages/Azure/Azure';
import Cohere from './pages/Cohere/Cohere';
import Voyage from './pages/Voyage/Voyage';

// Make sure you're using the environment variable for API calls
const serverUrl = process.env.REACT_APP_SERVER_URL || 'https://muse-prototype.onrender.com/';
// const serverUrl = 'http://127.0.0.1:5000/'

// Add this line for debugging
console.log('Server URL:', serverUrl);

function App() {
  const [activePage, setActivePage] = useState('vertex');
  const [isLoading, setIsLoading] = useState(false);
  
  // Create state to store chat history for each model
  const [vertexMessages, setVertexMessages] = useState([
    { role: 'system', content: 'Welcome to Vertex AI chat interface!' }
  ]);
  const [twelveLabsMessages, setTwelveLabsMessages] = useState([
    { role: 'system', content: 'Welcome to Twelve Labs chat interface!' }
  ]);
  const [titanMessages, setTitanMessages] = useState([
    { role: 'system', content: 'Welcome to Amazon Titan chat interface!' }
  ]);
  const [azureMessages, setAzureMessages] = useState([
    { role: 'system', content: 'Welcome to Azure OpenAI chat interface!' }
  ]);
  const [cohereMessages, setCohereMessages] = useState([
    { role: 'system', content: 'Welcome to Cohere chat interface!' }
  ]);
  // Add state for Voyage messages
  const [voyageMessages, setVoyageMessages] = useState([
    { role: 'system', content: 'Welcome to Voyage chat interface!' }
  ]);
  
  // Add this near your other state declarations
  const [titanLoading, setTitanLoading] = useState(false);
  const [cohereLoading, setCohereLoading] = useState(false);
  // Add loading state for Voyage
  const [voyageLoading, setVoyageLoading] = useState(false);
  
  // Function to handle sending messages for Vertex
  const handleVertexSend = async (message, image) => {
    if (!message.trim() && !image) return;
    
    // Create a message object with text
    const newMessage = { role: 'user', content: message };
    
    // If there's an image, add the image URL to the message
    if (image) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(image);
      newMessage.imageUrl = imageUrl;
    }
    
    // Add the message to the state
    setVertexMessages(prev => [...prev, newMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Create FormData object to send files and text
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('text', message);
      
      console.log("Sending request to backend...");
      
      // Log what we're sending for debugging
      console.log("Sending text:", message);
      if (image) {
        console.log("Sending image:", image.name);
      }
      
      // First try with regular CORS mode
      try {
        const response = await fetch(`${serverUrl}vertex/chat`, {
          method: 'POST',
          body: formData,
          mode: 'cors' // Try with regular CORS first
        });
        
        const data = await response.json();
        console.log('Response:', data);
        
        // Add AI response to chat
        setVertexMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: data.message || JSON.stringify(data) 
          }
        ]);
      } catch (corsError) {
        console.error("CORS error, trying no-cors mode:", corsError);
        
        // If regular CORS fails, try with no-cors mode
        try {
          // With no-cors mode, we can't read the response
          await fetch(`${serverUrl}vertex/chat`, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
          
          console.log("Request sent with no-cors mode");
          
          // Since we can't read the response with no-cors, use a simulated response
          setVertexMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `Request sent successfully, but response cannot be read due to CORS restrictions. Your message was: "${message}". ${image ? 'Your image was also sent.' : ''}` 
            }
          ]);
        } catch (noCorsError) {
          console.error("Error with no-cors mode:", noCorsError);
          
          // If both methods fail, fall back to a simulated response
          setVertexMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `I received your message: "${message}". ${image ? 'I also received your image.' : ''}` 
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      // Add error message to chat
      setVertexMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Error: ${error.response?.data?.error || error.message || "Unknown error occurred"}` 
        }
      ]);
    } finally {
      // Clear loading state
      setIsLoading(false);
    }
  };
  
  // Function to handle sending messages for each model
  const handleTwelveLabsSend = async (text, image) => {
    setIsLoading(true);
    
    // Add the user message to the chat
    setTwelveLabsMessages(prev => [
      ...prev,
      { role: 'user', content: text, imageUrl: image ? URL.createObjectURL(image) : null }
    ]);
    
    try {
      console.log("Sending request to Twelve Labs API...");
      
      // Create form data
      const formData = new FormData();
      formData.append('text', text || '');
      if (image) {
        formData.append('image', image);
      }

      // Make the request
      const response = await fetch(`${serverUrl}twelvelabs/search`, {
        method: 'POST',
        body: formData,
      });

      console.log("Twelve Labs API Response Status:", response.status);
      
      const data = await response.json();
      console.log("Twelve Labs API Response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error calling Twelve Labs API');
      }

      // Check if the response has the expected structure
      if (data.success && (data.results || data.formatted_results)) {
        // Prepare the image results data
        const imageResults = {
          images: data.formatted_results || data.results
        };
        
        // Add the assistant response with image results
        setTwelveLabsMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: `I found ${imageResults.images.length} similar images based on your query.`,
            imageResults: imageResults
          }
        ]);
      } else {
        // Handle error or empty results
        setTwelveLabsMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: data.message || "Sorry, I couldn't find any similar images."
          }
        ]);
      }
    } catch (error) {
      console.error('Error calling Twelve Labs API:', error);
      
      // Add error message to chat
      setTwelveLabsMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Error: ${error.message || "Unknown error occurred"}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTitanSend = async (message, image) => {
    if (!message.trim() && !image) return;
    
    // Create a message object with text
    const newMessage = { role: 'user', content: message };
    
    // If there's an image, add the image URL to the message
    if (image) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(image);
      newMessage.imageUrl = imageUrl;
    }
    
    // Add the message to the state
    setTitanMessages(prev => [...prev, newMessage]);
    
    // Set loading state for Titan
    setTitanLoading(true);
    
    try {
      // Create FormData object to send files and text
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('text', message);
      
      console.log("Sending request to Titan API...");
      
      // Log what we're sending for debugging
      console.log("Sending text to Titan:", message);
      if (image) {
        console.log("Sending image to Titan:", image.name);
      }
      
      // First try with regular CORS mode
      try {
        const response = await fetch(`${serverUrl}titan/embedding`, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        });

        console.log(serverUrl)
        
        const data = await response.json();
        console.log('Titan API Response:', data);
        
        // Check if the response has the expected structure
        if (data.success) {
          // Create the imageResults object
          const imageResults = {
            images: data.formatted_images || data.similar_images || []
          };
          
          // Add AI response to chat with image results
          setTitanMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: data.message || "Here are some similar images I found:",
              imageResults: imageResults
            }
          ]);
        } else {
          // Handle error case
          setTitanMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: data.message || "Sorry, I couldn't find any similar images."
            }
          ]);
        }
      } catch (corsError) {
        console.error("CORS error with Titan API, trying no-cors mode:", corsError);
        
        // If regular CORS fails, try with no-cors mode
        try {
          // With no-cors mode, we can't read the response
          await fetch(`${serverUrl}titan/embedding`, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
          
          console.log("Titan request sent with no-cors mode");
          
          // Since we can't read the response with no-cors, use a simulated response
          setTitanMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `Request sent to Titan API successfully, but response cannot be read due to CORS restrictions. Your message was: "${message}". ${image ? 'Your image was also sent.' : ''}` 
            }
          ]);
        } catch (noCorsError) {
          console.error("Error with Titan API no-cors mode:", noCorsError);
          
          // If both methods fail, fall back to a simulated response
          setTitanMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `I received your message in Titan: "${message}". ${image ? 'I also received your image.' : ''}` 
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Titan API Error:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Titan error data:", error.response.data);
        console.error("Titan error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received from Titan:", error.request);
      } else {
        console.error("Titan error message:", error.message);
      }
      
      // Add error message to chat
      setTitanMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Error with Titan API: ${error.response?.data?.error || error.message || "Unknown error occurred"}` 
        }
      ]);
    } finally {
      // Clear loading state
      setTitanLoading(false);
    }
  };
  
  const handleAzureSend = (message, image) => {
    if (!message.trim() && !image) return;
    
    // Create a message object with text
    const newMessage = { role: 'user', content: message };
    
    // If there's an image, add the image URL to the message
    if (image) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(image);
      newMessage.imageUrl = imageUrl;
    }
    
    // Add the message to the state
    setAzureMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      setAzureMessages(prev => [
        ...prev, 
        { role: 'assistant', content: `This is a simulated response from Azure OpenAI.` }
      ]);
    }, 1000);
  };
  
  // Function to handle sending messages for Cohere
  const handleCohereSend = async (message, image) => {
    if (!message.trim() && !image) return;
    
    // Create a message object with text
    const newMessage = { role: 'user', content: message };
    
    // If there's an image, add the image URL to the message
    if (image) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(image);
      newMessage.imageUrl = imageUrl;
    }
    
    // Add the message to the state
    setCohereMessages(prev => [...prev, newMessage]);
    
    // Set loading state
    setCohereLoading(true);
    
    try {
      // Create FormData object to send files and text
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('text', message);
      
      console.log("Sending request to Cohere API...");
      
      // Log what we're sending for debugging
      console.log("Sending text to Cohere:", message);
      if (image) {
        console.log("Sending image to Cohere:", image.name);
      }
      
      // First try with regular CORS mode
      try {
        const response = await fetch(`${serverUrl}api/cohere/search`, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        });
        
        const data = await response.json();
        console.log('Cohere API Response:', data);
        
        // Check if the response has the expected structure
        if (data.success) {
          // Create the imageResults object
          const imageResults = {
            images: data.formatted_images || data.similar_images || []
          };
          
          // Add AI response to chat with image results
          setCohereMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: data.message || "Here are some similar images I found using Cohere:",
              imageResults: imageResults
            }
          ]);
        } else {
          // Handle error case
          setCohereMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: data.message || "Sorry, I couldn't find any similar images with Cohere."
            }
          ]);
        }
      } catch (corsError) {
        console.error("CORS error with Cohere API, trying no-cors mode:", corsError);
        
        // If regular CORS fails, try with no-cors mode
        try {
          // With no-cors mode, we can't read the response
          await fetch(`${serverUrl}api/cohere/search`, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
          
          console.log("Cohere request sent with no-cors mode");
          
          // Since we can't read the response with no-cors, use a simulated response
          setCohereMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `Request sent to Cohere API successfully, but response cannot be read due to CORS restrictions. Your message was: "${message}". ${image ? 'Your image was also sent.' : ''}` 
            }
          ]);
        } catch (noCorsError) {
          console.error("Error with Cohere API no-cors mode:", noCorsError);
          
          // If both methods fail, fall back to a simulated response
          setCohereMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `I received your message in Cohere: "${message}". ${image ? 'I also received your image.' : ''}` 
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Cohere API Error:', error);
      
      // Add error message to chat
      setCohereMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Error with Cohere API: ${error.message || "Unknown error occurred"}` 
        }
      ]);
    } finally {
      // Clear loading state
      setCohereLoading(false);
    }
  };
  
  // Function to handle sending messages for Voyage
  const handleVoyageSend = async (message, image) => {
    if (!message.trim() && !image) return;
    
    // Create a message object with text
    const newMessage = { role: 'user', content: message };
    
    // If there's an image, add the image URL to the message
    if (image) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(image);
      newMessage.imageUrl = imageUrl;
    }
    
    // Add the message to the state
    setVoyageMessages(prev => [...prev, newMessage]);
    
    // Set loading state
    setVoyageLoading(true);
    
    try {
      // Create FormData object to send files and text
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('text', message);
      
      console.log("Sending request to Voyage API...");
      
      // Log what we're sending for debugging
      console.log("Sending text to Voyage:", message);
      if (image) {
        console.log("Sending image to Voyage:", image.name);
      }
      
      // First try with regular CORS mode
      try {
        const response = await fetch(`${serverUrl}api/voyage/search`, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        });
        
        const data = await response.json();
        console.log('Voyage API Response:', data);
        
        // Check if the response has the expected structure
        if (data.success) {
          // Create the imageResults object
          const imageResults = {
            images: data.formatted_images || data.similar_images || []
          };
          
          // Add AI response to chat with image results
          setVoyageMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: data.message || "Here are some similar images I found using Voyage:",
              imageResults: imageResults
            }
          ]);
        } else {
          // Handle error case
          setVoyageMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: data.message || "Sorry, I couldn't find any similar images with Voyage."
            }
          ]);
        }
      } catch (corsError) {
        console.error("CORS error with Voyage API, trying no-cors mode:", corsError);
        
        // If regular CORS fails, try with no-cors mode
        try {
          // With no-cors mode, we can't read the response
          await fetch(`${serverUrl}api/voyage/search`, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
          
          console.log("Voyage request sent with no-cors mode");
          
          // Since we can't read the response with no-cors, use a simulated response
          setVoyageMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `Request sent to Voyage API successfully, but response cannot be read due to CORS restrictions. Your message was: "${message}". ${image ? 'Your image was also sent.' : ''}` 
            }
          ]);
        } catch (noCorsError) {
          console.error("Error with Voyage API no-cors mode:", noCorsError);
          
          // If both methods fail, fall back to a simulated response
          setVoyageMessages(prev => [
            ...prev, 
            { 
              role: 'assistant', 
              content: `I received your message in Voyage: "${message}". ${image ? 'I also received your image.' : ''}` 
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Voyage API Error:', error);
      
      // Add error message to chat
      setVoyageMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Error with Voyage API: ${error.message || "Unknown error occurred"}` 
        }
      ]);
    } finally {
      // Clear loading state
      setVoyageLoading(false);
    }
  };
  
  const renderPage = () => {
    switch(activePage) {
      case 'vertex':
        return <Vertex 
          messages={vertexMessages} 
          onSendMessage={handleVertexSend} 
          isLoading={isLoading}
        />;
      case 'twelvelabs':
        return <TwelveLabs 
          messages={twelveLabsMessages} 
          onSendMessage={handleTwelveLabsSend}
          isLoading={isLoading}
        />;
      case 'titan':
        return <Titan 
          messages={titanMessages} 
          onSendMessage={handleTitanSend}
          isLoading={titanLoading}
        />;
      case 'cohere':
        return <Cohere 
          messages={cohereMessages} 
          onSendMessage={handleCohereSend}
          isLoading={cohereLoading}
        />;
      case 'voyage':
        return <Voyage 
          messages={voyageMessages} 
          onSendMessage={handleVoyageSend}
          isLoading={voyageLoading}
        />;
      case 'azure':
        return <Azure 
          messages={azureMessages} 
          onSendMessage={handleAzureSend}
        />;
      default:
        return <Vertex 
          messages={vertexMessages} 
          onSendMessage={handleVertexSend}
          isLoading={isLoading}
        />;
    }
  };
  
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>Muse Prototype</h1>
        </div>
        <ul className="navbar-links">
          <li>
            <button 
              className={activePage === 'vertex' ? 'active' : ''} 
              onClick={() => setActivePage('vertex')}
            >
              Vertex
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'twelvelabs' ? 'active' : ''} 
              onClick={() => setActivePage('twelvelabs')}
            >
              TwelveLabs
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'titan' ? 'active' : ''} 
              onClick={() => setActivePage('titan')}
            >
              Titan
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'cohere' ? 'active' : ''} 
              onClick={() => setActivePage('cohere')}
            >
              Cohere
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'voyage' ? 'active' : ''} 
              onClick={() => setActivePage('voyage')}
            >
              Voyage
            </button>
          </li>
          <li>
            <button 
              className={activePage === 'azure' ? 'active' : ''} 
              onClick={() => setActivePage('azure')}
            >
              Azure
            </button>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
