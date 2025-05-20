from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

class Plan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    topics: str
    content: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/plans/generate")
async def generate_plan(topics: str = Form(...)):
    content = f"Plan steps for {topics}"
    with Session(engine) as session:
        plan = Plan(topics=topics, content=content)
        session.add(plan)
        session.commit()
        session.refresh(plan)
        return {"plan": plan}
