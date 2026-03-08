import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

// Action types
const CHAT_ACTIONS = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TYPING: 'SET_TYPING',
  SET_CURRENT_AGENT: 'SET_CURRENT_AGENT'
};

// Reducer for chat state management
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case CHAT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case CHAT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CHAT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case CHAT_ACTIONS.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };
    case CHAT_ACTIONS.SET_CURRENT_AGENT:
      return {
        ...state,
        currentAgent: action.payload
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  messages: [],
  loading: false,
  error: null,
  isTyping: false,
  currentAgent: null
};

// Local storage keys
const STORAGE_KEYS = {
  MESSAGES: 'medical_assistant_messages',
  SESSION_ID: 'medical_assistant_session_id'
};

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return {
      ...initialState,
      messages: savedMessages ? JSON.parse(savedMessages) : []
    };
  } catch (error) {
    console.error('Error loading messages from localStorage:', error);
    return initialState;
  }
};

// Load or create session ID
const loadSessionId = () => {
  try {
    const savedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (savedSessionId) {
      return savedSessionId;
    }
  } catch (error) {
    console.error('Error loading session ID from localStorage:', error);
  }
  
  // Create new session ID
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSessionId);
  } catch (error) {
    console.error('Error saving session ID to localStorage:', error);
  }
  return newSessionId;
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, loadInitialState());
  const [sessionId] = useState(loadSessionId);

  // API configuration
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [state.messages]);

  // Send text message
  const sendMessage = async (message) => {
    try {
      console.log('🚀 Sending message:', message);
      console.log('📡 API URL:', `${API_BASE_URL}/chat`);
      console.log('🆔 Session ID:', sessionId);
      
      dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: true });

      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: userMessage });

      // Send to backend
      const formData = new FormData();
      formData.append('message', message);
      formData.append('session_id', sessionId);

      console.log('📤 Sending request to backend...');
      const response = await axios.post(`${API_BASE_URL}/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('📥 Backend response:', response.data);

      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        agent: state.currentAgent
      };
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: aiMessage });

    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to send message. Please try again.' });
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      };
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: errorMessage });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: false });
    }
  };

  // Send message with image
  const sendMessageWithImage = async (message, imageFile) => {
    try {
      dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: true });

      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        text: message || 'Image uploaded',
        sender: 'user',
        timestamp: new Date().toISOString(),
        image: URL.createObjectURL(imageFile),
        hasImage: true
      };
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: userMessage });

      // Send to backend
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('session_id', sessionId);
      if (message) {
        formData.append('message', message);
      }

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        agent: 'IMAGE_ANALYSIS_AGENT'
      };
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: aiMessage });

    } catch (error) {
      console.error('Error sending image:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to process image. Please try again.' });
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your image. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      };
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: errorMessage });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: false });
    }
  };

  // Start new chat function
  const startNewChat = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      // Reload page to reset session cleanly
      window.location.reload();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const value = {
    ...state,
    sessionId,
    sendMessage,
    sendMessageWithImage,
    startNewChat,
    dispatch
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};