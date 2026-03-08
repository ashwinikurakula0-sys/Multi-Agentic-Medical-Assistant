import React, { useState } from 'react';
import styled from 'styled-components';
import { FaQuestion, FaUpload, FaPlus } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useChat } from '../context/ChatContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 70px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
    'transparent'
  };
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? 
      'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' : 
      'rgba(59, 130, 246, 0.1)'
    };
    color: ${props => props.$active ? '#ffffff' : '#3b82f6'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// FAQ Panel Overlay
const FAQOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: ${props => props.$show ? 'flex' : 'none'};
  justify-content: flex-end;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const FAQPanel = styled.div`
  width: 400px;
  height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 24px;
  overflow-y: auto;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
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
`;

const FAQHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const FAQTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FAQCategory = styled.div`
  margin-bottom: 24px;
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #60a5fa;
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
  line-height: 1.4;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(96, 165, 250, 0.3);
    transform: translateX(4px);
    color: #ffffff;
  }
`;

const TopNavigation = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [showFAQ, setShowFAQ] = useState(false);
  const { sendMessage, startNewChat } = useChat();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'faq') {
      setShowFAQ(true);
    } else if (tab === 'upload') {
      // Trigger file upload
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.click();
    }
  };

  const handleFAQClick = (question) => {
    sendMessage(question);
    setShowFAQ(false);
    // No need to set active tab since we removed the chat tab
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
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo>
            <LogoIcon>🩺</LogoIcon>
            <div>
              <div>Medical Assistant</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 400, color: '#64748b' }}>
                AI Healthcare Support
              </div>
            </div>
          </Logo>

          <Navigation>
            <NavTab
              $active={activeTab === 'faq'}
              onClick={() => handleTabClick('faq')}
            >
              <FaQuestion />
              FAQ
            </NavTab>

            <NavTab
              $active={activeTab === 'upload'}
              onClick={() => handleTabClick('upload')}
            >
              <FaUpload />
              Upload
            </NavTab>

            <NewChatButton onClick={startNewChat}>
              <FaPlus />
              New Chat
            </NewChatButton>
          </Navigation>
        </HeaderContent>
      </HeaderContainer>

      <FAQOverlay $show={showFAQ} onClick={() => setShowFAQ(false)}>
        <FAQPanel onClick={(e) => e.stopPropagation()}>
          <FAQHeader>
            <FAQTitle>Frequently Asked Questions</FAQTitle>
            <CloseButton onClick={() => setShowFAQ(false)}>
              <MdClose />
            </CloseButton>
          </FAQHeader>

          {frequentlyAskedQuestions.map((categoryData, categoryIndex) => (
            <FAQCategory key={categoryIndex}>
              <CategoryTitle>{categoryData.category}</CategoryTitle>
              {categoryData.questions.map((question, questionIndex) => (
                <FAQItem
                  key={`${categoryIndex}-${questionIndex}`}
                  onClick={() => handleFAQClick(question)}
                >
                  {question}
                </FAQItem>
              ))}
            </FAQCategory>
          ))}
        </FAQPanel>
      </FAQOverlay>
    </>
  );
};

export default TopNavigation;