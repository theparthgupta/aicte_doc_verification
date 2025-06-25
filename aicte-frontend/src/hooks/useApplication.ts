import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils";import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SubmitUniversityApplication, UniversityApplication} from "@/schemas/applicationSchema";
import { useInstituteStore } from "./useInstituteData";
// Assuming you have an auth store, if not, you can remove this import and related code

// Update this to match your server URL

interface ApplicationUploadResponse {
  id: string;
  status: "success" | "error";
  message: string;
  token?: string;
}

export const useApplicationUpload = (): UseMutationResult<
  ApplicationUploadResponse,
  Error,
  { application: SubmitUniversityApplication; institute_id: string }
> => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["application-upload"],
    mutationFn: async (formData: {
  application: SubmitUniversityApplication;
      institute_id: string;
    }) => {
      const res = await api.post<ApplicationUploadResponse>(
        `/institute/data/new_application`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["application-upload"] });

      toast({
        title: "Application Submitted",
        description:
          data.message || "Your application has been successfully submitted.",
      });

      // Navigate to a success page or dashboard
      navigate(`/institute/applications/${data.id}`)
      console.log("Application upload successful:", data);
    },
    onError: (error: Error) => {
      queryClient.cancelQueries({ queryKey: ["application-upload"] });

      toast({
        title: "Error",
        description:
          error.message ||
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });
};

interface ApplicationGetResponse {
  applications: UniversityApplication[];
  data: UniversityApplication[];
  status: "success" | "error";
  message: string;
}

export const useApplicationGet = (): UseMutationResult<
  ApplicationGetResponse,
  Error,
  string,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["get-applications"],
    mutationFn: async (instituteId: string) => {
      const res = await api.get<ApplicationGetResponse>(
        `/institute/data/get_applications?id=${instituteId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["applications"], data.applications);

      
      console.log("Applications fetched successfully:", data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message ||
          "There was an error fetching your applications. Please try again.",
        variant: "destructive",
      });

      console.error("Error fetching applications:", error);
    },
  });
};

export const useDocumentGet = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {instituteId} = useInstituteStore()
  return useMutation({
    mutationKey: ["get-documents"],
    mutationFn: async (id: string) => {
      const res = await api.get(
        `/institute/data/get_documents?application_id=${id}&institute_id=${instituteId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["documents"], data.applications);

      
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message ||
          "There was an error fetching your documents. Please try again.",
        variant: "destructive",
      });

      console.error("Error fetching applications:", error);
    },
  });
};
