-- CreateTable
CREATE TABLE "ElectricityNameChangeRequest" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "oldName" TEXT NOT NULL,
    "newName" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityNameChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityLoadChangeRequest" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "oldLoad" DOUBLE PRECISION NOT NULL,
    "newLoad" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityLoadChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityNewConnectionRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "loadRequired" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityNewConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityBillingIssue" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedResolution" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityBillingIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterMeterReading" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "reading" DOUBLE PRECISION NOT NULL,
    "readingId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterMeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityNameChangeRequest_requestId_key" ON "ElectricityNameChangeRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityLoadChangeRequest_requestId_key" ON "ElectricityLoadChangeRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityNewConnectionRequest_requestId_key" ON "ElectricityNewConnectionRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityBillingIssue_requestId_key" ON "ElectricityBillingIssue"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterMeterReading_readingId_key" ON "WaterMeterReading"("readingId");

-- AddForeignKey
ALTER TABLE "ElectricityNameChangeRequest" ADD CONSTRAINT "ElectricityNameChangeRequest_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityLoadChangeRequest" ADD CONSTRAINT "ElectricityLoadChangeRequest_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityBillingIssue" ADD CONSTRAINT "ElectricityBillingIssue_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterMeterReading" ADD CONSTRAINT "WaterMeterReading_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
