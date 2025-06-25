from fastapi import APIRouter, HTTPException
import logging
from app.utils.pdf_compare_utils import check_with_groq, compare_layouts
from app.utils.index import PDFComparisonRequest, download_pdf

router = APIRouter()
logging.basicConfig(level=logging.INFO)

@router.post("/")
async def compare_pdfs(request: PDFComparisonRequest):
    try:
        template_path = await download_pdf(request.template_url)
        filled_path = await download_pdf(request.filled_url)
        layouts_similar, placeholder_values, layout_issues = compare_layouts(template_path, filled_path)
        placeholder_values = check_with_groq(placeholder_values)
        result = {"layouts_similar": layouts_similar, "placeholder_values": placeholder_values}
        if not layouts_similar:
            result["layout_issues"] = layout_issues
        return result
    except Exception as e:
        logging.error(f"Error processing PDFs: {e}")
        raise HTTPException(status_code=500, detail=str(e))
