-- CreateEnum
CREATE TYPE "EvaluatorRole" AS ENUM ('FORGERY_CHECKER', 'LAYOUT_CHECKER', 'CONTENT_CHECKER');

-- CreateEnum
CREATE TYPE "Doer" AS ENUM ('EVALUATOR', 'UNIVERSITY');

-- CreateEnum
CREATE TYPE "LogObject" AS ENUM ('APPLICATION', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'P5');

-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('APP_CREATED', 'DOC_SUBMITTED', 'DOC_RESUBMITTED', 'PRIORITY_CHANGED', 'DOC_VIEWED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'PROCESSING', 'VERIFIED', 'ASSIGNED', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InstituteStatus" AS ENUM ('UNVERIFIED', 'PROCESSING', 'VERIFIED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "ContactDetails" (
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "altEmail" TEXT,
    "universityId" TEXT NOT NULL,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("phone")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "universityType" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "geolocation" TEXT,
    "pincode" INTEGER NOT NULL,
    "status" "InstituteStatus" NOT NULL DEFAULT 'UNVERIFIED',

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluator" (
    "evaluator_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "role" "EvaluatorRole" NOT NULL,
    "specialization" TEXT[],

    CONSTRAINT "Evaluator_pkey" PRIMARY KEY ("evaluator_id")
);

-- CreateTable
CREATE TABLE "UniversityApplication" (
    "uni_application_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "application_name" TEXT NOT NULL,
    "application_desc" TEXT NOT NULL,
    "messages" JSONB,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "universityId" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "evaluator_id" TEXT,

    CONSTRAINT "UniversityApplication_pkey" PRIMARY KEY ("uni_application_id")
);

-- CreateTable
CREATE TABLE "UniversityDocuments" (
    "uni_doc_id" TEXT NOT NULL,
    "uni_application_id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "errors" JSONB,
    "extractedTexts" JSONB,
    "uni_doc_uri" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messages" JSONB,
    "status" "DocumentStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "evaluator_id" TEXT,

    CONSTRAINT "UniversityDocuments_pkey" PRIMARY KEY ("uni_doc_id")
);

-- CreateTable
CREATE TABLE "EvaluatorDocumentRelation" (
    "id" TEXT NOT NULL,
    "evaluator_id" TEXT NOT NULL,
    "uni_doc_id" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "check_type" "EvaluatorRole" NOT NULL,

    CONSTRAINT "EvaluatorDocumentRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationTypes" (
    "application_id" TEXT NOT NULL,
    "application_name" TEXT NOT NULL,
    "application_description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',

    CONSTRAINT "ApplicationTypes_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "doc_id" TEXT NOT NULL,
    "doc_name" TEXT NOT NULL,
    "format_uri" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',

    CONSTRAINT "Document_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uni_application_id" TEXT,
    "uni_document_id" TEXT,
    "evaluator_id" TEXT,
    "actionPerformed" TEXT NOT NULL,
    "doer" "Doer" NOT NULL,
    "object" "LogObject" NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDocuments" (
    "application_id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_email_key" ON "ContactDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_universityId_key" ON "ContactDetails"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "University_email_key" ON "University"("email");

-- CreateIndex
CREATE UNIQUE INDEX "University_phone_key" ON "University"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluator_email_key" ON "Evaluator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluator_phone_key" ON "Evaluator"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationDocuments_application_id_doc_id_key" ON "ApplicationDocuments"("application_id", "doc_id");

-- AddForeignKey
ALTER TABLE "ContactDetails" ADD CONSTRAINT "ContactDetails_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "ApplicationTypes"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Evaluator"("evaluator_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDocuments" ADD CONSTRAINT "UniversityDocuments_uni_application_id_fkey" FOREIGN KEY ("uni_application_id") REFERENCES "UniversityApplication"("uni_application_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDocuments" ADD CONSTRAINT "UniversityDocuments_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "Document"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluatorDocumentRelation" ADD CONSTRAINT "EvaluatorDocumentRelation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Evaluator"("evaluator_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluatorDocumentRelation" ADD CONSTRAINT "EvaluatorDocumentRelation_uni_doc_id_fkey" FOREIGN KEY ("uni_doc_id") REFERENCES "UniversityDocuments"("uni_doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocuments" ADD CONSTRAINT "ApplicationDocuments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "ApplicationTypes"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocuments" ADD CONSTRAINT "ApplicationDocuments_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "Document"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
