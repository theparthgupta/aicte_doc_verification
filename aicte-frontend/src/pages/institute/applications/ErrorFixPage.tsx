import ErrorChatbot from "@/components/PdfErrorFix/ErrorChatbot";
import PdfEditor from "@/components/PdfErrorFix/PdfEditor/PdfEditor";
import {
  ErrorHighlight,
  ErrorViewer,
} from "@/components/PdfErrorFix/PdfHighlightComponent";
import ErrorDisplay from "@/components/PdfErrorFix/PlaceholderErrorComponent";
import PreviousUploads from "@/components/PdfErrorFix/PreviousUploads";
import { ApplicationDocument } from "@/schemas/applicationSchema";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";
const errors = {
  Name: {
    value:
      "Approval Process Handbook 2024-2027\n201\nFORMAT-1 \nNo Objection Certificate from the State Government/ UT\nThe<Name of the Trust/Society/Company>vide its Executive meeting held on at vide item no",
    analysis: {
      is_valid: true,
      confidence: 0.8,
      issues: [
        "The text appears to be a mixture of document information and Trust/Society/Company name",
      ],
      suggestions: [
        "Consider separating the company name and document information into different fields",
      ],
      bbox: [12, 3],
    },
  },
  X1: {
    value:
      "Approval Process Handbook 2024-2027\n201\nFORMAT-1 \nNo Objection Certificate from the State Government/ UT\nThe<Name of the Trust/Society/Company>vide its Executive meeting held on at vide item no",
    analysis: {
      is_valid: true,
      confidence: 0.8,
      issues: [
        "The text appears to be a mixture of document information and Trust/Society/Company name",
      ],
      suggestions: [
        "Consider separating the company name and document information into different fields",
      ],
      bbox: [12, 3],
    },
  },
  X2: {
    value:
      "Approval Process Handbook 2024-2027\n201\nFORMAT-1 \nNo Objection Certificate from the State Government/ UT\nThe<Name of the Trust/Society/Company>vide its Executive meeting held on at vide item no",
    analysis: {
      is_valid: true,
      confidence: 0.8,
      issues: [
        "The text appears to be a mixture of document information and Trust/Society/Company name",
      ],
      suggestions: [
        "Consider separating the company name and document in formation into different fields",
      ],
      bbox: [12, 3],
    },
  },
  // ... other error objects
};

const errorHighlights = [
  {
    content: {
      text: "Missing signature",
    },
    position: {
      boundingRect: {
        x1: 100,
        y1: 200,
        x2: 300,
        y2: 250,
        width: 200,
        height: 50,
        pageNumber: 1,
      },
      rects: [{ x1: 100, y1: 200, x2: 300, y2: 250 }],
      pageNumber: 1,
    },
    comment: "Please provide a signature in this section.",
    id: "highlight-1",
  },
  {
    content: {
      text: "Invalid date format",
    },
    position: {
      boundingRect: {
        x1: 50,
        y1: 150,
        x2: 250,
        y2: 175,
        width: 200,
        height: 25,
        pageNumber: 2,
      },
      rects: [{ x1: 50, y1: 150, x2: 250, y2: 175 }],
      pageNumber: 2,
    },
    comment: "The date format should be DD/MM/YYYY.",
    id: "highlight-2",
  },
  {
    content: {
      text: "Missing notary seal",
    },
    position: {
      boundingRect: {
        x1: 200,
        y1: 100,
        x2: 350,
        y2: 150,
        width: 150,
        height: 50,
        pageNumber: 3,
      },
      rects: [{ x1: 200, y1: 100, x2: 350, y2: 150 }],
      pageNumber: 3,
    },
    comment: "A notary seal is required for this affidavit.",
    id: "highlight-3",
  },
  {
    content: {
      text: "Incorrect spelling",
    },
    position: {
      boundingRect: {
        x1: 120,
        y1: 300,
        x2: 220,
        y2: 320,
        width: 100,
        height: 20,
        pageNumber: 4,
      },
      rects: [{ x1: 120, y1: 300, x2: 220, y2: 320 }],
      pageNumber: 4,
    },
    comment: "Spelling of 'organization' is incorrect.",
    id: "highlight-4",
  },
];

export default function ErrorFixPage() {
  const [editorError, setEditorError] = useState<string | null>(null);
  const {
    currentUniDoc,
    application_id,
  }: {
    currentUniDoc: ApplicationDocument[];
    application_id: string;
  } = useLocation().state;
  console.log("currentUniDoc", currentUniDoc);
  console.log("currentApp", application_id);
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">
        Document Error Analysis Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ErrorViewer
            url={
              currentUniDoc[0].uni_doc_uri ??
              "https://lalhrowagdujluyyztsd.supabase.co/storage/v1/object/public/sih/1733390964242_sample.pdf_0.vd9x3ovmhz"
            }
            errors={
              (currentUniDoc[0].errors as ErrorHighlight[]) ?? errorHighlights
            }
          />
        </div>
        <div className="">
          <ErrorDisplay errors={currentUniDoc[0].extractedTexts ?? errors} />
          <ErrorChatbot
            pdfUrl={
              currentUniDoc[0].uni_doc_uri ??
              "https://lalhrowagdujluyyztsd.supabase.co/storage/v1/object/public/sih/1733390964242_sample.pdf_0.vd9x3ovmhz"
            }
          />
        </div>
      </div>
      <PdfEditor
        currentUniDoc={currentUniDoc}
        format_uri={currentUniDoc[0].document.format_uri}
        doc_id={currentUniDoc[0].doc_id}
        uni_application_id={application_id}
        url={
          currentUniDoc[0].uni_doc_uri ??
          "https://lalhrowagdujluyyztsd.supabase.co/storage/v1/object/public/sih/1733390964242_sample.pdf_0.vd9x3ovmhz"
        }
        onError={setEditorError}
      />
    </div>
  );
}
