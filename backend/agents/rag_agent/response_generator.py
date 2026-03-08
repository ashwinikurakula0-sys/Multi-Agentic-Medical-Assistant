import logging
from typing import List, Dict, Any, Optional
from agents.llm_loader import get_llm

class ResponseGenerator:
    """
    Generates responses based on retrieved context and user query.
    """
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.response_generator_model = get_llm()  # Load LLM from llm_loader
        self.include_sources = True

    def _build_prompt(
        self,
        query: str,
        context: str,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        table_instructions = """
        Some of the retrieved information is presented in table format. When using information from tables:
        1. Present tabular data using proper markdown table formatting with headers, like this:
            | Column1 | Column2 | Column3 |
            |---------|---------|---------|
            | Value1  | Value2  | Value3  |
        2. Re-format the table structure to make it easier to read and understand
        3. If any new component is introduced during re-formatting of the table, mention it explicitly
        4. Clearly interpret the tabular data in your response
        5. Reference the relevant table when presenting specific data points
        6. If appropriate, summarize trends or patterns shown in the tables
        7. If only reference numbers are mentioned and you can fetch the corresponding values like research paper title or authors from the context, replace the reference numbers with the actual values
        """

        response_format_instructions = """Instructions:
        1. Answer the query based ONLY on the information provided in the context.
        2. If the context doesn't contain relevant information to answer the query, state: "I don't have enough information to answer this question based on the provided context."
        3. Do not use prior knowledge not contained in the context.
        5. Be concise and accurate.
        6. Provide a well-structured response with heading, sub-headings and tabular structure if required in markdown format based on retrieved knowledge. Keep the headings and sub-headings small sized.
        7. Only provide sections that are meaningful to have in a chatbot reply. For example, do not explicitly mention references.
        8. If values are involved, make sure to respond with perfect values present in context. Do not make up values.
        9. Do not repeat the question in the answer or response."""

        history_text = "\n".join([f"User: {msg['user']}\nAssistant: {msg['assistant']}" for msg in chat_history]) if chat_history else ""

        prompt = f"""You are a medical assistant providing accurate information based on verified medical sources.

Here are the last few messages from our conversation:
{history_text}

The user has asked the following question:
{query}

I've retrieved the following information to help answer this question:
{context}

{table_instructions}
{response_format_instructions}

Based on the provided information, please answer the user's question thoroughly but concisely.
If the information doesn't contain the answer, acknowledge the limitations of the available information.
if the information doesn't contain the answer  ,then use the given Format:
{
    "Insufficient Information ","I don't have enough information."
}

Do not provide any source link that is not present in the context. Do not make up any source link.

Medical Assistant Response:"""

        return prompt

    def generate_response(
        self,
        query: str,
        retrieved_docs: List[Dict[str, Any]],
        picture_paths: Optional[List[str]] = None,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        try:
            doc_texts = [doc["content"] for doc in retrieved_docs]
            context = "\n\n===DOCUMENT SECTION===\n\n".join(doc_texts)
            prompt = self._build_prompt(query, context, chat_history)
            response = self.response_generator_model.invoke(prompt)

            sources = self._extract_sources(retrieved_docs) if self.include_sources else []
            confidence = self._calculate_confidence(retrieved_docs)

            response_text = response.content
            if self.include_sources:
                response_text += "\n\n##### Source documents:"
                for src in sources:
                    response_text += f"\n- [{src['title']}]({src['path']})"

            if picture_paths:
                response_text += "\n\n##### Reference images:"
                for path in picture_paths:
                    response_text += f"\n- [{path.split('/')[-1]}]({path})"

            return {
                "response": response_text,
                "sources": sources,
                "confidence": confidence
            }

        except Exception as e:
            self.logger.error(f"Error generating response: {e}")
            return {
                "response": "I apologize, but I encountered an error while generating a response. Please try rephrasing your question.",
                "sources": [],
                "confidence": 0.0
            }

    def _extract_sources(self, documents: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        sources = []
        seen = set()

        for doc in documents:
            title = doc.get("source")
            path = doc.get("source_path")
            if not title or not path:
                continue

            source_id = f"{title}|{path}"
            if source_id in seen:
                continue

            sources.append({
                "title": title,
                "path": path,
                "score": doc.get("combined_score", doc.get("rerank_score", doc.get("score", 0.0)))
            })
            seen.add(source_id)

        sources.sort(key=lambda x: x["score"], reverse=True)
        return [{"title": s["title"], "path": s["path"]} for s in sources]

    def _calculate_confidence(self, documents: List[Dict[str, Any]]) -> float:
        if not documents:
            return 0.0

        keys = ["combined_score", "rerank_score", "score"]
        for key in keys:
            if key in documents[0]:
                scores = [doc.get(key, 0) for doc in documents[:3]]
                return sum(scores) / len(scores)

        return 0.0
