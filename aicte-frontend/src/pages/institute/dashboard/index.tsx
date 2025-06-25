"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Users,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import applicationTypes from "@/data/applicationTypes.json";
import { PDFViewer } from "@/components/PdfViewer";
import { ApplicationSubmissionForm } from "@/components/ApplicationSubmissionForm";
import {
  SubmitUniversityApplication,
} from "@/schemas/applicationSchema";
import { v4 as uuid4 } from "uuid";
import { useInstituteData, useInstituteStore } from "@/hooks/useInstituteData";
import { useAuthStore } from "@/hooks/useAuth";
import { useApplicationUpload } from "@/hooks/useApplication";
import { Skeleton } from "@/components/ui/skeleton";
import Settings from "../settings";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const typedApplicationTypes: ApplicationType[] = applicationTypes;

const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background">
    <div className="ml-64 mr-80 p-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="w-80 bg-background h-screen fixed right-0 top-0 border-l">
      <div className="p-6">
        <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto mb-6" />
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-4 w-32 mb-2" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full mt-1" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

interface ApplicationType {
  id: string;
  name: string;
  documents: { id: string; name: string; pdfPath: string }[];
}

interface UniversityData {
  email: string;
  state: string;
  pincode: string;
  district: string;
  phone: string;
  instituteType: string;
  universityName: string;
}

interface RightSidebarProps {
  data: UniversityData;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ data }) => (
  <div className="w-80 bg-white h-screen sticky right-0 top-0 border-l border-gray-200">
    {/* FIXME just for logging out need to modify */}
    <Settings />
    <ScrollArea className="h-screen px-6 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="/placeholder-user.jpg" alt="University Avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold text-gray-800">
          {data.universityName}
        </h2>
        <p className="text-sm text-gray-600">{data.instituteType}</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-gray-700">{data.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-gray-700">{data.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-gray-700">{`${data.district}, ${data.state}`}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Completion</span>
                  <span className="text-blue-600 font-semibold">65%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%] rounded-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    Documents uploaded - 2 days ago
                  </p>
                  <p className="text-xs text-gray-600">
                    Application started - 5 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  </div>
);

interface MainContentProps {
  applicationTypes: ApplicationType[];
  selectedTypeId: string;
  setSelectedTypeId: (type: string) => void;
  instituteId: string;
  universityName: string;
}
const MainContent: React.FC<MainContentProps> = ({
  applicationTypes,
  selectedTypeId,
  setSelectedTypeId,
  instituteId,
  universityName,
}) => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false);
  const { mutateAsync: upload, isPending } = useApplicationUpload();
  const navigate = useNavigate();
  const onSubmit = async (formData: { name: string; description: string }) => {
    alert(formData.name);
    const data: SubmitUniversityApplication = {
      uni_application_id: `Application-${uuid4()}`,
      application_description: formData.description,
      application_name: formData.name,
      application_id: selectedTypeId,
      // UniversityDocuments: applicationTypes
      //   .find((x) => x.id === selectedTypeId)
      //   ?.documents.map((doc: any) => {
      //     return {
      //       uni_doc_id: `Application-${uuid4()}`,
      //       uni_doc_name: doc.name,
      //       doc_id: doc.id,
      //       errors: [],
      //       uni_doc_uri: doc.pdfPath,
      //       timestamp: new Date(),
      //       status: "NOT_SUBMITTED",
      //     };
      //   }) as SubmitApplicationDocument[],
    };
    await upload({
      application: data,
      institute_id: instituteId,
    });
    setIsSubmitDialogOpen(false);
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {universityName}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your applications
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: FileText,
            title: "Total Applications",
            value: "4",
            change: "+10% from last month",
            color: "text-blue-600",
          },
          {
            icon: Users,
            title: "In Review",
            value: "4",
            change: "+19% from last month",
            color: "text-green-600",
          },
          {
            icon: ChevronRight,
            title: "Approved",
            value: "0",
            change: "+4% from last month",
            color: "text-orange-600",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-lg"
          >
            <Card
              className="bg-white shadow-sm h-48"
              onClick={() => {
                navigate("/institute/applications");
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {item.title}
                </CardTitle>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${item.color}`}>
                  {item.value}
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mb-6 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-gray-800">
            <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
            Start New Application
          </CardTitle>
          <CardDescription className="text-gray-600">
            Select an application type to begin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Select
              onValueChange={setSelectedTypeId}
              defaultValue={selectedTypeId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select application type" />
              </SelectTrigger>
              <SelectContent>
                {applicationTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
              {applicationTypes
                .find((type) => type.id === selectedTypeId)
                ?.documents.map((doc: any, index) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-3 text-gray-700">
                      <FileText className="w-5 h-5 text-blue-600" />
                      {doc.name}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          View Format
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-gray-800">
                            {doc.name}
                          </DialogTitle>
                          <DialogDescription className="text-gray-600">
                            Please review the document format
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <PDFViewer pdfPath={doc.pdfPath} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
            </div>
          </div>
          <Dialog
            open={isSubmitDialogOpen}
            onOpenChange={setIsSubmitDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                Start Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-gray-800">
                  Submit Application
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Please provide the details for your new application.
                </DialogDescription>
              </DialogHeader>
              <ApplicationSubmissionForm
                onSubmit={onSubmit}
                loading={isPending}
              />
            </DialogContent>
          </Dialog>
          <div className="div">
            <Separator className = "my-4"/>
            <Button onClick={()=>{
              navigate("/institute/infrastructure")
            }}>
              Verify Infrastructure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const [selectedType, setSelectedType] = React.useState(
    applicationTypes[0].id
  );
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { pathname } = useLocation();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const { token } = useAuthStore();
  const { setInstituteId } = useInstituteStore();
  const { mutateAsync: getInstituteData } = useInstituteData();
  const [instituteData, setInstituteData] = React.useState<any>();
  const fetchInstituteData = async () => {
    const data = await getInstituteData(token as string);
    setInstituteData(data.data);
    setInstituteId(data.data.id);
  };

  React.useEffect(() => {
    fetchInstituteData();
  }, []);

  if (!instituteData) {
    return <DashboardSkeleton />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <MainContent
          applicationTypes={typedApplicationTypes}
          selectedTypeId={selectedType}
          setSelectedTypeId={setSelectedType}
          instituteId={instituteData?.id}
          universityName={instituteData.universityName}
        />
      </div>
    </div>
  );
}



