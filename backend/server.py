from fastapi import FastAPI, APIRouter, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class CORSExtraMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            response = JSONResponse(content={}, status_code=200)
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            return response
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(CORSExtraMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ── Models ──

class BrochureLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    preference: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BrochureLeadCreate(BaseModel):
    name: str
    phone: str
    preference: Optional[str] = None

class ContactLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    message: Optional[str] = None
    preferredDate: Optional[str] = None
    preferredTime: Optional[str] = None
    preferredContact: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactLeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: Optional[str] = None
    preferredDate: Optional[str] = None
    preferredTime: Optional[str] = None
    preferredContact: Optional[str] = None

# ── Routes ──

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/brochure-lead", response_model=BrochureLead)
async def submit_brochure_lead(input: BrochureLeadCreate):
    lead_obj = BrochureLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.brochure_leads.insert_one(doc)
    logger.info(f"Brochure lead saved: {lead_obj.name}")
    return lead_obj

@api_router.get("/brochure-leads", response_model=List[BrochureLead])
async def get_brochure_leads():
    leads = await db.brochure_leads.find({}, {"_id": 0}).to_list(1000)
    for l in leads:
        if isinstance(l['timestamp'], str):
            l['timestamp'] = datetime.fromisoformat(l['timestamp'])
    return leads

@api_router.post("/contact-lead", response_model=ContactLead)
async def submit_contact_lead(input: ContactLeadCreate):
    lead_obj = ContactLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.contact_leads.insert_one(doc)
    logger.info(f"Contact lead saved: {lead_obj.name}")
    return lead_obj

@api_router.get("/contact-leads", response_model=List[ContactLead])
async def get_contact_leads():
    leads = await db.contact_leads.find({}, {"_id": 0}).to_list(1000)
    for l in leads:
        if isinstance(l['timestamp'], str):
            l['timestamp'] = datetime.fromisoformat(l['timestamp'])
    return leads

# ── App setup ──
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
