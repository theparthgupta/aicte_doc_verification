"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Upload,
  AlertTriangle,
  FileText,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useFileUpload, useFileVerification } from "@/hooks/useFileUpload";
import { useLocation, useNavigate } from "react-router-dom";
import AicteLogo from "@/assets/aicte-logo.webp";
import VerificationPopup from "@/components/VerificationPopup";

const aicteTheme = {
  primary: "#1e40af", // AICTE blue
  secondary: "#f59e0b", // AICTE yellow
  accent: "#10b981", // A complementary green
  background: "#f3f4f6",
  text: "#1f2937",
};

export default function UploadLegalDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { doc, application_id } = useLocation().state;
  const {
    mutate: uploadFile,
    isPending,
    isSuccess,
    isError,
    error,
    data,
  } = useFileUpload();
  const {
    mutate: verifyFile,
    isPending: isVerifying,
    data: errorData,
  } = useFileVerification();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPdfUrl(URL.createObjectURL(selectedFile));
    }
  };
  const navigate = useNavigate();
  const handleUpload = () => {
    if (file) {
      
      uploadFile(file);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPdfUrl(null);
  };

  useEffect(() => {
    if (data?.downloadUrl) {
      verifyFile({
        uni_doc_uri: data?.downloadUrl as string,
        doc_id: doc.documentR.doc_id,
        formatId: doc.documentR.format_uri,
        uni_application_id: application_id,
      });
    }
  }, [data]);

  return (
    <div
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: aicteTheme.background }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img
            src={AicteLogo}
            alt="AICTE Logo"
            className="mx-auto w-24 h-24 mb-4"
          />
          <h1
            className="text-3xl font-bold"
            style={{ color: aicteTheme.primary }}
          >
            AICTE Document Upload Portal
          </h1>
        </div>
        <Card className="w-full shadow-lg">
          <CardHeader
            style={{ backgroundColor: aicteTheme.primary, color: "white" }}
          >
            <CardTitle className="text-2xl font-bold">
              Upload {doc.documentR.doc_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!file && (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                  style={{ borderColor: aicteTheme.primary }}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload
                      className="w-12 h-12 mb-3"
                      style={{ color: aicteTheme.primary }}
                    />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs" style={{ color: aicteTheme.text }}>
                      PDF (MAX. 10MB)
                    </p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
            {pdfUrl && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <FileText
                    className="mr-2"
                    style={{ color: aicteTheme.primary }}
                  />
                  <span className="font-semibold">{file?.name}</span>
                </div>
                <iframe
                  src={pdfUrl}
                  className="w-full h-[600px] border rounded"
                  title="PDF Preview"
                  style={{ borderColor: aicteTheme.primary }}
                />
              </div>
            )}
            {isSuccess && data && (
              <Alert
                className="mt-4"
                style={{ backgroundColor: aicteTheme.accent, color: "white" }}
              >
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your document has been successfully uploaded.
                  <a
                    href={data.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline ml-1 font-bold"
                  >
                    View uploaded file
                  </a>
                </AlertDescription>
              </Alert>
            )}
            {isError && (
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error?.message || "An error occurred during upload."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50">
            <div>
              {file && !isSuccess && (
                <Button
                  onClick={handleUpload}
                  disabled={isPending}
                  style={{ backgroundColor: aicteTheme.primary }}
                >
                  {isPending ? "Uploading..." : "Upload Document"}
                </Button>
              )}
              {(file || isSuccess) && (
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={handleCancel}
                  className="ml-2"
                >
                  Cancel
                </Button>
              )}
              {file && isVerifying && (
                <div className="flex justify-center items-center p-4 border border-gray-200 rounded bg-gray-100">
                <div className="animate-spin h-8 w-8 border-t-4 border-b-4 border-r-4 border-gray-400 rounded-full"></div>
                <span className="ml-2">Checking your file...</span>
              </div>
              )}
            </div>
          </CardFooter>
        </Card>
        <ForgeryGuidelines />
      </div>
    </div>
  );
}

function ForgeryGuidelines() {
  return (
    <Card className="md:w-full sm:w-1/3 shadow-lg">
      <CardHeader className="bg-black text-white">
        <CardTitle className="text-xl font-bold flex items-center">
          <AlertTriangle className="mr-2" />
          Guidelines Against Forgery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Ensure all documents are original and unaltered.</li>
          <li>
            Do not attempt to modify or falsify any information within the
            document.
          </li>
          <li>
            Verify that all signatures and seals are authentic and belong to the
            appropriate parties.
          </li>
          <li>
            Check that dates, names, and other critical information are accurate
            and consistent throughout the document.
          </li>
          <li>
            If you suspect a document may be forged or altered, report it
            immediately to the relevant authorities.
          </li>
          <li>
            Be aware that submitting forged documents is a serious criminal
            offense with severe legal consequences.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
