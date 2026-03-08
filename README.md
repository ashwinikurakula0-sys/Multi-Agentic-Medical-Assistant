# 🏥 Multi-Agentic Medical Assistant

A cutting-edge AI-powered medical assistant that leverages multiple specialized agents to provide comprehensive healthcare support through text and image analysis.

## 🌟 Features

### Core Functionalities
- **💬 Conversational Medical Chat**: Natural language medical consultations with LLM-powered responses
- **🔍 RAG-based Knowledge Retrieval**: Access to medical document database for accurate information
- **🌐 Real-time Web Search**: Latest medical research and treatment information via Tavily API
- **🖼️ Medical Image Analysis**: Advanced AI-powered analysis of medical images (X-rays, MRIs, CT scans, etc.)
- **🛡️ Content Safety Guardrails**: Built-in safety mechanisms to ensure appropriate medical guidance
- **💾 Session Memory**: Persistent conversation history for contextual interactions

### Multi-Agent Architecture
- **Agent Decision Router**: Intelligently routes queries to the most appropriate specialist agent
- **Conversation Agent**: Handles general health queries and medical discussions
- **RAG Agent**: Retrieves information from curated medical document databases
- **Web Search Agent**: Searches for latest research and treatment protocols
- **Vision Agent**: Analyzes medical images with detailed diagnostic insights
- **Guardrails Agent**: Ensures safe and appropriate medical content

## 🚀 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: 
  - LangChain & LangGraph for agent orchestration
  - Groq API for LLM inference (Llama 3.3 70B)
  - HuggingFace Transformers for embeddings
  - ChromaDB for vector storage
- **External APIs**:
  - Tavily Search for web research
  - Groq Vision API for image analysis
- **Core Libraries**:
  - Pydantic for data validation
  - Python-dotenv for environment management
  - PyPDF2 for document processing
  - Pillow for image processing

### Frontend
- **Framework**: React 18+ with Hooks
- **Styling**: Styled-components
- **UI Components**: 
  - React Dropzone for file uploads
  - React Icons for iconography
  - React Markdown for rich text rendering
- **HTTP Client**: Axios for API communication
- **Build Tool**: Create React App

### Database & Storage
- **Vector Database**: ChromaDB for semantic search
- **Session Storage**: In-memory chat history
- **File Storage**: Temporary image processing

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher
- **API Keys**: 
  - Groq API key (for LLM inference)
  - Tavily API key (for web search)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Amit-iitg/Multi-Agentic-Medical-Assistant.git
cd Multi-Agentic-Medical-Assistant
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your API keys
# Required variables:
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
LLM_MODEL_NAME=llama-3.3-70b-versatile
```

#### Initialize RAG Database (Optional)
```bash
# If you want to add custom medical documents
python agents/rag_agent/build_rag_vectorstore.py
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend Development Server
```bash
cd frontend
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

##  Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GROQ_API_KEY` | Groq API key for LLM inference | - | ✅ |
| `TAVILY_API_KEY` | Tavily API key for web search | - | ✅ |
| `LLM_MODEL_NAME` | Groq model name | `llama-3.3-70b-versatile` | ❌ |

### Supported Image Formats
- JPEG/JPG
- PNG
- BMP
- GIF
- Maximum file size: 10MB

### Model Configuration
- **Text Model**: Llama 3.3 70B Versatile (via Groq)
- **Vision Model**: Meta-Llama/Llama-4-Scout-17B (via Groq)
- **Embeddings**: sentence-transformers/all-MiniLM-L6-v2

## 🏗️ Project Structure

```
├── backend/                    # FastAPI backend
│   ├── main.py                # Main API server
│   ├── agents/                # AI agent modules
│   │   ├── agent_decision.py  # Main agent orchestrator
│   │   ├── medical_chat_agent.py
│   │   ├── guardrails.py      # Safety mechanisms
│   │   ├── llm_loader.py      # LLM configuration
│   │   ├── rag_agent/         # RAG implementation
│   │   ├── vision_agents/     # Image analysis
│   │   └── web_search/        # Web search functionality
│   └── requirements.txt
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── context/          # React context
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔐 Security & Safety

### Content Guardrails
- Input validation for medical appropriateness
- Content filtering for harmful requests
- Session-based conversation tracking
- Image validation and sanitization

### Best Practices
- Always verify medical information with healthcare professionals
- Use the assistant as a supplementary tool, not primary diagnosis
- Protect patient privacy and sensitive medical data
- Regular API key rotation recommended

## 🚨 Important Disclaimers

⚠️ **Medical Disclaimer**: This AI assistant is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

⚠️ **Data Privacy**: Do not upload images containing personal identifiable information (PII) or sensitive patient data without proper authorization.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test.py
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] Text-based medical queries
- [ ] Image upload and analysis
- [ ] Session persistence
- [ ] Error handling
- [ ] API response times
- [ ] Cross-browser compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Add tests for new features
- Update documentation as needed
- Ensure all agents work correctly in isolation and integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify `.env` file exists and contains valid keys
   - Check API key permissions and quotas

2. **Model Loading Issues**
   - Ensure internet connectivity for model downloads
   - Check Groq API service status

3. **Image Analysis Failures**
   - Verify image format and size limits
   - Check vision model availability

4. **Installation Problems**
   - Use Python 3.8+ and Node.js 16+
   - Clear npm/pip cache if needed

### Getting Help
- Open an issue on GitHub for bugs
- Check existing issues for solutions
- Review API documentation for endpoint details

## 🏆 Acknowledgments

- LangChain team for the excellent AI framework
- Groq for high-performance LLM inference
- Tavily for comprehensive web search capabilities
- HuggingFace for transformer models and embeddings
- React community for frontend development tools

## 📈 Future Roadmap

- [ ] Multi-language support
- [ ] Advanced medical specialization routing
- [ ] Integration with medical databases (PubMed, etc.)
- [ ] Real-time collaborative features
- [ ] Mobile application development
- [ ] Voice interaction capabilities
- [ ] Integration with EHR systems
- [ ] Advanced image annotation tools

---

**Built with ❤️ for advancing healthcare accessibility through AI**