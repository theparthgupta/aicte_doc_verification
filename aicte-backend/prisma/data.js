const { EvaluatorSchema } = require("../api/controllers/evaluator/auth/auth.controller");
const prisma = require("../api/utils/db");
const argon2 = require("argon2");
const evaluatorRegisterForSeeder = async (data) => {
    const validResult = EvaluatorSchema.safeParse(data);
    if (!validResult.success) {
        return console.log("Not a valid Structure", validResult.error);
    }
    const hashedPassword = await argon2.hash(data.password);
    data.password = hashedPassword;
    console.log("seeder", data);
    try {
        const dbEvaluatorRes = await prisma.evaluator.create({ data: data });
    }
    catch (err) {
        console.log("evaluation Registration failed", err);
        process.exit(1);
    }
}

const applicationTypes = [
    {
        "application_id": "new_institute",
        "application_name": "New Institutions",
        "application_description": "This application type is for creating new institutions with necessary compliance and documentation.",
        "documents": [
            {
                "doc_id": "new_institute_0",
                "doc_name": "Affidavit 1: Application verification and compliance",
                "format_uri": "https://www.aicte-india.org/sites/default/files/AFFIDAVIT-1%20for%20creation%20of%20new%20password%20forgotten%20password.pdf"
            },
            {
                "doc_id": "new_institute_1",
                "doc_name": "Affidavit 2: Sworn statement of data accuracy",
                "format_uri": "https://www.aicte-india.org/sites/default/files/AFFIDAVIT-2%20for%20the%20applications%20submitted%20under%20chapter%201%202%204.pdf"
            },
            {
                "doc_id": "new_institute_2",
                "doc_name": "Land Ownership documents",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE%2014%20State%20Wise%20Competent.pdf"
            },
            {
                "doc_id": "new_institute_3",
                "doc_name": "Lease agreement (if applicable)",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-14%20State%20Wise%20Competent.pdf"
            },
            {
                "doc_id": "new_institute_4",
                "doc_name": "Land Use Certificate",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE%203%20Norms%20for%20Land%20and%20Built%20up%20Area%20Requirements%20of%20the.pdf"
            },
            {
                "doc_id": "new_institute_5",
                "doc_name": "Building Plan",
                "format_uri": "https://www.aicte-india.org/sites/default/files/CERTIFICATE-2.pdf"
            },
            {
                "doc_id": "new_institute_6",
                "doc_name": "Financial Proof",
                "format_uri": "https://www.aicte-india.org/sites/default/files/CERTIFICATE-3_0.pdf"
            },
            {
                "doc_id": "new_institute_7",
                "doc_name": "Digital Signature Certificate (DSC)",
                "format_uri": "https://www.aicte-india.org/sites/default/files/CERTIFICATE-3_0.pdf"
            },
            {
                "doc_id": "new_institute_8",
                "doc_name": "Society/Trust/Company Registration Certificate",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE%2017%20RECOMMENDED%20COMPOSITION%20OF%20BOARD.pdf"
            },
            {
                "doc_id": "new_institute_9",
                "doc_name": "Detailed Project Report (DPR)",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-9%20mba%20pgdm%20in%20iev.pdf"
            },
            {
                "doc_id": "new_institute_10",
                "doc_name": "Compliance Documents",
                "format_uri": "https://www.aicte-india.org/sites/default/files/AFFIDAVIT-5%20for%20the%20compliance%20of%20AICTE%20norms%20for%20universities%20chapter%204.pdf"
            },
            {
                "doc_id": "new_institute_11",
                "doc_name": "State NOC",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf"
            }
        ]
    },
    {
        "application_id": "eoa",
        "application_name": "Extension of Approval (EoA)",
        "application_description": "This application type is for seeking extension of approval for existing institutions.",
        "documents": [
            {
                "doc_id": "eoa_0",
                "doc_name": "Self-Disclosure Format",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf"
            },
            {
                "doc_id": "eoa_1",
                "doc_name": "Accreditation Proof",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-5%20norms%20for%20faculty%20requirements.pdf"
            },
            {
                "doc_id": "eoa_2",
                "doc_name": "Admission Reports",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-10%20undertaking%20to%20be%20submitted%20by%20the%20applicant%20institute.pdf"
            },
            {
                "doc_id": "eoa_3",
                "doc_name": "Financial Statements",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-5%20norms%20for%20faculty%20requirements.pdf"
            },
            {
                "doc_id": "eoa_4",
                "doc_name": "Infrastructure Readiness Report",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE%203%20Norms%20for%20Land%20and%20Built%20up%20Area%20Requirements%20of%20the.pdf"
            },
            {
                "doc_id": "eoa_5",
                "doc_name": "State/University Affiliation Letter",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-2.pdf"
            },
            {
                "doc_id": "eoa_6",
                "doc_name": "Fee Payment Proof",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-3.pdf"
            }
        ]
    },
    {
        "application_id": "collaboration",
        "application_name": "Collaboration & Twinning Programs",
        "application_description": "This application type is for establishing academic collaborations and twinning programs.",
        "documents": [
            {
                "doc_id": "collaboration_0",
                "doc_name": "Memorandum of Understanding (MoU)",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf"
            },
            {
                "doc_id": "collaboration_1",
                "doc_name": "Approval Letters",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-5%20norms%20for%20faculty%20requirements.pdf"
            },
            {
                "doc_id": "collaboration_2",
                "doc_name": "Course Curricula",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-10%20undertaking%20to%20be%20submitted%20by%20the%20applicant%20institute.pdf"
            },
            {
                "doc_id": "collaboration_3",
                "doc_name": "Governance and Management Structure",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-3%20Norms%20for%20Land%20and%20Built%20up%20Area%20Requirements%20of%20the.pdf"
            }
        ]
    },
    {
        "application_id": "odl_ol",
        "application_name": "Open and Distance Learning (ODL)/Online Learning (OL)",
        "application_description": "This application type is for institutions offering ODL and OL programs.",
        "documents": [
            {
                "doc_id": "odl_ol_0",
                "doc_name": "LMS Infrastructure Proof",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-2.pdf"
            },
            {
                "doc_id": "odl_ol_1",
                "doc_name": "Academic Records",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-5%20norms%20for%20faculty%20requirements.pdf"
            },
            {
                "doc_id": "odl_ol_2",
                "doc_name": "Content Accreditation",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-10%20undertaking%20to%20be%20submitted%20by%20the%20applicant%20institute.pdf"
            },
            {
                "doc_id": "odl_ol_3",
                "doc_name": "Student Support Details",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-3.pdf"
            }
        ]
    },
    {
        "application_id": "penal_actions",
        "application_name": "Penal Actions (For Norm Violations)",
        "application_description": "This application type is for addressing norm violations and compliance requirements.",
        "documents": [
            {
                "doc_id": "penal_actions_0",
                "doc_name": "Compliance Report",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-1.pdf"
            },
            {
                "doc_id": "penal_actions_1",
                "doc_name": "Supporting Evidence",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-5%20norms%20for%20faculty%20requirements.pdf"
            },
            {
                "doc_id": "penal_actions_2",
                "doc_name": "Show Cause Notice Response",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-10%20undertaking%20to%20be%20submitted%20by%20the%20applicant%20institute.pdf"
            }
        ]
    },
    {
        "application_id": "hibernation",
        "application_name": "Hibernation or Closure of Institutions",
        "application_description": "This application type is for the hibernation or closure of institutions.",
        "documents": [
            {
                "doc_id": "hibernation_0",
                "doc_name": "Affidavit",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-2.pdf"
            },
            {
                "doc_id": "hibernation_1",
                "doc_name": "Notification to Stakeholders",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-5%20norms%20for%20faculty%20requirements.pdf"
            },
            {
                "doc_id": "hibernation_2",
                "doc_name": "Student Transition Plan",
                "format_uri": "https://www.aicte-india.org/sites/default/files/ANNEXURE-10%20undertaking%20to%20be%20submitted%20by%20the%20applicant%20institute.pdf"
            },
            {
                "doc_id": "hibernation_3",
                "doc_name": "Financial Settlement Proof",
                "format_uri": "https://www.aicte-india.org/sites/default/files/FORMAT-3.pdf"
            }
        ]
    }
]

module.exports = { evaluatorRegisterForSeeder, applicationTypes }