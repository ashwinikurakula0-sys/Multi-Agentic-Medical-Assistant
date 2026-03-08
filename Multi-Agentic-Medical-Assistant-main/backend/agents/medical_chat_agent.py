
# from langchain.schema.messages import SystemMessage, HumanMessage, AIMessage

# # Initialize the LLM (choose from: llama2, mistral, tinyllama, etc.)

# import os
# from dotenv import load_dotenv
# from agents.llm_loader import get_llm
# load_dotenv()


# llm=get_llm()




# def get_medical_response(query: str) -> AIMessage:
#     """
#     Generates a medical response using the LLaMA model via ChatOllama.
    
#     Args:
#         query: User's input query
    
#     Returns:
#         AIMessage with the model's response
#     """
#     messages = [
#         SystemMessage(content="You are a helpful, ethical medical assistant. Only provide general medical information, not diagnoses or treatment plans."),
#         HumanMessage(content=query)
#     ]
    
#     try:
#         result = llm.invoke(messages)
#         return AIMessage(content=result.content)
    
#     except Exception as e:
#         print(f"[Medical Agent Error] {e}")
#         return AIMessage(content="⚠️ Sorry, I encountered an issue generating a response.")

# agents/medical_chat_agent.py

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from agents.llm_loader import get_llm
import os

llm = get_llm()

# Load system prompt from external file



def get_medical_response(messages: list) -> AIMessage:
    """
    Generates a medical response using the LLM and message history.
    
    Args:
        messages: A list of LangChain BaseMessages including HumanMessage(s) and prior AIMessage(s)
    
    Returns:
        AIMessage with the model's response
    """
   
    full_messages = [SystemMessage(content=(
    "You are a helpful, ethical medical assistant. Only provide general medical information, "
    "not specific diagnoses or treatment plans."
))] + messages
    # system_message = SystemMessage(
    #     content=(
    #         "You are a professional, ethical medical assistant. "
    #         "Provide general health information in structured markdown format with clear sections. "
    #         "Use bold titles (e.g., **Possible Causes**, **Self-Care Tips**, **When to See a Doctor**) and numbered or bullet-pointed lists. "
    #         "Do NOT provide medical diagnoses or prescribe treatments. "
    #         "Respond concisely and clearly for a web-based chat UI."
    #     )
    # )
    # full_messages = [system_message] + messages

    try:
        result = llm.invoke(full_messages)
        return AIMessage(content=result.content)

    except Exception as e:
        print(f"[Medical Agent Error] {e}")
        return AIMessage(content="⚠️ Sorry, I encountered an issue generating a response.")
