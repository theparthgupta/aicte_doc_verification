import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Building,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Fingerprint, GraduationCap } from "lucide-react";
import AicteLogo from "@/assets/aicte-logo.webp";

const contactDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be 10 digits"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  postalCode: z.string().length(6, "Postal code must be 6 digits"),
});

const universityDetailsSchema = z.object({
  universityName: z.string().min(1, "University name is required"),
  instituteType: z.string().min(1, "Institute type is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact number must be 10 digits"),
});

const formSchema = z.object({
  contactDetails: contactDetailsSchema,
  universityDetails: universityDetailsSchema,
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    name: "Contact Details",
    description: "Primary contact information for the institute",
  },
  {
    id: 2,
    name: "University Details",
    description: "Detailed information about the institution",
  },
];

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const instituteTypes = [
  "Affiliated College",
  "Autonomous College",
  "Central University",
  "Constituent College",
  "Deemed University",
  "Institute of National Importance",
  "Private University",
  "Standalone Institution",
  "State University",
];

export default function InstituteRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const navigate = useNavigate();

  const contactDetailsForm = useForm<z.infer<typeof contactDetailsSchema>>({
    resolver: zodResolver(contactDetailsSchema),
  });

  const universityDetailsForm = useForm<
    z.infer<typeof universityDetailsSchema>
  >({
    resolver: zodResolver(universityDetailsSchema),
  });

  const onContactDetailsSubmit = (
    data: z.infer<typeof contactDetailsSchema>
  ) => {
    setFormData((prev) => ({ ...prev, contactDetails: data }));
    setCurrentStep(2);
  };

  const onUniversityDetailsSubmit = async (
    data: z.infer<typeof universityDetailsSchema>
  ) => {
    const finalFormData = {
      ...formData,
      universityDetails: data,
    };
    console.log("Final Form Data:", finalFormData);
    navigate("/institute/otp", { state: finalFormData });
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 fixed h-full">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={AicteLogo} alt="AICTE Logo" className="h-10 w-10" />
              <h2 className="text-xl font-semibold text-[#2c3e50]">
                Institute
              </h2>
            </div>

            <div className="space-y-8 mt-12">
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  className={cn(
                    "relative flex items-start group cursor-pointer",
                    currentStep >= step.id ? "text-[#3498db]" : "text-gray-500"
                  )}
                  whileHover={{ x: 4 }}
                  onClick={() =>
                    currentStep >= step.id && setCurrentStep(step.id)
                  }
                >
                  <div className="flex items-center h-9">
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5 text-[#3498db]" />
                    ) : currentStep === step.id ? (
                      <Circle className="w-5 h-5 text-[#3498db] fill-[#e8f4fc]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id
                          ? "text-[#3498db]"
                          : "text-[#2c3e50]"
                      )}
                    >
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {currentStep === step.id && (
                    <motion.div
                      className="absolute -left-6 top-2 w-1 h-5 bg-[#3498db] rounded-r-full"
                      layoutId="activeStep"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <Link
              to="/institute/login"
              className="text-sm text-[#3498db] hover:text-[#2980b9] flex items-center group"
            >
              <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Already registered? Login here
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80">
          <div className="max-w-3xl mx-auto py-12 px-8">
            <AnimatePresence mode="wait">
              {/* {currentStep === 1 && (
                <motion.div
                  key="basic-details"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-3xl font-bold text-[#2c3e50]">Basic Details</h1>
                    <p className="mt-2 text-[#7f8c8d]">Please store these details and are required later for login.</p>
                  </div>

                  <Form {...basicDetailsForm}>
                    <form onSubmit={basicDetailsForm.handleSubmit(onBasicDetailsSubmit)} className="space-y-6">
                      <FormField
                        control={basicDetailsForm.control}
                        name="applicationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">Application Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  disabled
                                  className="pl-10 bg-[#f8f9fa] border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicDetailsForm.control}
                        name="applicationOpenDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">Application Open Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  value={field.value.toLocaleDateString()}
                                  disabled
                                  className="pl-10 bg-[#f8f9fa] border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicDetailsForm.control}
                        name="permanentInstituteId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">Permanent Institute ID</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  disabled
                                  className="pl-10 bg-[#f8f9fa] border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={basicDetailsForm.control}
                        name="academicYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">Academic Year</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  disabled
                                  className="pl-10 bg-[#f8f9fa] border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pt-6">
                        <Button
                          type="submit"
                          className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white py-2 px-4 rounded-lg flex items-center justify-center group"
                        >
                          Continue to Contact Details
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )} */}

              {currentStep === 1 && (
                <motion.div
                  key="contact-details"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-3xl font-bold text-[#2c3e50]">
                      Contact Details
                    </h1>
                    <p className="mt-2 text-[#7f8c8d]">
                      Please provide the contact information for your institute
                    </p>
                  </div>

                  <Form {...contactDetailsForm}>
                    <form
                      onSubmit={contactDetailsForm.handleSubmit(
                        onContactDetailsSubmit
                      )}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={contactDetailsForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2c3e50]">
                                Title
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white border-[#e0e0e0] focus:ring-[#3498db]">
                                    <SelectValue placeholder="Select title" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Dr">Dr.</SelectItem>
                                  <SelectItem value="Mr">Mr.</SelectItem>
                                  <SelectItem value="Mrs">Mrs.</SelectItem>
                                  <SelectItem value="Ms">Ms.</SelectItem>
                                  <SelectItem value="Prof">Prof.</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactDetailsForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2c3e50]">
                                First Name
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                  />
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={contactDetailsForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactDetailsForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Email
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="email"
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactDetailsForm.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Designation
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactDetailsForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Phone
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactDetailsForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={contactDetailsForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2c3e50]">
                                State
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white border-[#e0e0e0] focus:ring-[#3498db]">
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactDetailsForm.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2c3e50]">
                                District
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={contactDetailsForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Postal Code
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="bg-white hover:bg-gray-50 text-[#2c3e50] border-[#e0e0e0]"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#3498db] hover:bg-[#2980b9] text-white py-2 px-4 rounded-lg flex items-center justify-center group"
                        >
                          Continue to University Details
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="university-details"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-3xl font-bold text-[#2c3e50]">
                      University Details
                    </h1>
                    <p className="mt-2 text-[#7f8c8d]">
                      Please provide detailed information about your institution
                    </p>
                  </div>

                  <Form {...universityDetailsForm}>
                    <form
                      onSubmit={universityDetailsForm.handleSubmit(
                        onUniversityDetailsSubmit
                      )}
                      className="space-y-6"
                    >
                      <FormField
                        control={universityDetailsForm.control}
                        name="universityName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              University Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={universityDetailsForm.control}
                        name="instituteType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Institute Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white border-[#e0e0e0] focus:ring-[#3498db]">
                                  <SelectValue placeholder="Select institute type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {instituteTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={universityDetailsForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2c3e50]">
                                State
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white border-[#e0e0e0] focus:ring-[#3498db]">
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={universityDetailsForm.control}
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#2c3e50]">
                                District
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={universityDetailsForm.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Pincode
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={universityDetailsForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Email
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="email"
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={universityDetailsForm.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#2c3e50]">
                              Contact Number
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  className="pl-10 bg-white border-[#e0e0e0] focus-visible:ring-[#3498db]"
                                />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d]" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="bg-white hover:bg-gray-50 text-[#2c3e50] border-[#e0e0e0]"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#3498db] hover:bg-[#2980b9] text-white py-2 px-4 rounded-lg flex items-center justify-center group"
                        >
                          Submit Registration
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these imports at the top of the file

// Add this CSS to your global styles or component-specific styles
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;
