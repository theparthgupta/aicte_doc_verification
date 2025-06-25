"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Mail,
  User,
  Building,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AicteLogo from "@/assets/aicte-logo.webp";
import { useOtp } from "@/hooks/useOTP";
import { useInstituteRegistration } from "@/hooks/useAuth";
const formSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must include lowercase, uppercase, number, and special character"
    ),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

export default function InstituteOtpForm() {
  const data = useLocation().state;
  const { mutateAsync: sendOtp, isPending } = useOtp();
  const { mutateAsync: registerUser, isPending: isRegistering } =
    useInstituteRegistration();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [expandedSection, setExpandedSection] = useState("basic");
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      otp: "",
    },
  });

  const handleSendOtp = async () => {
    const passwordValue = form.getValues("password");
    if (passwordValue && !form.formState.errors.password) {
      const res = await sendOtp({ email: data.universityDetails.email });
      if (res.success) {
        setServerOtp(res.otp);
        setShowOtpInput(true);
        toast({
          title: "OTP Sent",
          description: "An otp has been sent to registered University Email.",
        });
      }
      // Here you would typically send an OTP to the user's registered contact
    } else {
      toast({
        title: "Inavlid password",
        description: "Set a valid password.",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with:", values);
    if (serverOtp === values.otp) {
      const query = await registerUser({
        institute_data: data,
        password: values.password,
      });
      if (query.success) {
        toast({
          title: "Registration Success",
        });
        navigate("/institute/dashboard");
      }
    } else {
      toast({ title: "Enter the correct OTP" });
    }
    // Here you would verify the OTP and submit the form
  };

  const containerRef = useRef(null);

  const ExpandableSection = ({
    title,
    children,
    isExpanded,
    onToggle,
    icon,
  }: any) => {
    const contentRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: contentRef,
      offset: ["start end", "end end"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    return (
      <Card className="mb-4">
        <CardHeader className="cursor-pointer" onClick={onToggle}>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              {icon}
              {title}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CardTitle>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <motion.div ref={contentRef} style={{ opacity, scale }}>
              {children}
            </motion.div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8"
      >
        <header className="text-center mb-8">
          <img src={AicteLogo} alt="AICTE Logo" className="mx-auto h-24 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">
            AICTE Institute Registration
          </h1>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              Create a secure password for your AICTE account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="password" {...field} className="pl-10" />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Password must be 6-20 characters with at least one
                        lowercase letter, one uppercase letter, one number, and
                        one special character.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!showOtpInput ? (
                  <Button
                    disabled={isPending}
                    type="button"
                    onClick={handleSendOtp}
                  >
                    {!isPending ? (
                      "Send OTP"
                    ) : (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading
                      </>
                    )}
                  </Button>
                ) : (
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
                          <FormLabel>Enter OTP</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="text"
                                maxLength={6}
                                {...field}
                                className="pl-10"
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="mt-4"
                      disabled={!form.formState.isValid || isRegistering}
                    >
                      {!isRegistering ? (
                        "Submit"
                      ) : (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* <ExpandableSection
          title="Basic Details"
          isExpanded={expandedSection === "basic"}
          onToggle={() =>
            setExpandedSection(expandedSection === "basic" ? "" : "basic")
          }
          icon={<User className="h-5 w-5" />}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Application Number</Label>
              <p>{data.basicDetails.applicationNumber}</p>
            </div>
            <div>
              <Label>Application Open Date</Label>
              <p>
                {new Date(
                  data.basicDetails.applicationOpenDate
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label>Permanent Institute ID</Label>
              <p>{data.basicDetails.permanentInstituteId}</p>
            </div>
            <div>
              <Label>Academic Year</Label>
              <p>{data.basicDetails.academicYear}</p>
            </div>
            <div>
              <Label>Institute Status</Label>
              <p>{data.basicDetails.instituteStatus}</p>
            </div>
            <div>
              <Label>Overall Deficiency</Label>
              <p>{data.basicDetails.overallDeficiency}</p>
            </div>
            <div>
              <Label>Scrutiny Date</Label>
              <p>
                {new Date(data.basicDetails.scrutinyDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </ExpandableSection> */}

        <ExpandableSection
          title="Contact Details"
          isExpanded={expandedSection === "contact"}
          onToggle={() =>
            setExpandedSection(expandedSection === "contact" ? "" : "contact")
          }
          icon={<Mail className="h-5 w-5" />}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p>{`${data.contactDetails.title} ${data.contactDetails.firstName} ${data.contactDetails.lastName}`}</p>
            </div>
            <div>
              <Label>Designation</Label>
              <p>{data.contactDetails.designation}</p>
            </div>
            <div>
              <Label>Address</Label>
              <p>{data.contactDetails.address}</p>
            </div>
            <div>
              <Label>State</Label>
              <p>{data.contactDetails.state}</p>
            </div>
            <div>
              <Label>District</Label>
              <p>{data.contactDetails.district}</p>
            </div>
            <div>
              <Label>Town</Label>
              <p>{data.contactDetails.town}</p>
            </div>
            <div>
              <Label>Postal Code</Label>
              <p>{data.contactDetails.postalCode}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p>{data.contactDetails.phone}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p>{data.contactDetails.email}</p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection
          title="University Details"
          isExpanded={expandedSection === "university"}
          onToggle={() =>
            setExpandedSection(
              expandedSection === "university" ? "" : "university"
            )
          }
          icon={<Building className="h-5 w-5" />}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>University Name</Label>
              <p>{data.universityDetails.universityName}</p>
            </div>
            <div>
              <Label>Institute Type</Label>
              <p>{data.universityDetails.instituteType}</p>
            </div>
            <div>
              <Label>State</Label>
              <p>{data.universityDetails.state}</p>
            </div>
            <div>
              <Label>District</Label>
              <p>{data.universityDetails.district}</p>
            </div>
            <div>
              <Label>Pincode</Label>
              <p>{data.universityDetails.pincode}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p>{data.universityDetails.email}</p>
            </div>
            <div>
              <Label>Contact Number</Label>
              <p>{data.universityDetails.contactNumber}</p>
            </div>
          </div>
        </ExpandableSection>
      </motion.div>
    </div>
  );
}
