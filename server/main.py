from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select, UniqueConstraint
from typing import Optional, List
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load env variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Set up DB engine
engine = create_engine(DATABASE_URL, echo=True)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Models
class User(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("username"),)
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str  # hashed
    preferences: Optional[List[str]] = Field(default=None, sa_column_kwargs={"type_": JSON})

class Plan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    topics: str
    content: str

# App setup
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

# Signup route
@app.post("/signup")
def signup(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...)
):
    with Session(engine) as session:
        existing_user = session.exec(
            select(User).where(User.username == username)
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

        hashed_pw = hash_password(password)
        user = User(username=username, email=email, password=hashed_pw)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"id": user.id, "username": user.username, "email": user.email}

# Login route
@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.username == username)
        ).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"message": "Login successful", "user_id": user.id}

# Survey route to store user preferences
@app.post("/survey")
def submit_survey(
    user_id: int = Form(...),
    preferences: str = Form(...)  # comma-separated values like "quizzes,videos"
):
    prefs_list = [p.strip() for p in preferences.split(",")]

    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.preferences = prefs_list
        session.add(user)
        session.commit()
        session.refresh(user)

        return {
            "message": "Preferences saved",
            "user": {
                "id": user.id,
                "username": user.username,
                "preferences": user.preferences
            }
        }

# Plan generation endpoint (placeholder)
@app.post("/plans/generate")
async def generate_plan(topics: str = Form(...)):
    content = f"Plan steps for {topics}"
    with Session(engine) as session:
        plan = Plan(topics=topics, content=content)
        session.add(plan)
        session.commit()
        session.refresh(plan)
        return {"plan": plan}
