import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaImage, FaTimes, FaUpload } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { useChat } from '../context/ChatContext';

const ChatFooter = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    background: rgba(255, 255, 255, 0.95);
  }
  
  ${props => props.$isDragActive && `
    border-color: #10b981;
    background: rgba(240, 253, 244, 0.9);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
  `}
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  margin: 4px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MessageTextarea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  font-family: inherit;
  color: #1e293b;
  placeholder-color: #94a3b8;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 16px;
  line-height: 1.5;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  margin: 4px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PreviewInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PreviewFilename = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
`;

const PreviewFilesize = styled.span`
  font-size: 0.8rem;
  color: #64748b;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

const DropzoneText = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  padding: 12px;
  
  ${props => props.$isDragActive && `
    color: #10b981;
    font-weight: 500;
  `}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ChatInput = () => {
  const { sendMessage, sendMessageWithImage, loading } = useChat();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const textareaRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (!message.trim() && !selectedFile) return;

    // Store references before clearing
    const messageToSend = message.trim();
    const fileToSend = selectedFile;

    // Clear form immediately so image disappears from input box
    setMessage('');
    setSelectedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      if (fileToSend) {
        await sendMessageWithImage(messageToSend || '', fileToSend);
      } else {
        await sendMessage(messageToSend);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // On error, you might want to restore the message/image, but for UX it's better to keep it cleared
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  return (
    <ChatFooter>
      <InputForm onSubmit={handleSubmit}>
        {selectedFile && (
          <PreviewContainer>
            <PreviewImage 
              src={URL.createObjectURL(selectedFile)} 
              alt="Preview" 
            />
            <PreviewInfo>
              <PreviewFilename>{selectedFile.name}</PreviewFilename>
              <PreviewFilesize>{formatFileSize(selectedFile.size)}</PreviewFilesize>
            </PreviewInfo>
            <RemoveButton onClick={removeFile}>
              <FaTimes />
            </RemoveButton>
          </PreviewContainer>
        )}
        
        <div {...getRootProps()}>
          <InputContainer $isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <HiddenFileInput
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              id="file-upload"
            />
            
            <UploadButton htmlFor="file-upload">
              <FaImage />
            </UploadButton>
            
            <MessageTextarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={
                isDragActive 
                  ? "Drop your medical image here..." 
                  : selectedFile 
                    ? "Add a message about your image..." 
                    : "Ask a medical question or upload an image..."
              }
              disabled={loading}
            />
            
            <SendButton 
              type="submit" 
              disabled={loading || (!message.trim() && !selectedFile)}
            >
              <FaPaperPlane />
            </SendButton>
          </InputContainer>
          
          {isDragActive && !selectedFile && (
            <DropzoneText $isDragActive>
              <FaUpload style={{ marginBottom: '8px', fontSize: '1.5rem' }} />
              <br />
              Drop your medical image here
            </DropzoneText>
          )}
        </div>
      </InputForm>
    </ChatFooter>
  );
};

export default ChatInput;