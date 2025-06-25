import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useInstituteExists, useInstituteLogin } from "@/hooks/useAuth";
import { useOtp } from "@/hooks/useOTP";
import { Loader2, Lock, Mail, Shield } from "lucide-react";
import { BackgroundLayout } from "@/components/BackgroundLayout";
import AicteImage from "@/assets/aicte-logo.webp";

const loginSchema = z.object({
  authKey: z.string().min(1, "Permanent Institute ID is required"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must include lowercase, uppercase, number, and special character"
    ),
});

export default function LoginPage() {
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutateAsync: checkInstitute, isPending: isChecking } =
    useInstituteExists();
  const [serverOtp, setServerOtp] = useState();
  const { mutateAsync: sendOtpMethod, isPending: isSending } = useOtp();
  const { mutateAsync: loginMethod, isPending: isLoggingIn } =
    useInstituteLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      authKey: "",
      otp: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (serverOtp !== values.otp) {
      toast({
        title: "OTP is not valid",
        variant: "destructive",
      });
      return;
    }
    try {
      await loginMethod({
        authKey: values.authKey,
        password: values.password,
      });
      toast({
        title: "Login successful",
        description: "Welcome to your AICTE institute account.",
      });
      navigate("/institute/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const sendOtp = async () => {
    const authKey = form.getValues("authKey");
    const exists = await checkInstitute({ authKey: authKey });
    if (!exists.success) {
      toast({ title: "Institute does not exist", variant: "destructive" });
      return;
    }
    const res = await sendOtpMethod({ email: authKey });
    if (res.success) {
      setServerOtp(res.otp);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to the registered University Email.",
      });
      setOtpSent(true);
    } else {
      toast({
        title: "OTP Not Sent",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <img
            src={AicteImage}
            alt="AICTE Logo"
            className="mx-auto mb-4 h-24 w-24"
          />
          <h1 className="text-3xl font-bold text-[#2c3e50]">
            AICTE Institute Login
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-[400px] shadow-lg">
            <CardHeader className="bg-[#f8f9fa]">
              <CardTitle className="text-[#2c3e50] flex items-center">
                <Lock className="mr-2 text-[#3498db]" />
                Login
              </CardTitle>
              <CardDescription className="text-[#2c3e50]">
                Access your AICTE institute account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="authKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#2c3e50]">
                          University Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              className="pl-10 border-[#3498db] focus:border-[#2ecc71]"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3498db]" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!otpSent && (
                    <Button
                      type="button"
                      onClick={sendOtp}
                      disabled={isChecking || isSending}
                      className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white"
                    >
                      {!isChecking && !isSending ? (
                        "Send OTP"
                      ) : (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP
                        </>
                      )}
                    </Button>
                  )}
                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              OTP
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  maxLength={6}
                                  className="pl-10 border-[#3498db] focus:border-[#2ecc71]"
                                />
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3498db]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="password"
                                  className="pl-10 border-[#3498db] focus:border-[#2ecc71]"
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3498db]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {otpSent && (
                    <Button
                      disabled={isLoggingIn}
                      type="submit"
                      className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white"
                    >
                      {!isLoggingIn ? (
                        "Login"
                      ) : (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2 bg-[#f8f9fa] p-4">
              <Link
                to="/institute/register"
                className="text-sm text-[#3498db] hover:underline"
              >
                Back to Registration
              </Link>
              <Link
                to="/institute/forgot"
                className="text-sm text-[#3498db] hover:underline"
              >
                Recover Password
              </Link>
              <p className="text-xs text-[#2c3e50]">
                For any login issues, please contact AICTE support
              </p>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center text-sm text-[#2c3e50]"
        >
          <p>All India Council for Technical Education</p>
          <p>Nelson Mandela Marg, Vasant Kunj, New Delhi-110070</p>
        </motion.div>
      </div>
    </BackgroundLayout>
  );
}
