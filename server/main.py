from fastapi import FastAPI, Form, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, Session, select, UniqueConstraint
from typing import Optional, List
from enum import Enum
import os
import json
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import date, datetime

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

class StudySet(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    title: str
    description: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class StudyFile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    study_set_id: int
    file_name: str
    file_url: str
    uploaded_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class ChatThread(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    study_set_id: int = Field(unique=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class SenderEnum(str, Enum):
    user = "user"
    gpt = "gpt"

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    thread_id: int
    sender: SenderEnum  # ✅ now SQLModel can understand it
    content: str
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

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
        experience_ids = [e.id for e in experiences]
        bullet_points = session.exec(select(ExperienceBulletPoint).where(ExperienceBulletPoint.experience_id.in_(experience_ids))).all()
        return {
            "skills": skills,
            "resumes": resumes,
            "experiences": experiences,
            "experience_bullets": bullet_points,
        }

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
    bullets_json: Optional[str] = Form("[]")
):
    bullets = json.loads(bullets_json)
    with Session(engine) as session:
        experience = Experience(
            user_id=user_id, title=title, company=company, location=location,
            type=type, start_date=start_date, end_date=end_date
        )
        session.add(experience)
        session.commit()
        session.refresh(experience)
        for bullet in bullets:
            bp = ExperienceBulletPoint(experience_id=experience.id, bullet_text=bullet)
            session.add(bp)
        session.commit()
        return experience

@app.put("/experiences/{experience_id}/bullets")
def update_experience_bullets(experience_id: int = Path(...), bullets_json: str = Form(...)):
    bullets = json.loads(bullets_json)
    with Session(engine) as session:
        session.exec(select(ExperienceBulletPoint).where(ExperienceBulletPoint.experience_id == experience_id)).delete()
        for bullet in bullets:
            bp = ExperienceBulletPoint(experience_id=experience_id, bullet_text=bullet)
            session.add(bp)
        session.commit()
        return {"message": "Experience bullets updated"}

@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int):
    with Session(engine) as session:
        skill = session.get(Skill, skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        session.delete(skill)
        session.commit()
        return {"message": "Skill deleted"}

@app.post("/skills/batch")
def update_skills(user_id: int = Form(...), skills_json: str = Form(...)):
    new_skills = json.loads(skills_json)
    with Session(engine) as session:
        existing_skills = session.exec(select(Skill).where(Skill.user_id == user_id)).all()
        existing_names = {s.skill_name for s in existing_skills}
        new_names = set(new_skills)
        for skill in existing_skills:
            if skill.skill_name not in new_names:
                session.delete(skill)
        for name in new_names:
            if name not in existing_names:
                session.add(Skill(user_id=user_id, skill_name=name))
        session.commit()
    return {"message": "Skills updated"}

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

@app.put("/experiences/{experience_id}")
def update_experience(
    experience_id: int = Path(...),
    title: str = Form(...),
    company: str = Form(...),
    location: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    start_date: Optional[date] = Form(None),
    end_date: Optional[date] = Form(None),
):
    with Session(engine) as session:
        experience = session.get(Experience, experience_id)
        if not experience:
            raise HTTPException(status_code=404, detail="Experience not found")
        experience.title = title
        experience.company = company
        experience.location = location
        experience.type = type
        experience.start_date = start_date
        experience.end_date = end_date
        session.add(experience)
        session.commit()
        session.refresh(experience)
        return experience

# StudySet CRUD
@app.post("/studysets")
def create_study_set(user_id: int = Form(...), title: str = Form(...), description: Optional[str] = Form(None)):
    with Session(engine) as session:
        study_set = StudySet(user_id=user_id, title=title, description=description)
        session.add(study_set)
        session.commit()
        session.refresh(study_set)
        return study_set

@app.get("/studysets/{user_id}")
def get_study_sets(user_id: int):
    with Session(engine) as session:
        sets = session.exec(select(StudySet).where(StudySet.user_id == user_id)).all()
        return sets

@app.put("/studysets/{set_id}")
def update_study_set(set_id: int, title: str = Form(...), description: Optional[str] = Form(None)):
    with Session(engine) as session:
        s = session.get(StudySet, set_id)
        if not s:
            raise HTTPException(status_code=404, detail="StudySet not found")
        s.title = title
        s.description = description
        session.commit()
        return s

@app.delete("/studysets/{set_id}")
def delete_study_set(set_id: int):
    with Session(engine) as session:
        s = session.get(StudySet, set_id)
        if not s:
            raise HTTPException(status_code=404, detail="StudySet not found")
        session.delete(s)
        session.commit()
        return {"message": "StudySet deleted"}

# StudyFile CRUD
@app.post("/studyfiles")
def upload_study_file(study_set_id: int = Form(...), file_name: str = Form(...), file_url: str = Form(...)):
    with Session(engine) as session:
        file = StudyFile(study_set_id=study_set_id, file_name=file_name, file_url=file_url)
        session.add(file)
        session.commit()
        session.refresh(file)
        return file

@app.get("/studyfiles/{study_set_id}")
def get_study_files(study_set_id: int):
    with Session(engine) as session:
        files = session.exec(select(StudyFile).where(StudyFile.study_set_id == study_set_id)).all()
        return files

@app.delete("/studyfiles/{file_id}")
def delete_study_file(file_id: int):
    with Session(engine) as session:
        f = session.get(StudyFile, file_id)
        if not f:
            raise HTTPException(status_code=404, detail="File not found")
        session.delete(f)
        session.commit()
        return {"message": "File deleted"}

# ChatThread and ChatMessage
@app.get("/chats/thread/{study_set_id}")
def get_or_create_thread(study_set_id: int):
    with Session(engine) as session:
        thread = session.exec(select(ChatThread).where(ChatThread.study_set_id == study_set_id)).first()
        if thread:
            return thread
        new_thread = ChatThread(study_set_id=study_set_id)
        session.add(new_thread)
        session.commit()
        session.refresh(new_thread)
        return new_thread

@app.get("/chats/messages/{thread_id}")
def get_chat_messages(thread_id: int):
    with Session(engine) as session:
        messages = session.exec(select(ChatMessage).where(ChatMessage.thread_id == thread_id)).all()
        return messages

@app.post("/chats/messages")
def add_chat_message(thread_id: int = Form(...), sender: str = Form(...), content: str = Form(...)):
    if sender not in ("user", "gpt"):
        raise HTTPException(status_code=400, detail="Sender must be 'user' or 'gpt'")
    with Session(engine) as session:
        message = ChatMessage(thread_id=thread_id, sender=sender, content=content)
        session.add(message)
        session.commit()
        session.refresh(message)
        return message
