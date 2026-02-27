-- CreateTable
CREATE TABLE "GasNewConnectionRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL,
    "distributorCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasNewConnectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GasNewConnectionRequest_requestId_key" ON "GasNewConnectionRequest"("requestId");
