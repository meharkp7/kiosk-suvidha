/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber,billingMonth]` on the table `ElectricityBill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber,accountNumber]` on the table `LinkedAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ElectricityBill_accountNumber_billingMonth_key" ON "ElectricityBill"("accountNumber", "billingMonth");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedAccount_phoneNumber_accountNumber_key" ON "LinkedAccount"("phoneNumber", "accountNumber");
