import * as z from 'zod'

export const basicDetailsSchema = z.object({
  applicationNumber: z.string().min(1, "Application number is required"),
  applicationOpenDate: z.date({
    required_error: "Application open date is required",
  }),
  permanentInstituteId: z.string().min(1, "Permanent Institute ID is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  instituteStatus: z.string().default("Not Submitted"),
  overallDeficiency: z.enum(["Y", "N"]),
  scrutinyDate: z.date({
    required_error: "Scrutiny committee date is required",
  }),
})

export const contactDetailsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  designation: z.string().min(1, "Designation is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  town: z.string().min(1, "Town/City/Village is required"),
  postalCode: z.string().length(6, "Postal code must be 6 digits"),
  stdCode: z.string().min(1, "STD code is required"),
  landline: z.string().min(1, "Landline number is required"),
  phone: z.string().min(10, "Phone number must be 10 digits"),
  altPhone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  altEmail: z.string().email("Invalid alternative email address").optional(),
})

export const universityDetailsSchema = z.object({
  universityName: z.string().min(1, "University name is required"),
  instituteType: z.string().min(1, "Institute type is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact number must be 10 digits"),
})

export const formSchema = z.object({
  contactDetails: contactDetailsSchema,
  universityDetails: universityDetailsSchema,
})

export type FormData = z.infer<typeof formSchema>