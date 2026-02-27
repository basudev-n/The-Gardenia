from fastapi import FastAPI, APIRouter, Request
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
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.parse
import urllib.request

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

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

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

# ── Notifications ──

def send_whatsapp(phone, apikey, message):
    try:
        encoded = urllib.parse.quote(message)
        url = f"https://api.callmebot.com/whatsapp.php?phone={phone}&text={encoded}&apikey={apikey}"
        urllib.request.urlopen(url, timeout=10)
    except Exception as e:
        logger.error(f"WhatsApp failed: {e}")

def send_email(subject, html, sender_email, sender_password):
    try:
        recipient = "thegardenia15@gmail.com"
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = recipient
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())
    except Exception as e:
        logger.error(f"Email failed: {e}")

def notify_brochure_lead(lead: BrochureLead):
    email_user = os.environ.get('EMAIL_USER')
    email_pass = os.environ.get('EMAIL_PASS')
    wa_phone = os.environ.get('WHATSAPP_PHONE')
    wa_key = os.environ.get('CALLMEBOT_APIKEY')

    if email_user and email_pass:
        html = f"""<html><body style="font-family:Arial;color:#333">
        <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
        <div style="background:#059669;padding:24px"><h2 style="color:white;margin:0">New Brochure Lead</h2>
        <p style="color:#d1fae5;margin:4px 0 0">The Gardenia — Sales CRM</p></div>
        <div style="padding:24px"><table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px;font-weight:bold;color:#6b7280;width:140px">Name</td><td style="padding:10px">{lead.name}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;color:#6b7280">Phone</td><td style="padding:10px"><a href="tel:{lead.phone}" style="color:#059669">{lead.phone}</a></td></tr>
        <tr><td style="padding:10px;font-weight:bold;color:#6b7280">Preference</td><td style="padding:10px">{lead.preference or 'Not specified'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;color:#6b7280">Submitted At</td><td style="padding:10px">{lead.timestamp.strftime('%d %b %Y, %I:%M %p')} UTC</td></tr>
        </table></div></div></body></html>"""
        send_email(f"🏠 New Brochure Lead: {lead.name}", html, email_user, email_pass)

    if wa_phone and wa_key:
        msg = (f"🏠 *New Brochure Lead - The Gardenia*\n\n"
               f"👤 *Name:* {lead.name}\n📞 *Phone:* {lead.phone}\n"
               f"🏡 *Preference:* {lead.preference or 'Not specified'}\n"
               f"🕐 *Time:* {lead.timestamp.strftime('%d %b %Y, %I:%M %p')} UTC")
        send_whatsapp(wa_phone, wa_key, msg)

def notify_contact_lead(lead: ContactLead):
    email_user = os.environ.get('EMAIL_USER')
    email_pass = os.environ.get('EMAIL_PASS')
    wa_phone = os.environ.get('WHATSAPP_PHONE')
    wa_key = os.environ.get('CALLMEBOT_APIKEY')

    if email_user and email_pass:
        html = f"""<html><body style="font-family:Arial;color:#333">
        <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
        <div style="background:#059669;padding:24px"><h2 style="color:white;margin:0">New Site Visit Request</h2>
        <p style="color:#d1fae5;margin:4px 0 0">The Gardenia — Contact Form</p></div>
        <div style="padding:24px"><table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px;font-weight:bold;color:#6b7280;width:160px">Name</td><td style="padding:10px">{lead.name}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;color:#6b7280">Phone</td><td style="padding:10px"><a href="tel:{lead.phone}" style="color:#059669">{lead.phone}</a></td></tr>
        <tr><td style="padding:10px;font-weight:bold;color:#6b7280">Email</td><td style="padding:10px">{lead.email or 'Not provided'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;color:#6b7280">Preferred Contact</td><td style="padding:10px">{lead.preferredContact or 'Not specified'}</td></tr>
        <tr><td style="padding:10px;font-weight:bold;color:#6b7280">Visit Date</td><td style="padding:10px">{lead.preferredDate or 'Not specified'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;color:#6b7280">Visit Time</td><td style="padding:10px">{lead.preferredTime or 'Not specified'}</td></tr>
        <tr><td style="padding:10px;font-weight:bold;color:#6b7280">Message</td><td style="padding:10px">{lead.message or 'No message'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;color:#6b7280">Submitted At</td><td style="padding:10px">{lead.timestamp.strftime('%d %b %Y, %I:%M %p')} UTC</td></tr>
        </table></div></div></body></html>"""
        send_email(f"📋 New Site Visit Request: {lead.name}", html, email_user, email_pass)

    if wa_phone and wa_key:
        msg = (f"📋 *New Site Visit Request - The Gardenia*\n\n"
               f"👤 *Name:* {lead.name}\n📞 *Phone:* {lead.phone}\n"
               f"📧 *Email:* {lead.email or 'Not provided'}\n"
               f"📅 *Visit Date:* {lead.preferredDate or 'Not specified'}\n"
               f"🕐 *Visit Time:* {lead.preferredTime or 'Not specified'}\n"
               f"💬 *Message:* {lead.message or 'No message'}")
        send_whatsapp(wa_phone, wa_key, msg)

# ── Routes ──

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in checks:
        if isinstance(c['timestamp'], str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
    return checks

@api_router.post("/brochure-lead", response_model=BrochureLead)
async def submit_brochure_lead(input: BrochureLeadCreate):
    lead_obj = BrochureLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.brochure_leads.insert_one(doc)
    notify_brochure_lead(lead_obj)
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
    notify_contact_lead(lead_obj)
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