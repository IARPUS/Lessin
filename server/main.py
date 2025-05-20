from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

from sqlmodel import UniqueConstraint

class User(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("username"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password: str  # This will be hashed later

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


@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...)):
    with Session(engine) as session:
        existing_user = session.exec(
            select(User).where(User.username == username)
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        user = User(username=username, password=password)  # TODO: hash
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"id": user.id, "username": user.username}


@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.username == username)
        ).first()
        if not user or user.password != password:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"message": "Login successful", "user_id": user.id}
