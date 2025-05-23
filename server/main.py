from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select, UniqueConstraint
from typing import Optional, List
import os
import json
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import date

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# DB engine
engine = create_engine(DATABASE_URL, echo=True)

# Password hashing setup
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
    preferences: Optional[str] = None  # JSON string

class Plan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    topics: str
    content: str

class Resume(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    file_name: str
    file_url: str
    uploaded_at: Optional[str] = Field(default=None)

class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    skill_name: str

class Experience(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    title: str
    company: str
    location: Optional[str] = None
    type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ExperienceBulletPoint(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    experience_id: int
    bullet_text: str

# App setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Auth routes
@app.post("/signup")
def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    with Session(engine) as session:
        existing_user = session.exec(select(User).where(User.username == username)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        user = User(username=username, email=email, password=hash_password(password))
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"id": user.id, "username": user.username, "email": user.email}

@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"message": "Login successful", "user_id": user.id}

@app.post("/survey")
def submit_survey(user_id: int = Form(...), preferences: str = Form(...)):
    try:
        json.loads(preferences)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in preferences")
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.preferences = preferences
        session.add(user)
        session.commit()
        return {"message": "Preferences saved", "user": {"id": user.id, "username": user.username, "preferences": json.loads(user.preferences)}}

@app.post("/plans/generate")
async def generate_plan(topics: str = Form(...)):
    content = f"Plan steps for {topics}"
    with Session(engine) as session:
        plan = Plan(topics=topics, content=content)
        session.add(plan)
        session.commit()
        session.refresh(plan)
        return {"plan": plan}

# CRUD routes
@app.get("/profile/{user_id}")
def get_user_profile(user_id: int):
    with Session(engine) as session:
        skills = session.exec(select(Skill).where(Skill.user_id == user_id)).all()
        resumes = session.exec(select(Resume).where(Resume.user_id == user_id)).all()
        experiences = session.exec(select(Experience).where(Experience.user_id == user_id)).all()
        return {"skills": skills, "resumes": resumes, "experiences": experiences}

@app.post("/skills")
def add_skill(user_id: int = Form(...), skill_name: str = Form(...)):
    with Session(engine) as session:
        skill = Skill(user_id=user_id, skill_name=skill_name)
        session.add(skill)
        session.commit()
        session.refresh(skill)
        return skill

@app.post("/resumes")
def add_resume(user_id: int = Form(...), file_name: str = Form(...), file_url: str = Form(...)):
    with Session(engine) as session:
        resume = Resume(user_id=user_id, file_name=file_name, file_url=file_url)
        session.add(resume)
        session.commit()
        session.refresh(resume)
        return resume

@app.post("/experiences")
def add_experience(
    user_id: int = Form(...),
    title: str = Form(...),
    company: str = Form(...),
    location: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    start_date: Optional[date] = Form(None),
    end_date: Optional[date] = Form(None),
):
    with Session(engine) as session:
        experience = Experience(
            user_id=user_id, title=title, company=company, location=location,
            type=type, start_date=start_date, end_date=end_date
        )
        session.add(experience)
        session.commit()
        session.refresh(experience)
        return experience

@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int):
    with Session(engine) as session:
        skill = session.get(Skill, skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        session.delete(skill)
        session.commit()
        return {"message": "Skill deleted"}

@app.delete("/resumes/{resume_id}")
def delete_resume(resume_id: int):
    with Session(engine) as session:
        resume = session.get(Resume, resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        session.delete(resume)
        session.commit()
        return {"message": "Resume deleted"}

@app.delete("/experiences/{experience_id}")
def delete_experience(experience_id: int):
    with Session(engine) as session:
        experience = session.get(Experience, experience_id)
        if not experience:
            raise HTTPException(status_code=404, detail="Experience not found")
        session.delete(experience)
        session.commit()
        return {"message": "Experience deleted"}
