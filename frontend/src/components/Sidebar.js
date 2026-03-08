import React from 'react';
import styled from 'styled-components';
import { FaPlus, FaQuestion, FaStethoscope } from 'react-icons/fa';
import { useChat } from '../context/ChatContext';

const SidebarContainer = styled.aside`
  width: 320px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #fff;
  padding: 24px;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 300;
`;

const Section = styled.section`
  margin-bottom: 28px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
    margin-left: 12px;
  }
`;



const NewChatButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FAQItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.4;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(96, 165, 250, 0.3);
    transform: translateX(4px);
    color: #ffffff;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FAQIcon = styled.div`
  font-size: 1rem;
  color: #60a5fa;
  min-width: 16px;
  margin-top: 2px;
`;

const Sidebar = () => {
  const { startNewChat, sendMessage } = useChat();

  const handleFAQClick = (question) => {
    sendMessage(question);
  };
  const frequentlyAskedQuestions = [
    {
      category: "💊 General Health",
      questions: [
        "What are the symptoms of diabetes?",
        "How to prevent heart disease?",
        "What causes high blood pressure?",
        "Signs of vitamin D deficiency"
      ]
    },
    {
      category: "🧠 Mental Health",
      questions: [
        "How to manage anxiety naturally?",
        "Signs of depression to watch for",
        "Tips for better sleep hygiene",
        "Stress management techniques"
      ]
    },
    {
      category: "🏃‍♂️ Fitness & Nutrition",
      questions: [
        "Best foods for heart health",
        "How much water should I drink daily?",
        "Benefits of regular exercise",
        "Healthy weight loss strategies"
      ]
    },
    {
      category: "🤱 Women's Health",
      questions: [
        "Early signs of pregnancy",
        "Menstrual cycle irregularities",
        "Breast cancer prevention tips",
        "Menopause symptoms management"
      ]
    },
    {
      category: "👨‍⚕️ Medical Emergencies",
      questions: [
        "Heart attack warning signs",
        "When to seek emergency care?",
        "Stroke symptoms (FAST method)",
        "First aid for common injuries"
      ]
    }
  ];

  return (
    <SidebarContainer>
      <Header>
        <Title>🩺 Medical Assistant</Title>
        <Subtitle>AI-Powered Healthcare Support</Subtitle>
      </Header>

      <NewChatButton onClick={startNewChat}>
        <FaPlus />
        New Chat
      </NewChatButton>

      <Section>
        <SectionTitle>
          <FaQuestion />
          Frequently Asked Questions
        </SectionTitle>
        
        {frequentlyAskedQuestions.map((categoryData, categoryIndex) => (
          <div key={categoryIndex}>
            <SectionTitle style={{ fontSize: '0.9rem', marginBottom: '12px', marginTop: '20px' }}>
              {categoryData.category}
            </SectionTitle>
            {categoryData.questions.map((question, questionIndex) => (
              <FAQItem
                key={`${categoryIndex}-${questionIndex}`}
                onClick={() => handleFAQClick(question)}
              >
                <FAQIcon><FaStethoscope /></FAQIcon>
                {question}
              </FAQItem>
            ))}
          </div>
        ))}
      </Section>
    </SidebarContainer>
  );
};

export default Sidebar;