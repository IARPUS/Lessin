from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# allow your React app to talk to FastAPI
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.post("/plans/generate")
async def generate_plan(topics: str = Form(...)):
    # TODO: call Gemini here
    ai_plan = {"topics": topics, "steps": ["Step 1", "Step 2", "..."]}
    return {"plan": ai_plan}
