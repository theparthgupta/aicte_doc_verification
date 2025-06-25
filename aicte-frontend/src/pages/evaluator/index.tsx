"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BarChart,
  FileText,
  User,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { SERVER_URL } from "@/constants/API";
import { api } from "@/lib/utils";
import { Legend } from "recharts";

export default function NOCApprovalDashboard() {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showRejectionConfirmationDialog, setShowRejectionConfirmationDialog] =
    useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [showFullImageDialog, setShowFullImageDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComments, setRejectionComments] = useState("");
  const [showUniversityDialog, setShowUniversityDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEvaluatorInfo, setShowEvaluatorInfo] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  useEffect(() => {
    const getReq = async () => {
      const resp = await api.get(`${SERVER_URL}/evaluator/data/data`);
      setDashboardData(resp.data.evaluator);
    };
    getReq();
  }, []);
  // Mock data - replace with actual data in a real application
  const approvalProgress = {
    approved: {
      count: 0,
    },
    rejected: {
      count: 0,
    },
    assigned: {
      count: 0,
    },
  };
  dashboardData?.assigned_document.forEach((doc) => {
    console.log("assignment", doc);
    if (doc.status == "ASSIGNED") approvalProgress.assigned.count++;
    if (doc.status == "REJECTED") approvalProgress.rejected.count++;
    if (doc.status == "APPROVED") approvalProgress.approved.count++;
  });
  const approved = dashboardData?.assigned_document.filter(
    (doc) => doc.status == "ASSIGNED"
  );
  console.log("assigned", approved);
  const user = {
    name: dashboardData?.email.split("@")[0] ?? "Vipul Sharma",
    position: dashboardData?.role ?? "NOC Approval Evaluator",
    email: dashboardData?.email ?? "vipul.sharma@example.com",
    userId: dashboardData?.evaluator_id ?? "VS1234",
    totalDocumentsApproved: 1287,
  };

  const currentDocument = {
    id: dashboardData?.assigned_document[0]?.uni_doc_id ?? "DOC5678",
    status: dashboardData?.assigned_document[0]?.status ?? "In Progress",
    university:
      dashboardData?.assigned_document[0]?.document.application.university
        .universityName ?? "Future Bright Academy",
    submissionDate:
      new Date(
        dashboardData?.assigned_document[0]?.document.timestamp
      ).toDateString() ?? "2024-11-26",
    type: "NOC Application",
    applicantName: "Vipul Mahajan",
    programName: "New Password/Forgotten Password",
    completeness: 85,
  };

  const previousDocuments = [
    {
      id: "DOC1234",
      universityId: "UNI001",
      universityName: "Sample University",
      approvalDate: "2023-05-10",
      approvalPercentage: 85,
      status: "Approved",
    },
    {
      id: "DOC5678",
      universityId: "UNI002",
      universityName: "Test University",
      approvalDate: "2023-05-08",
      approvalPercentage: 92,
      status: "Approved",
    },
    {
      id: "DOC9101",
      universityId: "UNI003",
      universityName: "Global University",
      approvalDate: "2023-05-05",
      approvalPercentage: 78,
      status: "Rejected",
    },
  ];

  const actionOnDoc = async (
    uni_doc_id,
    status,
    message,
    evaluator_id = dashboardData.assigned_document[0].evaluator_id
  ) => {
    console.log(status);
    const resp = await api.post(`${SERVER_URL}/evaluator/data/action_on_doc`, {
      uni_doc_id: uni_doc_id,
      status: status,
      messages: message,
    });
    if (resp.status === 200) {
      alert("Done");
    }
  };
  const [msg, setMsg] = useState<string>();

  const handleVerification = () => {
    setIsVerified(!isVerified);
  };

  const handleApprove = () => {
    setShowApprovalDialog(true);
  };

  const confirmApproval = async () => {
    setShowApprovalDialog(false);
    await actionOnDoc(
      dashboardData.assigned_document[0].document.uni_doc_id,
      "APPROVED",
      rejectionComments
    );
    setIsVerified(false);
  };

  const handleReject = async () => {
    setShowRejectionDialog(true);
  };

  const submitRejection = () => {
    setShowRejectionDialog(false);
    setShowRejectionConfirmationDialog(true);
  };

  const confirmRejection = async () => {
    setShowRejectionConfirmationDialog(false);
    await actionOnDoc(
      dashboardData.assigned_document[0].document.uni_doc_id,
      "REJECTED",
      rejectionComments
    );
    setRejectionReason("");
    setRejectionComments("");
    setIsVerified(false);
  };

  const handleAnalyze = (doc) => {
    setSelectedDocument(doc);
    setShowAnalysisDialog(true);
  };

  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setShowUniversityDialog(true);
  };

  const toggleEvaluatorInfo = () => {
    setShowEvaluatorInfo(!showEvaluatorInfo);
  };

  const AnalysisReport = ({ document }) => {
    const chartData = [
      {
        name: "Document Completeness",
        value: Math.round(document.approvalPercentage * 0.4),
      },
      {
        name: "Accuracy of Information",
        value: Math.round(document.approvalPercentage * 0.3),
      },
      {
        name: "Compliance with Guidelines",
        value: Math.round(document.approvalPercentage * 0.3),
      },
    ];
    if (!dashboardData) return <>Fetching Data...</>;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Document Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Document ID</TableCell>
                  <TableCell>{document.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">University</TableCell>
                  <TableCell>
                    {document.universityName} (ID: {document.universityId})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Check Type</TableCell>
                  <TableCell>Forgery Detection</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Approval Date</TableCell>
                  <TableCell>{document.approvalDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>{document.status}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure all required fields are filled completely</li>
            <li>Double-check the accuracy of key information</li>
            <li>Review the latest NOC guidelines for full compliance</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <User className="h-10 w-10 text-gray-500 mr-3" />
            <div>
              <h1
                className="text-2xl font-bold text-gray-900 cursor-pointer"
                onClick={toggleEvaluatorInfo}
              >
                {user.name}
              </h1>
              <p className="text-sm text-gray-600">{user.position}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">User ID: {user.userId}</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer"
              onClick={() => handleCardClick("Approved")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved Documents
                </CardTitle>
                <Check className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {approvalProgress.approved.count}
                </div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer"
              onClick={() => handleCardClick("Rejected")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rejected Documents
                </CardTitle>
                <X className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {approvalProgress.rejected.count}
                </div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer"
              onClick={() => handleCardClick("Assigned")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assigned Documents
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {approvalProgress.assigned.count}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Document Approval Status</CardTitle>
            </CardHeader>
            <CardContent>
              {currentDocument?.id == "DOC5678" ? (
                <div>No Assigned Documents</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Document ID
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {currentDocument.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1 text-lg font-semibold">
                      {currentDocument.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      University
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {currentDocument.university}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Submission Date
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {currentDocument.submissionDate}
                    </p>
                  </div>
                </div>
              )}
              <Button
                className="mt-4"
                onClick={() => setShowFullImageDialog(true)}
              >
                View Document
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Previously Approved Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document ID</TableHead>
                    <TableHead>University ID</TableHead>
                    <TableHead>University Name</TableHead>
                    <TableHead>Approval Date</TableHead>
                    <TableHead>Approval Percentage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analysis</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.id}</TableCell>
                      <TableCell>{doc.universityId}</TableCell>
                      <TableCell>{doc.universityName}</TableCell>
                      <TableCell>{doc.approvalDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">
                            {doc.approvalPercentage}%
                          </span>
                          <Progress
                            value={doc.approvalPercentage}
                            className="w-[60px]"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            doc.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAnalyze(doc)}
                        >
                          <BarChart className="h-4 w-4 mr-2" />
                          Analyze
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle>Document Details</DialogTitle>
                              <DialogDescription>
                                Review details for the selected document.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <img
                                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-03%20at%206.16.29%E2%80%AFPM-8aM0wEAduDSlkSrTXn6s5EfRXmbQpa.png"
                                  alt="Affidavit Document"
                                  className="w-full h-auto"
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-4">
                                  Document Information
                                </h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Field</TableHead>
                                      <TableHead>Value</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>Document Type</TableCell>
                                      <TableCell>AFFIDAVIT-1</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Purpose</TableCell>
                                      <TableCell>
                                        Creation of New Password/Forgotten
                                        Password
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Applicant Name</TableCell>
                                      <TableCell>Vipul Mahajan</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Institution</TableCell>
                                      <TableCell>
                                        Future Bright Academy
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>User ID</TableCell>
                                      <TableCell>FBA1234</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Payment Amount</TableCell>
                                      <TableCell>Rs. 6000/-</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Transaction ID</TableCell>
                                      <TableCell>TXN0987654321</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        Verification Officer
                                      </TableCell>
                                      <TableCell>
                                        Parth Gupta, AICTE Head Office
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Document Analysis</DialogTitle>
            <DialogDescription>
              Detailed analysis report for document {selectedDocument?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && <AnalysisReport document={selectedDocument} />}
          <DialogFooter>
            <Button onClick={() => setShowAnalysisDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document and any
              additional comments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <RadioGroup
                id="reason"
                value={rejectionReason}
                onValueChange={setRejectionReason}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incomplete" id="incomplete" />
                  <Label htmlFor="incomplete">Incomplete Documentation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inaccurate" id="inaccurate" />
                  <Label htmlFor="inaccurate">Inaccurate Information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="noncompliant" id="noncompliant" />
                  <Label htmlFor="noncompliant">
                    Non-compliant with Guidelines
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                value={rejectionComments}
                onChange={(e) => setRejectionComments(e.target.value)}
                placeholder="Provide any additional feedback or instructions for correction..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowRejectionDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={submitRejection}
              className="bg-red-500 hover:bg-red-600"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Rejection Confirmation Dialog */}
      <Dialog
        open={showRejectionConfirmationDialog}
        onOpenChange={setShowRejectionConfirmationDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Document Rejected</DialogTitle>
            <DialogDescription>
              The document has been rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-center">
              Document {selectedDocument?.id} has been rejected
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={confirmRejection}
              className="bg-red-500 hover:bg-red-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Document Approved</DialogTitle>
            <DialogDescription>
              The document has been successfully approved.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-lg font-semibold text-center">
              Document {selectedDocument?.id} has been approved
            </p>
          </div>
          <Input
            type="text"
            placeholder="Send a message to evaluator"
            value={rejectionComments}
            onChange={(e) => setRejectionComments(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={confirmApproval}
              className="bg-green-500 hover:bg-green-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showFullImageDialog} onOpenChange={setShowFullImageDialog}>
        <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Document View</DialogTitle>
            <DialogDescription>
              Full view of the document and key elements
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-03%20at%206.16.29%E2%80%AFPM-UEYOmZtNmaCfNVm6fUsGsVComAYWiL.png"
                alt="Full Document View"
                className="w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Elements</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Affidavit Type</TableCell>
                    <TableCell>AFFIDAVIT-1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Purpose</TableCell>
                    <TableCell>
                      Creation of New Password/Forgotten Password
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>For</TableCell>
                    <TableCell>Frogery Detection</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Applicant Name</TableCell>
                    <TableCell>Vipul Mahajan</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Institution</TableCell>
                    <TableCell>Future Bright Academy</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Application Date</TableCell>
                    <TableCell>26th November 2024</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>FBA1234</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Amount</TableCell>
                    <TableCell>Rs. 6000/-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>TXN0987654321</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="verified"
                checked={isVerified}
                onCheckedChange={handleVerification}
              />
              <Label htmlFor="verified">
                I have verified all the information in this document
              </Label>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleApprove}
                disabled={!isVerified}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={!isVerified}
                className="bg-red-500 hover:bg-red-600"
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* University Applications Dialog */}
      <Dialog
        open={showUniversityDialog}
        onOpenChange={setShowUniversityDialog}
      >
        <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedCategory} Applications</DialogTitle>
            <DialogDescription>
              List of universities and their requested applications for NOC from
              AICTE
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>University Name</TableHead>
                <TableHead>Application ID</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{`University ${index + 1}`}</TableCell>
                  <TableCell>{`APP${Math.floor(
                    1000 + Math.random() * 9000
                  )}`}</TableCell>
                  <TableCell>{`2024-${Math.floor(1 + Math.random() * 12)
                    .toString()
                    .padStart(2, "0")}-${Math.floor(1 + Math.random() * 28)
                    .toString()
                    .padStart(2, "0")}`}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedCategory === "Approved"
                          ? "bg-green-100 text-green-800"
                          : selectedCategory === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedCategory}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogFooter>
            <Button onClick={() => setShowUniversityDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Evaluator Info Dialog */}
      <Dialog open={showEvaluatorInfo} onOpenChange={setShowEvaluatorInfo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Evaluator Information</DialogTitle>
            <DialogDescription>Details about {user.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="teacherId" className="text-right">
                Teacher ID
              </Label>
              <p id="teacherId" className="col-span-2">
                {user.userId}
              </p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="documentsApproved" className="text-right">
                Total Documents Approved
              </Label>
              <p id="documentsApproved" className="col-span-2">
                {user.totalDocumentsApproved}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEvaluatorInfo(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
