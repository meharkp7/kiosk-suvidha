-- CreateTable
CREATE TABLE "WaterNameChangeRequest" (
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

    CONSTRAINT "WaterNameChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterNewConnectionRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterNewConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterSewerageRequest" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterSewerageRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaterNameChangeRequest_requestId_key" ON "WaterNameChangeRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterNewConnectionRequest_requestId_key" ON "WaterNewConnectionRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterSewerageRequest_requestId_key" ON "WaterSewerageRequest"("requestId");

-- AddForeignKey
ALTER TABLE "WaterNameChangeRequest" ADD CONSTRAINT "WaterNameChangeRequest_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterSewerageRequest" ADD CONSTRAINT "WaterSewerageRequest_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "WaterAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
