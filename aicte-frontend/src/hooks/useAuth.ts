import { queryClient } from "@/App";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/utils";import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

interface InstituteRegistrationData {
  institute_data: object;
  password: string;
}

const useInstituteRegistration = () => {
  const { toast } = useToast();
  const { setTokenMode } = useAuthStore();
  const nav = useNavigate();
  const mutation = useMutation({
    mutationKey: ["institute-register"],
    mutationFn: async (formData: InstituteRegistrationData) => {
      const res = await api.post(
        `/institute/auth/register`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["institute-register"] });
      setTokenMode(data.token, "institute");
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      queryClient.cancelQueries({ queryKey: ["institute-register"] });
      toast({
        description: error.message,
        onClick: () => {
          nav("/institute/login");
        },
      });

      console.error("Registration failed:", error);
    },
  });

  return mutation;
};

const useInstituteExists = () => {
  const mutation = useMutation({
    mutationKey: ["institute-check"],
    mutationFn: async (formData: { authKey: string }) => {
      const res = await api.post(
        `/institute/auth/institute_exists`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["institute-check"] });
    },
    onError: (error) => {
      queryClient.cancelQueries({ queryKey: ["institute-check"] });
    },
  });

  return mutation;
};

interface InstituteLoginData {
  authKey: string;
  password: string;
}

const useInstituteLogin = () => {
  const { toast } = useToast();
  const nav = useNavigate();
  const { setTokenMode } = useAuthStore();
  const mutation = useMutation({
    mutationKey: ["institute-login"],
    mutationFn: async (formData: InstituteLoginData) => {
      const res = await api.post(
        `/institute/auth/login`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["institute-login"] });

      // Show success toast
      if (data.success) {
        setTokenMode(data.token, "institute");
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials, please try again.",
        });
      }
      // Navigate to the dashboard
      // nav("/institute/dashboard");
    },
    onError: (error) => {
      queryClient.cancelQueries({ queryKey: ["institute-login"] });

      // Show error toast
      toast({
        title: "Login Failed",
        description: "Invalid credentials, please try again.",
      });

      console.error("Login failed:", error);
    },
  });

  return mutation;
};

const useInstituteForgotPassword = () => {
  const { toast } = useToast();
  const nav = useNavigate();

  const mutation = useMutation({
    mutationKey: ["institute-fp"],
    mutationFn: async (formData: InstituteLoginData) => {
      const res = await api.post(
        `/institute/auth/forgot`,
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["institute-fp"] });

      // Show success toast
      if (data.success) {
        toast({
          title: "Recover Successful",
          description: "Redirecting to login page...",
        });
        nav("/institute/login");
      } else {
        toast({
          title: "Recover Failed",
          description: "Invalid credentials, please try again.",
        });
      }
      // Navigate to the dashboard
      // nav("/institute/dashboard");
    },
    onError: (error) => {
      queryClient.cancelQueries({ queryKey: ["institute-fp"] });

      // Show error toast
      toast({
        title: "Recover Failed",
      });

      console.error("Login failed:", error);
    },
  });

  return mutation;
};

export {
  useInstituteRegistration,
  useInstituteExists,
  useInstituteLogin,
  useInstituteForgotPassword,
  useAuthStore
};

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserMode = "evaluator" | "institute";

interface AuthState {
  token: string | null; // Authentication token
  mode: UserMode | null; // User mode: "evaluator" or "institute"
  setToken: (token: string) => void; // Function to set the token
  setMode: (mode: UserMode) => void; // Function to set the mode
  setTokenMode: (token: string, mode: UserMode) => void; // Function to set the mode and token
  clearAuth: () => void; // Function to clear both token and mode
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      mode: null,
      setToken: (token: string) => set({ token }),
      setMode: (mode: UserMode) => set({ mode }),
      setTokenMode: (token: string, mode: UserMode) => set({ token, mode }),
      clearAuth: () => set({ token: null, mode: null }),
    }),
    {
      name: "auth-store", // Key to store in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage (default is localStorage, change to sessionStorage if needed)
    }
  )
);

