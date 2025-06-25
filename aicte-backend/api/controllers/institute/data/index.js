const { default: axios } = require("axios");
const { LogAction, Doer, LogObject } = require("../../../services/enums");
const { actionLogger, Log } = require("../../../services/logging");
const prisma = require("../../../utils/db");
const { object } = require("zod");

const availableApplication = async (req, res) => {
    try {

        const application = await prisma.applicationTypes.findMany({ include: { documents: true } });
        return res.json({ data: application });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ errors: "Internal Server Error." });
    }

}

const get_institute_data = async (req, res) => {
    const { institute_id } = req.authData;
    try {
        // const query = `
        //   SELECT institute_id, institute_data
        //   FROM institute WHERE id = $1; 
        // `;

        // const result = await db.query(query, [institute_id]);

        const result = await prisma.university.findUniqueOrThrow({ where: { id: institute_id } })
        res.status(200).json({
            success: true,
            data: result, // Returns an array of objects with institute_id and institute_data
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(401).json({
            success: false,
            message: "No institute found with given institue_id.",
        });
    }
}

const start_new_application = async (req, res) => {
    const { application } = req.body;
    const { institute_id } = req.authData;
    if (!institute_id || typeof application !== "object") {
        return res.status(400).json({
            success: false,
            message: "Invalid input: institute_id and a valid application object are required.",
        });
    }

    try {
        // Use UPSERT logic
        //         const query = `
        //       INSERT INTO applications (institute_id, application_data)
        // VALUES ($1, ARRAY[$2::jsonb])
        // ON CONFLICT (institute_id)
        // DO UPDATE SET application_data = array_append(applications.application_data, $2::jsonb)
        // RETURNING *;
        //     `;
        //         const values = [institute_id, application];

        //         const result = await db.query(query, values);

        const applicationRes = await prisma.universityApplication.create({
            data: {
                uni_application_id: application.uni_application_id, application_name: application.application_name, application_desc: application.application_description, application_id: application.application_id, universityId: institute_id
            }
        });
        actionLogger.log(new Log(new Date(), applicationRes.uni_application_id, undefined, undefined, LogAction.APP_CREATED, Doer.UNIVERSITY, LogObject.APPLICATION));
        res.status(200).json({
            id: applicationRes.uni_application_id,
            success: true,
            message: `Succesfully created ${applicationRes.uni_application_id}`,
            token: institute_id
        });
    } catch (error) {
        console.error("Error handling data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}

const get_applications = async (req, res) => {
    const { institute_id } = req.authData;
    console.log(institute_id)
    if (!institute_id) {
        return res.status(400).json({ error: "Institute ID is required" });
    }

    try {
        //     const query = `
        //     SELECT application_data
        //     FROM applications
        //     WHERE institute_id = $1;
        //   `;

        //     const result = await db.query(query, [institute_id]);
        const applications = await prisma.universityApplication.findMany({ orderBy: { createdOn: "desc" }, where: { universityId: institute_id }, include: { UniversityDocuments: true, application: { include: { documents: true } } } });
        applications.documents = applications.UniversityDocuments;
        delete applications.UniversityDocuments;
        if (!applications) {
            return res.status(404).json({ error: "No applications found for this institute" });
        }

        res.status(200).json({
            success: true,
            data: applications, // Send the JSON data to the frontend
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const get_application_document_by_id = async (req, res) => {
    const { application_id } = req.query;
    const { institute_id } = req.authData;
    console.log(institute_id, application_id)
    if (!institute_id || !application_id) {
        return res.status(400).json({ error: "Institute ID and Application ID are required" });
    }

    try {
        //     const query = `
        //     SELECT application
        //     FROM (
        //       SELECT unnest(application_data) AS application
        //       FROM applications
        //       WHERE institute_id = $1
        //     ) subquery
        //     WHERE application ->> 'application_id' = $2;
        //   `;

        //     const values = [institute_id, application_id];

        //     const result = await db.query(query, values);
        const documents = await prisma.universityApplication.findUnique({ where: { uni_application_id: application_id, universityId: institute_id }, include: { application: { include: { documents: { include: { documentR: true } } } }, UniversityDocuments: { include: { document: true, assigned_evaluator: true } } } });

        if (!documents) {
            return res.status(404).json({ error: "No application found with the given Application ID for the given instituteID." });
        }
        res.status(200).json({
            success: true,
            data: documents,
        });
    } catch (err) {
        console.error("Error fetching application data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getUniversityDocumentBy_doc_id = async (req, res) => {
    const { doc_id } = req.body;
    try {
        const documents = await prisma.universityDocuments.findMany({ where: { doc_id: doc_id }, include: { document: true } });
        return res.status(200).json({ data: documents });
    }
    catch (err) {
        console.log("getUniversityDOCBYdoc_id", err);
        res.status(500).json({ errors: err })
    }
}

const docUpload = async (uni_application_id, doc_id, uni_doc_uri, response) => {
    try {
        const document = await prisma.$transaction(async (prisma) => {
            await prisma.universityDocuments.updateMany({ where: { uni_application_id: uni_application_id, doc_id: doc_id }, data: { status: "REJECTED" } });

            return await prisma.universityDocuments.create({ data: { uni_application_id: uni_application_id, doc_id: doc_id, uni_doc_uri: uni_doc_uri, errors: response?.data.layout_issues, extractedTexts: response?.data?.placeholder_values, status: "SUBMITTED" }, include: { document: true, application: true, assigned_evaluator: true } });
        })
        await actionLogger.log(new Log(new Date(), uni_application_id, document.uni_doc_id, undefined, LogAction.DOC_SUBMITTED, Doer.UNIVERSITY, LogObject.DOCUMENT));
        return document;
    }
    catch (err) {
        console.error(err);
        actionLogger.error(`${uni_doc_uri} failed creating doc for application_id ${uni_application_id}`);
    }
}
const FASTAPIURL = "http://localhost:8000";
const document_analysis = async (req, res) => {
    const { uni_application_id, doc_id, uni_doc_uri } = req.body;
    let response;
    try {
        response = await axios.post(`${FASTAPIURL}/chat/comparison`, {
            template_url: req.body.formatId,
            filled_url: req.body.uni_doc_uri
        });
        const layoutIssues = response.data.layout_issues || [];
        layoutErrors = [];
        layoutIssues.forEach((issue, idx) => {
            layoutErrors.push({
                content: {
                    text: issue.description,
                },
                position: {
                    boundingRect: {
                        x1: issue.location?.[0] || 0,
                        y1: issue.location?.[1] || 0,
                        x2: issue.location?.[2] || 0,
                        y2: issue.location?.[3] || 0,
                        width: (issue.location?.[2] || 0) - (issue.location?.[0] || 0),
                        height: (issue.location?.[3] || 0) - (issue.location?.[1] || 0),
                        pageNumber: issue.page || 1,
                    },
                    rects: [],
                    pageNumber: issue.page || 1,
                },
                comment: issue.description,
                id: `error-${idx + 1}`,
            });
        });
        response.data.layout_issues = layoutErrors;
        // Sending the response back to the client with the data
        const document = await docUpload(uni_application_id, doc_id, uni_doc_uri, response);
        response.data["currentUniDoc"] = document;
        console.log(response.data);
        res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error in document_analysis:", error.message);
        // Responding with an appropriate error message and status code
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.detail || "An error occurred while processing the request.",
        });
    }
    finally {
        console.log("uploading");
    }
};


const validate_university_image = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }

    try {
        const response = await axios.post(`${FASTAPIURL}/detect_institute_image`, {
            url: url
        });

        if (response.status === 200 && response.data) {
            return res.status(200).json({ message: "Image validated successfully", data: response.data });
        } else {
            return res.status(500).json({ message: "Unexpected response from the image detection service" });
        }
    } catch (error) {
        console.error("Error validating image:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data.message || "An error occurred while processing the request",
            });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const validate_blueprint = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }

    try {
        const response = await axios.post(`${FASTAPIURL}/validate_blueprint`, { url });

        if (response.status === 200 && response.data) {
            return res.status(200).json({ message: "Image validated successfully", data: response.data });
        } else {
            return res.status(500).json({ message: "Unexpected response from the image detection service" });
        }
    } catch (error) {
        console.error("Error validating image:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data.message || "An error occurred while processing the request",
            });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { get_institute_data, start_new_application, get_applications, get_application_document_by_id, availableApplication, document_analysis, validate_university_image, validate_blueprint }