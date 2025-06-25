from fastapi import APIRouter
from app.services.chat import chat_pdf, chatbot, pdf_comparison

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

router.include_router(chat_pdf.router, prefix="/pdf")
router.include_router(chatbot.router, prefix="/bot")
router.include_router(pdf_comparison.router, prefix="/comparison")


