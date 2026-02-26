-- CreateTable
CREATE TABLE "LinkedAccount" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityAccount" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "consumerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityBill" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "billingMonth" TEXT NOT NULL,
    "unitsConsumed" INTEGER NOT NULL,
    "fixedCharge" DOUBLE PRECISION NOT NULL,
    "energyCharge" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityPayment" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityComplaint" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "complaintType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "complaintId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "assignedTo" TEXT,
    "estimatedResolution" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "escalationLevel" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityTransferRequest" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityTransferRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityAccount_accountNumber_key" ON "ElectricityAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityComplaint_complaintId_key" ON "ElectricityComplaint"("complaintId");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityTransferRequest_requestId_key" ON "ElectricityTransferRequest"("requestId");

-- AddForeignKey
ALTER TABLE "ElectricityBill" ADD CONSTRAINT "ElectricityBill_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityPayment" ADD CONSTRAINT "ElectricityPayment_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityComplaint" ADD CONSTRAINT "ElectricityComplaint_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityTransferRequest" ADD CONSTRAINT "ElectricityTransferRequest_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "ElectricityAccount"("accountNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
