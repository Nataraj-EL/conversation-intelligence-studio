import os
import json
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Conversation Intelligence Studio API", version="0.1.0")

# Enable CORS for frontend flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo / local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Payload Validation
class AnalysisRequest(BaseModel):
    transcript: str = Field(..., description="The conversation transcript text to analyze")

# Response Structured Output Validation (Strict MVP fields)
class AnalysisResult(BaseModel):
    summary: str = Field(..., description="A brief summary of the conversation")
    customer_intent: str = Field(..., description="The primary intent of the customer (e.g., refund, shipping issue)")
    customer_emotion: str = Field(..., description="The dominant emotion of the customer (e.g., frustrated, neutral, happy)")
    root_cause: str = Field(..., description="The root cause of why the AI agent failed or why friction was introduced")
    missed_opportunity: str = Field(..., description="What the agent missed or should have done differently")
    suggested_improvement: str = Field(..., description="The suggested prompt or instruction improvement to fix the AI agent's behavior")
    improved_conversation: str = Field(..., description="A full text transcript simulation of how the conversation would proceed if the suggested improvement was active")

# Initialize GenAI Client (reads GEMINI_API_KEY from environment)
def get_genai_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured in the backend environment."
        )
    return genai.Client(api_key=api_key)

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_conversation(payload: AnalysisRequest):
    if not payload.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript content cannot be empty.")
    
    client = get_genai_client()
    
    prompt = f"""
    You are an expert AI agent conversation auditor and prompt engineer.
    Your task is to analyze the following human-to-AI customer service transcript.
    Isolate where the AI agent failed, repeated itself, got stuck in loops, or ignored customer requests to escalate to a human.
    Evaluate the customer's intent, customer's emotion, the root cause of the failure, what the agent missed, and suggest a prompt improvement for the AI.
    Finally, simulate how the improved conversation transcript would proceed if the prompt correction was applied.

    Examine this transcript and return a structured JSON response:
    ---
    {payload.transcript}
    ---
    """

    try:
        # Call Gemini using the structured schema generation
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResult,
                temperature=0.1,  # Lower temperature for more stable analytical output
            ),
        )
        
        # Parse the structured JSON response
        if not response.text:
            raise HTTPException(status_code=502, detail="Received empty response from Gemini API.")
            
        result_dict = json.loads(response.text)
        return result_dict

    except json.JSONDecodeError as jde:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to parse Gemini output as JSON: {str(jde)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze conversation with Gemini: {str(e)}"
        )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "api_key_configured": bool(os.getenv("GEMINI_API_KEY"))}
