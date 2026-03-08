import React from 'react';
import styled from 'styled-components';
import TopNavigation from './components/TopNavigation';
import ChatContainer from './components/ChatContainer';
import { ChatProvider } from './context/ChatContext';

const AppContainer = styled.div`
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%);
  color: #1e293b;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px); /* Subtract header height */
`;

function App() {
  return (
    <ChatProvider>
      <AppContainer>
        <TopNavigation />
        <MainContent>
          <ChatContainer />
        </MainContent>
      </AppContainer>
    </ChatProvider>
  );
}

export default App;
