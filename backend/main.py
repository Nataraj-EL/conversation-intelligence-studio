import os
import json
from fastapi import FastAPI, HTTPException
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

# -------------------------------------------------------------
# Pydantic Schemas for Conversation Auditor (Sprint 2)
# -------------------------------------------------------------

class AnalysisRequest(BaseModel):
    transcript: str = Field(..., description="The conversation transcript text to analyze")

class AnalysisResult(BaseModel):
    summary: str = Field(..., description="A brief summary of the conversation")
    customer_intent: str = Field(..., description="The primary intent of the customer (e.g., refund, shipping issue)")
    customer_emotion: str = Field(..., description="The dominant emotion of the customer (e.g., frustrated, neutral, happy)")
    root_cause: str = Field(..., description="The root cause of why the AI agent failed or why friction was introduced")
    missed_opportunity: str = Field(..., description="What the agent missed or should have done differently")
    suggested_improvement: str = Field(..., description="The suggested prompt or instruction improvement to fix the AI agent's behavior")
    improved_conversation: str = Field(..., description="A full text transcript simulation of how the conversation would proceed if the suggested improvement was active")

# -------------------------------------------------------------
# Pydantic Schemas for Persona Simulator (Sprint 3)
# -------------------------------------------------------------

class SimulationRequest(BaseModel):
    transcript: str = Field(..., description="The original conversation transcript context")
    persona: str = Field(..., description="The customer persona to simulate (e.g. Busy Customer, Price Sensitive, Angry Customer, Enterprise Buyer)")

class SimulationResult(BaseModel):
    persona: str = Field(..., description="The name of the customer persona simulated")
    behavior_summary: str = Field(..., description="A summary of how the simulated persona reacted and behaved during the interaction")
    simulated_conversation: str = Field(..., description="A turn-by-turn text transcript simulating the interaction between the customer and the AI agent. Must be exactly 5 to 8 turns.")
    coaching_tip: str = Field(..., description="Actionable coaching tip for prompt engineers to optimize agent responses for this persona")

# -------------------------------------------------------------
# GenAI Client Initializer
# -------------------------------------------------------------

def get_genai_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not configured in the backend environment."
        )
    return genai.Client(api_key=api_key)

# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------

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
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResult,
                temperature=0.1,
            ),
        )
        
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

@app.post("/api/simulate-persona", response_model=SimulationResult)
async def simulate_persona_conversation(payload: SimulationRequest):
    if not payload.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript context cannot be empty.")
    if not payload.persona.strip():
        raise HTTPException(status_code=400, detail="Persona cannot be empty.")
    
    client = get_genai_client()
    
    prompt = f"""
    You are a realistic customer simulator. 
    Your task is to simulate a new interaction between the customer service AI agent (as described in the original conversation) and a customer matching the specified persona: "{payload.persona}".

    Generate a simulated conversation of exactly 5 to 8 turns (a turn is a single response from the human, followed by a response from the AI).
    Show how this specific persona behaves when interacting with the AI agent under similar circumstances.

    Original Conversation Context (for context, issues, and AI agent behavior):
    ---
    {payload.transcript}
    ---

    Generate the simulation and return a structured JSON response matching the schema:
    - 'persona': The exact simulated persona name ("{payload.persona}").
    - 'behavior_summary': A concise description of how this persona reacted and behaved during the interaction.
    - 'simulated_conversation': A turn-by-turn text transcript simulating the interaction (e.g. [Human ({payload.persona})]: ... [AI Agent]: ...). Keep it between 5 and 8 turns total.
    - 'coaching_tip': A concrete advice snippet for prompt engineers to optimize agent system prompts for this persona.
    """

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SimulationResult,
                temperature=0.7,  # slightly higher temperature for creative conversational simulation
            ),
        )
        
        if not response.text:
            raise HTTPException(status_code=502, detail="Received empty response from Gemini API.")
            
        result_dict = json.loads(response.text)
        return result_dict

    except json.JSONDecodeError as jde:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to parse Gemini simulation output as JSON: {str(jde)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to simulate conversation: {str(e)}"
        )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "api_key_configured": bool(os.getenv("GEMINI_API_KEY"))}
