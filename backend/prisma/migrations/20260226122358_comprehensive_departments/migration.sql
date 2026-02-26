/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `ElectricityPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ElectricityComplaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ElectricityPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ElectricityTransferRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ElectricityAccount" ADD COLUMN     "connectionType" TEXT NOT NULL DEFAULT 'DOMESTIC',
ADD COLUMN     "meterNumber" TEXT,
ADD COLUMN     "sanctionedLoad" DOUBLE PRECISION NOT NULL DEFAULT 2.0;

-- AlterTable
ALTER TABLE "ElectricityBill" ADD COLUMN     "billingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lateFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paidDate" TIMESTAMP(3),
ADD COLUMN     "tariffSlab" TEXT;

-- AlterTable
ALTER TABLE "ElectricityComplaint" ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ElectricityPayment" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'RAZORPAY',
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT,
ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "billId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INITIATED';

-- AlterTable
ALTER TABLE "ElectricityTransferRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "documentSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "newAddress" TEXT,
ADD COLUMN     "officeVisitRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'REQUESTED';

-- CreateTable
CREATE TABLE "WaterAccount" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "consumerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "meterNumber" TEXT,
    "connectionType" TEXT NOT NULL DEFAULT 'DOMESTIC',
    "category" TEXT NOT NULL DEFAULT 'RESIDENTIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterBill" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "billingMonth" TEXT NOT NULL,
    "billingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meterReading" INTEGER,
    "unitsConsumed" INTEGER NOT NULL,
    "waterCharge" DOUBLE PRECISION NOT NULL,
    "sewerageCharge" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "lateFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaterBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterPayment" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "billId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "status" TEXT NOT NULL DEFAULT 'INITIATED',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterComplaint" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "complaintType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "complaintId" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "assignedTo" TEXT,
    "estimatedResolution" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterTransferRequest" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "newAddress" TEXT,
    "documentSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterTransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GasAccount" (
    "id" TEXT NOT NULL,
    "consumerNumber" TEXT NOT NULL,
    "lpgId" TEXT NOT NULL,
    "consumerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "distributorName" TEXT NOT NULL,
    "distributorCode" TEXT NOT NULL,
    "subsidyStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GasAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GasBooking" (
    "id" TEXT NOT NULL,
    "consumerNumber" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" TIMESTAMP(3),
    "cylinderType" TEXT NOT NULL DEFAULT '14.2KG',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" DOUBLE PRECISION NOT NULL,
    "subsidyAmount" DOUBLE PRECISION,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BOOKED',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GasComplaint" (
    "id" TEXT NOT NULL,
    "consumerNumber" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "complaintType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "bookingId" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GasTransferRequest" (
    "id" TEXT NOT NULL,
    "consumerNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "newDistributorCode" TEXT NOT NULL,
    "newDistributorName" TEXT,
    "documentSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasTransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAccount" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wardNumber" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL DEFAULT 'RESIDENTIAL',
    "builtUpArea" DOUBLE PRECISION NOT NULL,
    "annualValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTaxBill" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "rebateAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "penaltyAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyTaxBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CivicComplaint" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "complaintId" TEXT NOT NULL,
    "complaintType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CivicComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateRequest" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "certificateType" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleAccount" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "vehicleClass" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "chassisNumber" TEXT NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "fitnessValidUpto" TIMESTAMP(3),
    "insuranceValidUpto" TIMESTAMP(3),
    "pucValidUpto" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challan" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "challanNumber" TEXT NOT NULL,
    "violationDate" TIMESTAMP(3) NOT NULL,
    "violationType" TEXT NOT NULL,
    "violationLocation" TEXT NOT NULL,
    "fineAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "paidDate" TIMESTAMP(3),
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RtoApplication" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "applicationNumber" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "applicationType" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RtoApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RationCardAccount" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardType" TEXT NOT NULL DEFAULT 'PHH',
    "headOfFamily" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "fpsCode" TEXT NOT NULL,
    "fpsName" TEXT NOT NULL,
    "totalMembers" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RationCardAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RationEntitlement" (
    "id" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "riceKg" DOUBLE PRECISION NOT NULL,
    "wheatKg" DOUBLE PRECISION NOT NULL,
    "sugarKg" DOUBLE PRECISION NOT NULL,
    "keroseneL" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUpto" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RationEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RationTransaction" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "riceTaken" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wheatTaken" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sugarTaken" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "keroseneTaken" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "fpsCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RationTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RationGrievance" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "grievanceId" TEXT NOT NULL,
    "grievanceType" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RationGrievance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "phoneNumber" TEXT,
    "action" TEXT NOT NULL,
    "department" TEXT,
    "serviceKey" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedUntil" TIMESTAMP(3),

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaterAccount_accountNumber_key" ON "WaterAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WaterBill_accountNumber_billingMonth_key" ON "WaterBill"("accountNumber", "billingMonth");

-- CreateIndex
CREATE UNIQUE INDEX "WaterPayment_reference_key" ON "WaterPayment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "WaterComplaint_complaintId_key" ON "WaterComplaint"("complaintId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterTransferRequest_requestId_key" ON "WaterTransferRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "GasAccount_consumerNumber_key" ON "GasAccount"("consumerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GasAccount_lpgId_key" ON "GasAccount"("lpgId");

-- CreateIndex
CREATE UNIQUE INDEX "GasBooking_bookingId_key" ON "GasBooking"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "GasComplaint_complaintId_key" ON "GasComplaint"("complaintId");

-- CreateIndex
CREATE UNIQUE INDEX "GasTransferRequest_requestId_key" ON "GasTransferRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyAccount_propertyId_key" ON "PropertyAccount"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTaxBill_propertyId_financialYear_key" ON "PropertyTaxBill"("propertyId", "financialYear");

-- CreateIndex
CREATE UNIQUE INDEX "CivicComplaint_complaintId_key" ON "CivicComplaint"("complaintId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateRequest_requestId_key" ON "CertificateRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleAccount_registrationNumber_key" ON "VehicleAccount"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Challan_challanNumber_key" ON "Challan"("challanNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RtoApplication_applicationNumber_key" ON "RtoApplication"("applicationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RationCardAccount_cardNumber_key" ON "RationCardAccount"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RationEntitlement_cardType_key" ON "RationEntitlement"("cardType");

-- CreateIndex
CREATE UNIQUE INDEX "RationTransaction_transactionId_key" ON "RationTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "RationGrievance_grievanceId_key" ON "RationGrievance"("grievanceId");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_identifier_key" ON "RateLimit"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityPayment_reference_key" ON "ElectricityPayment"("reference");

-- AddForeignKey
ALTER TABLE "WaterBill" ADD CONSTRAINT "WaterBill_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterPayment" ADD CONSTRAINT "WaterPayment_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterComplaint" ADD CONSTRAINT "WaterComplaint_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterTransferRequest" ADD CONSTRAINT "WaterTransferRequest_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GasBooking" ADD CONSTRAINT "GasBooking_consumerNumber_fkey" FOREIGN KEY ("consumerNumber") REFERENCES "GasAccount"("consumerNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GasComplaint" ADD CONSTRAINT "GasComplaint_consumerNumber_fkey" FOREIGN KEY ("consumerNumber") REFERENCES "GasAccount"("consumerNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GasTransferRequest" ADD CONSTRAINT "GasTransferRequest_consumerNumber_fkey" FOREIGN KEY ("consumerNumber") REFERENCES "GasAccount"("consumerNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTaxBill" ADD CONSTRAINT "PropertyTaxBill_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PropertyAccount"("propertyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CivicComplaint" ADD CONSTRAINT "CivicComplaint_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PropertyAccount"("propertyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "PropertyAccount"("propertyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challan" ADD CONSTRAINT "Challan_registrationNumber_fkey" FOREIGN KEY ("registrationNumber") REFERENCES "VehicleAccount"("registrationNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RtoApplication" ADD CONSTRAINT "RtoApplication_registrationNumber_fkey" FOREIGN KEY ("registrationNumber") REFERENCES "VehicleAccount"("registrationNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RationTransaction" ADD CONSTRAINT "RationTransaction_cardNumber_fkey" FOREIGN KEY ("cardNumber") REFERENCES "RationCardAccount"("cardNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RationGrievance" ADD CONSTRAINT "RationGrievance_cardNumber_fkey" FOREIGN KEY ("cardNumber") REFERENCES "RationCardAccount"("cardNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
