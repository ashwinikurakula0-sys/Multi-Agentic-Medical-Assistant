import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const ChatMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 70px); /* Account for header height */
  overflow: hidden;
`;

// Container for centered layout when no messages
const CenteredContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px); /* Exact height to prevent scrolling */
  max-height: calc(100vh - 120px);
  overflow: hidden;
  padding: 20px;
  text-align: center;
  animation: fadeIn 0.6s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Container for normal chat layout with messages
const ChatMessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  animation: slideInFromTop 0.5s ease-out;
  
  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(59, 130, 246, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }
`;

// Container for input that can be positioned differently
const InputContainer = styled.div`
  width: 100%;
  max-width: ${props => props.$centered ? '700px' : '100%'};
  margin: ${props => props.$centered ? '20px auto 0' : '0'};
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$centered ? 'scale(1.02)' : 'scale(1)'};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #64748b;
  padding: 20px;
  margin-bottom: 20px;
  flex-shrink: 0;
  animation: fadeInUp 0.8s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 16px;
  color: #3b82f6;
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
  text-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptyStateText = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 450px;
  color: #64748b;
  margin-bottom: 0;
`;

const ErrorBanner = styled.div`
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  color: #991b1b;
  padding: 16px 24px;
  margin: 16px 32px;
  border-radius: 12px;
  border-left: 4px solid #dc2626;
  font-weight: 500;
`;

const ChatContainer = () => {
  const { messages, error, isTyping } = useChat();
  const chatBoxRef = useRef(null);
  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <ChatMain>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {!hasMessages ? (
        // Centered layout for empty state
        <CenteredContainer>
          <EmptyState>
            <EmptyStateIcon>🏥</EmptyStateIcon>
            <EmptyStateTitle>Welcome to Medical Assistant</EmptyStateTitle>
            <EmptyStateText>
              Ask me about your health, upload medical images, or browse our FAQ for quick answers.
            </EmptyStateText>
          </EmptyState>
          
          <InputContainer $centered={true}>
            <ChatInput />
          </InputContainer>
        </CenteredContainer>
      ) : (
        // Normal layout with messages
        <ChatMessagesContainer>
          <ChatBox ref={chatBoxRef}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </ChatBox>

          <InputContainer $centered={false}>
            <ChatInput />
          </InputContainer>
        </ChatMessagesContainer>
      )}
    </ChatMain>
  );
};

export default ChatContainer;