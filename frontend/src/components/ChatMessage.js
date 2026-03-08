import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaUser, FaRobot, FaExclamationTriangle } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.$isUser ? 'row-reverse' : 'row'};
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  flex-shrink: 0;
  box-shadow: ${props => {
    if (props.$isUser) return '0 6px 20px rgba(59, 130, 246, 0.4)';
    return '0 6px 20px rgba(16, 185, 129, 0.4)';
  }};
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  background: ${props => {
    if (props.$isError) return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    if (props.$isUser) return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  }};
`;

const MessageBubble = styled.div`
  max-width: 75%;
  background: ${props => {
    if (props.$isError) return 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
    if (props.$isUser) return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    return 'rgba(255, 255, 255, 0.9)';
  }};
  color: ${props => {
    if (props.$isError) return '#991b1b';
    if (props.$isUser) return '#ffffff';
    return '#1e293b';
  }};
  padding: 18px 24px;
  border-radius: ${props => props.$isUser ? '24px 24px 8px 24px' : '24px 24px 24px 8px'};
  box-shadow: ${props => {
    if (props.$isUser) return '0 8px 32px rgba(59, 130, 246, 0.3)';
    return '0 8px 32px rgba(0, 0, 0, 0.1)';
  }};
  border: 1px solid ${props => {
    if (props.$isError) return '#fca5a5';
    if (props.$isUser) return 'rgba(255, 255, 255, 0.2)';
    return 'rgba(255, 255, 255, 0.3)';
  }};
  backdrop-filter: blur(10px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    ${props => props.$isUser ? `
      right: -10px;
      top: 16px;
      border-left-color: #3b82f6;
    ` : `
      left: -10px;
      top: 16px;
      border-right-color: rgba(255, 255, 255, 0.9);
    `}
  }
`;

const MessageContent = styled.div`
  line-height: 1.6;
  font-size: 0.95rem;
  
  p {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin-bottom: 12px;
    margin-top: 20px;
    color: ${props => props.$isUser ? '#ffffff' : '#1e40af'};
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  h1 {
    font-size: 1.4rem;
    border-bottom: 2px solid ${props => props.$isUser ? 'rgba(255,255,255,0.4)' : '#3b82f6'};
    padding-bottom: 6px;
  }
  
  h2 {
    font-size: 1.2rem;
    border-bottom: 1px solid ${props => props.$isUser ? 'rgba(255,255,255,0.3)' : '#e2e8f0'};
    padding-bottom: 4px;
  }
  
  h3 {
    font-size: 1.05rem;
    color: ${props => props.$isUser ? '#ffffff' : '#1e40af'};
  }
  
  h4, h5, h6 {
    font-size: 1rem;
    color: ${props => props.$isUser ? '#ffffff' : '#374151'};
  }
  
  ul {
    margin: 12px 0;
    padding-left: 0;
    list-style: none;
  }
  
  li {
    margin-bottom: 8px;
    padding-left: 24px;
    position: relative;
    
    &:before {
      content: '•';
      position: absolute;
      left: 8px;
      color: ${props => props.$isUser ? '#ffffff' : '#333333'};
      font-weight: bold;
      font-size: 1.2em;
    }
    
    &.numbered {
      counter-increment: list-counter;
      
      &:before {
        content: counter(list-counter) '.';
        color: ${props => props.$isUser ? '#ffffff' : '#333333'};
        font-weight: 600;
        font-size: 0.9em;
      }
    }
  }
  
  ol {
    counter-reset: list-counter;
    margin: 12px 0;
    padding-left: 0;
    list-style: none;
    
    li {
      counter-increment: list-counter;
      
      &:before {
        content: counter(list-counter) '.';
        color: ${props => props.$isUser ? '#ffffff' : '#333333'};
        font-weight: 600;
        font-size: 0.9em;
      }
    }
  }
  
  strong {
    font-weight: 700;
    color: ${props => props.$isUser ? '#ffffff' : 'inherit'};
  }
  
  .medical-term {
    font-weight: 700;
    color: ${props => props.$isUser ? '#ffffff' : 'inherit'};
  }
  
  .symptom-highlight {
    font-weight: 600;
    color: ${props => props.$isUser ? '#ffffff' : 'inherit'};
  }
  
  em {
    font-style: italic;
    color: ${props => props.$isUser ? 'rgba(255,255,255,0.9)' : '#4b5563'};
  }
  
  code {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
`;

const MessageImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const MessageMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.7)' : '#64748b'};
`;

const AgentBadge = styled.span`
  background: ${props => {
    switch (props.$agent) {
      case 'RAG_AGENT': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'WEB_SEARCH_PROCESSOR_AGENT': return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
      case 'IMAGE_ANALYSIS_AGENT': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      default: return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TypingText = ({ text, isUser, messageTimestamp }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    // Check if message is newer than 2 seconds (likely a new message)
    const messageTime = new Date(messageTimestamp).getTime();
    const currentTime = Date.now();
    const isRecentMessage = (currentTime - messageTime) < 2000; // 2 seconds
    
    if (isUser || !isRecentMessage) {
      // Show user messages and older messages instantly
      setDisplayText(text);
      return;
    }
    
    // ChatGPT-style typing animation for new bot messages only
    let currentIndex = 0;
    setDisplayText('');
    
    const typingSpeed = 15; // milliseconds per character
    
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);
    
    return () => clearInterval(timer);
  }, [text, isUser, messageTimestamp]);
  
  // Custom renderer for medical terms
  const components = {
    p: ({ children }) => (
      <p style={{ marginBottom: '8px', lineHeight: '1.5' }}>{children}</p>
    ),
    h1: ({ children }) => (
      <h1 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '700', 
        marginBottom: '8px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '4px'
      }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ 
        fontSize: '1.1rem', 
        fontWeight: '700', 
        marginBottom: '6px'
      }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '700', 
        marginBottom: '4px'
      }}>{children}</h3>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: '700' }}>{children}</strong>
    ),
    ul: ({ children }) => (
      <ul style={{ marginLeft: '16px', marginBottom: '8px' }}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol style={{ marginLeft: '16px', marginBottom: '8px' }}>{children}</ol>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: '2px', lineHeight: '1.4' }}>{children}</li>
    )
  };
  
  return (
    <ReactMarkdown 
      components={components}
      remarkPlugins={[remarkGfm]}
    >
      {displayText}
    </ReactMarkdown>
  );
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;

  const handleImageClick = () => {
    if (message.image) {
      window.open(message.image, '_blank');
    }
  };

  return (
    <MessageContainer $isUser={isUser}>
      <Avatar $isUser={isUser} $isError={isError}>
        {isError ? <FaExclamationTriangle /> : isUser ? <FaUser /> : <FaRobot />}
      </Avatar>
      
      <MessageBubble $isUser={isUser} $isError={isError}>
        <MessageContent $isUser={isUser}>
          <TypingText text={message.text} isUser={isUser} messageTimestamp={message.timestamp} />
          {message.hasImage && message.image && (
            <MessageImage
              src={message.image}
              alt="Uploaded medical image"
              onClick={handleImageClick}
            />
          )}
        </MessageContent>
        
        <MessageMetadata $isUser={isUser}>
          <MdAccessTime />
          {formatTime(message.timestamp)}
          {message.agent && !isUser && (
            <AgentBadge $agent={message.agent}>
              {message.agent.replace('_', ' ')}
            </AgentBadge>
          )}
        </MessageMetadata>
      </MessageBubble>
    </MessageContainer>
  );
};

export default ChatMessage;