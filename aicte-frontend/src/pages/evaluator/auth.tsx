"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Mail, Lock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Img from "@/assets/aicte-logo.webp";
import { api } from "@/lib/utils";
import { SERVER_URL } from "@/constants/API";
import { useAuthStore } from "@/hooks/useAuth";
export function EvaluatorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useNavigate();
  const { setToken, setMode } = useAuthStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Here you would typically make an API call to verify the credentials
    // For this example, we'll just simulate a successful login
    try {
      // Simulating an API call
      const token = await api.post(`${SERVER_URL}/evaluator/auth/login`, {
        authKey: email,
        password: password,
      });
      if (token.data) {
        console.log(token);
        setToken(token.data.token);
        setMode("evaluator");

        // If login is successful, redirect to the dashboard
        router("/evaluator/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 pr-8">
            <img src={Img} alt="AICTE Logo" className="mx-auto mb-8" />
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
              AICTE Evaluator Portal
            </h2>
            <p className="text-md text-gray-600 text-center mb-6">
              Access the evaluation system for AICTE accreditation
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                <span>Evaluate technical institutions across India</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                <span>Access comprehensive evaluation tools</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                <span>Contribute to maintaining education standards</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                AICTE Mission
              </h3>
              <p className="text-sm text-blue-700">
                To promote quality in technical education system and provide
                state-of-the-art infrastructure to technical institutions.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Evaluator Sign In
                </CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="evaluator@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {error}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Sign In
                  </Button>
                </CardFooter>
              </form>
              <div className="text-center mt-4 text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </Card>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Important Notice
              </h3>
              <p className="text-sm text-gray-700">
                Ensure you have your AICTE Evaluator ID ready. For any technical
                issues, please contact the AICTE support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
