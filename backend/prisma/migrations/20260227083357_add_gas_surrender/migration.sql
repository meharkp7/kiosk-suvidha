-- CreateTable
CREATE TABLE "GasSurrenderRequest" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "consumerNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "estimatedCompletion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasSurrenderRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GasSurrenderRequest_requestId_key" ON "GasSurrenderRequest"("requestId");
