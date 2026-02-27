from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ─── CORS must be added FIRST ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────

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


# ─────────────────────────────────────────────
# WhatsApp Notification (CallMeBot)
# ─────────────────────────────────────────────

def send_whatsapp_notification(lead: BrochureLead):
    try:
        whatsapp_phone = os.environ.get('WHATSAPP_PHONE')
        whatsapp_apikey = os.environ.get('CALLMEBOT_APIKEY')

        if not whatsapp_phone or not whatsapp_apikey:
            logger.warning("WhatsApp credentials not set. Skipping WhatsApp notification.")
            return

        message = (
            f"🏠 *New Brochure Lead - The Gardenia*\n\n"
            f"👤 *Name:* {lead.name}\n"
            f"📞 *Phone:* {lead.phone}\n"
            f"🏡 *Preference:* {lead.preference or 'Not specified'}\n"
            f"🕐 *Time:* {lead.timestamp.strftime('%d %b %Y, %I:%M %p')} UTC"
        )

        encoded_message = urllib.parse.quote(message)
        url = f"https://api.callmebot.com/whatsapp.php?phone={whatsapp_phone}&text={encoded_message}&apikey={whatsapp_apikey}"

        urllib.request.urlopen(url, timeout=10)
        logger.info(f"WhatsApp notification sent for lead: {lead.name}")

    except Exception as e:
        logger.error(f"Failed to send WhatsApp notification: {e}")


# ─────────────────────────────────────────────
# Email Notification
# ─────────────────────────────────────────────

def send_lead_email(lead: BrochureLead):
    try:
        sender_email = os.environ.get('EMAIL_USER')
        sender_password = os.environ.get('EMAIL_PASS')
        recipient = "thegardenia15@gmail.com"

        if not sender_email or not sender_password:
            logger.warning("Email credentials not set. Skipping email.")
            return

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🏠 New Brochure Lead: {lead.name}"
        msg["From"] = sender_email
        msg["To"] = recipient

        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
              <div style="background: #059669; padding: 24px;">
                <h2 style="color: white; margin: 0;">New Brochure Download Lead</h2>
                <p style="color: #d1fae5; margin: 4px 0 0;">The Gardenia — Sales CRM</p>
              </div>
              <div style="padding: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px; font-weight: bold; color: #6b7280; width: 140px;">Name</td>
                    <td style="padding: 10px; font-size: 16px;">{lead.name}</td>
                  </tr>
                  <tr style="background: #f9fafb;">
                    <td style="padding: 10px; font-weight: bold; color: #6b7280;">Phone</td>
                    <td style="padding: 10px; font-size: 16px;"><a href="tel:{lead.phone}" style="color: #059669;">{lead.phone}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; color: #6b7280;">Preference</td>
                    <td style="padding: 10px; font-size: 16px;">{lead.preference or 'Not specified'}</td>
                  </tr>
                  <tr style="background: #f9fafb;">
                    <td style="padding: 10px; font-weight: bold; color: #6b7280;">Submitted At</td>
                    <td style="padding: 10px;">{lead.timestamp.strftime('%d %b %Y, %I:%M %p')} UTC</td>
                  </tr>
                </table>
              </div>
              <div style="background: #f0fdf4; padding: 16px 24px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; color: #6b7280; font-size: 13px;">This lead was generated from the brochure download form on The Gardenia website.</p>
              </div>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())

        logger.info(f"Lead email sent for {lead.name}")

    except Exception as e:
        logger.error(f"Failed to send email: {e}")


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/brochure-lead", response_model=BrochureLead)
async def submit_brochure_lead(input: BrochureLeadCreate):
    lead_obj = BrochureLead(**input.model_dump())
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.brochure_leads.insert_one(doc)
    send_lead_email(lead_obj)
    send_whatsapp_notification(lead_obj)
    return lead_obj

@api_router.get("/brochure-leads", response_model=List[BrochureLead])
async def get_brochure_leads():
    leads = await db.brochure_leads.find({}, {"_id": 0}).to_list(1000)
    for lead in leads:
        if isinstance(lead['timestamp'], str):
            lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
    return leads


# ─────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────

app.include_router(api_router)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()