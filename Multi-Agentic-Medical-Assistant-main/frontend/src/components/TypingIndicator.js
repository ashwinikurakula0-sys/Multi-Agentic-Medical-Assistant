import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaRobot } from 'react-icons/fa';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const TypingContainer = styled.div`
  display: flex;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const TypingBubble = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 16px 20px;
  border-radius: 20px 20px 20px 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  position: relative;
  min-width: 80px;
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 12px;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-right-color: #ffffff;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #64748b;
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.$delay || '0s'};
`;

const TypingText = styled.span`
  color: #64748b;
  font-size: 0.9rem;
  margin-right: 8px;
  font-style: italic;
`;

const TypingIndicator = () => {
  return (
    <TypingContainer>
      <Avatar>
        <FaRobot />
      </Avatar>
      <TypingBubble>
        <DotsContainer>
          <TypingText>AI is thinking</TypingText>
          <Dot $delay="0s" />
          <Dot $delay="0.2s" />
          <Dot $delay="0.4s" />
        </DotsContainer>
      </TypingBubble>
    </TypingContainer>
  );
};

export default TypingIndicator;