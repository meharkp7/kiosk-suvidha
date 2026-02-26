-- ============================================
-- SUPABASE SEED SCRIPT FOR KIOSK SUVIDHA
-- Run this in Supabase SQL Editor
-- ============================================

-- Clear existing data (run with caution in production)
TRUNCATE TABLE "AuditLog", "RateLimit", "RationGrievance", "RationTransaction", 
  "RationEntitlement", "RationCardAccount", "RtoApplication", "Challan", 
  "VehicleAccount", "CertificateRequest", "CivicComplaint", "PropertyTaxBill", 
  "PropertyAccount", "GasTransferRequest", "GasComplaint", "GasBooking", 
  "GasAccount", "WaterTransferRequest", "WaterComplaint", "WaterPayment", 
  "WaterBill", "WaterAccount", "ElectricityTransferRequest", "ElectricityComplaint", 
  "ElectricityPayment", "ElectricityBill", "ElectricityAccount", "LinkedAccount", 
  "Service", "Department" CASCADE;

-- Create Departments
INSERT INTO "Department" (id, code, name) VALUES
  (gen_random_uuid(), 'electricity', 'Electricity Department'),
  (gen_random_uuid(), 'water', 'Water Supply Board'),
  (gen_random_uuid(), 'gas', 'Gas Utility (LPG)'),
  (gen_random_uuid(), 'municipal', 'Municipal Corporation'),
  (gen_random_uuid(), 'transport', 'Transport Department (RTO)'),
  (gen_random_uuid(), 'pds', 'Public Distribution System');

-- Create Demo User Accounts (Phone: 9876543210)
-- Electricity Account
INSERT INTO "ElectricityAccount" (id, "accountNumber", "consumerName", address, "meterNumber", "connectionType", "sanctionedLoad", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'EL123456789', 'Rahul Sharma', '123, MG Road, Bangalore - 560001', 'MTR001234567', 'DOMESTIC', 3.0, NOW(), NOW());

-- Water Account
INSERT INTO "WaterAccount" (id, "accountNumber", "consumerName", address, "meterNumber", "connectionType", category, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'WA987654321', 'Rahul Sharma', '123, MG Road, Bangalore - 560001', 'WTR001234567', 'DOMESTIC', 'RESIDENTIAL', NOW(), NOW());

-- Gas Account
INSERT INTO "GasAccount" (id, "consumerNumber", "lpgId", "consumerName", address, "distributorName", "distributorCode", "subsidyStatus", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'GS123456789', 'LPGID123456789', 'Rahul Sharma', '123, MG Road, Bangalore - 560001', 'Bharat Gas', 'BG001', 'ACTIVE', NOW(), NOW());

-- Property Account
INSERT INTO "PropertyAccount" (id, "propertyId", "ownerName", address, "wardNumber", "propertyType", "builtUpArea", "annualValue", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'PROP123456', 'Rahul Sharma', '123, MG Road, Bangalore - 560001', '45', 'RESIDENTIAL', 1200, 50000, NOW(), NOW());

-- Vehicle Account
INSERT INTO "VehicleAccount" (id, "registrationNumber", "ownerName", "vehicleClass", "fuelType", "chassisNumber", "engineNumber", "registrationDate", "fitnessValidUpto", "insuranceValidUpto", "pucValidUpto", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'KA01AB1234', 'Rahul Sharma', 'LMV', 'PETROL', 'MAT12345678901234', 'ENG12345678901234', '2020-01-15', '2025-01-15', '2024-12-31', '2024-06-30', NOW(), NOW());

-- Ration Card Account
INSERT INTO "RationCardAccount" (id, "cardNumber", "cardType", "headOfFamily", address, "fpsCode", "fpsName", "totalMembers", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'RC123456789012', 'PHH', 'Rahul Sharma', '123, MG Road, Bangalore - 560001', 'FPS001', 'Anna Ration Shop', 4, NOW(), NOW());

-- Link accounts to demo phone number
INSERT INTO "LinkedAccount" (id, "phoneNumber", department, "accountNumber", "linkedAt")
VALUES 
  (gen_random_uuid(), '9876543210', 'electricity', 'EL123456789', NOW()),
  (gen_random_uuid(), '9876543210', 'water', 'WA987654321', NOW()),
  (gen_random_uuid(), '9876543210', 'gas', 'GS123456789', NOW()),
  (gen_random_uuid(), '9876543210', 'municipal', 'PROP123456', NOW()),
  (gen_random_uuid(), '9876543210', 'transport', 'KA01AB1234', NOW()),
  (gen_random_uuid(), '9876543210', 'pds', 'RC123456789012', NOW());

-- Create sample bills for Electricity
INSERT INTO "ElectricityBill" (id, "accountNumber", "billingMonth", "billingDate", "unitsConsumed", "fixedCharge", "energyCharge", tax, "lateFee", "totalAmount", "dueDate", status, "tariffSlab", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'EL123456789', '2024-01', '2024-01-10', 150, 30, 750, 78, 0, 858, '2024-01-25', 'PAID', 'DOMESTIC-1', NOW(), NOW()),
  (gen_random_uuid(), 'EL123456789', '2024-02', '2024-02-10', 180, 30, 900, 93, 0, 1023, '2024-02-25', 'PAID', 'DOMESTIC-1', NOW(), NOW()),
  (gen_random_uuid(), 'EL123456789', '2024-03', '2024-03-10', 165, 30, 825, 85.5, 50, 990.5, '2024-03-25', 'UNPAID', 'DOMESTIC-1', NOW(), NOW());

-- Create sample bills for Water
INSERT INTO "WaterBill" (id, "accountNumber", "billingMonth", "billingDate", "meterReading", "unitsConsumed", "waterCharge", "sewerageCharge", tax, "totalAmount", "dueDate", status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'WA987654321', '2024-01', '2024-01-05', 12345, 25, 125, 62.5, 18.75, 206.25, '2024-01-20', 'PAID', NOW(), NOW()),
  (gen_random_uuid(), 'WA987654321', '2024-02', '2024-02-05', 12370, 30, 150, 75, 22.5, 247.5, '2024-02-20', 'UNPAID', NOW(), NOW());

-- Create gas bookings
INSERT INTO "GasBooking" (id, "consumerNumber", "bookingId", "bookingDate", "deliveryDate", "cylinderType", quantity, amount, "subsidyAmount", "netAmount", status, "paymentStatus", "deliveredAt", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'GS123456789', 'BK1709123456789', '2024-01-15', '2024-01-18', '14.2KG', 1, 1100, 200, 900, 'DELIVERED', 'PAID', '2024-01-18', NOW(), NOW()),
  (gen_random_uuid(), 'GS123456789', 'BK1709123456790', '2024-02-10', '2024-02-13', '5KG', 2, 800, 100, 700, 'DELIVERED', 'PAID', '2024-02-13', NOW(), NOW()),
  (gen_random_uuid(), 'GS123456789', 'BK1709123456791', '2024-03-05', NULL, '14.2KG', 1, 1100, 200, 900, 'PROCESSING', 'PAID', NULL, NOW(), NOW());

-- Create property tax bills
INSERT INTO "PropertyTaxBill" (id, "propertyId", "financialYear", "taxAmount", "rebateAmount", "penaltyAmount", "totalAmount", "dueDate", status, "paidDate", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'PROP123456', '2023-24', 5000, 500, 0, 4500, '2024-03-31', 'PAID', '2024-03-25', NOW(), NOW()),
  (gen_random_uuid(), 'PROP123456', '2024-25', 5200, 0, 0, 5200, '2025-03-31', 'UNPAID', NULL, NOW(), NOW());

-- Create traffic challans
INSERT INTO "Challan" (id, "registrationNumber", "challanNumber", "violationDate", "violationType", "violationLocation", "fineAmount", status, "paidDate", "paymentReference", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'KA01AB1234', 'CH202401001', '2024-01-15', 'Speeding', 'MG Road, Bangalore', 1000, 'PAID', '2024-01-20', 'PAY001', NOW(), NOW()),
  (gen_random_uuid(), 'KA01AB1234', 'CH202402002', '2024-02-10', 'No Helmet', 'Indiranagar, Bangalore', 500, 'UNPAID', NULL, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'KA01AB1234', 'CH202403003', '2024-03-05', 'Wrong Parking', 'Koramangala, Bangalore', 300, 'PAID', '2024-03-08', 'PAY002', NOW(), NOW());

-- Create ration entitlement
INSERT INTO "RationEntitlement" (id, "cardType", "riceKg", "wheatKg", "sugarKg", "keroseneL", "validFrom", "validUpto", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'PHH', 5, 2, 1, 2, '2024-01-01', '2024-12-31', NOW(), NOW());

-- Create ration transactions
INSERT INTO "RationTransaction" (id, "cardNumber", "transactionId", "transactionDate", "riceTaken", "wheatTaken", "sugarTaken", "keroseneTaken", "totalAmount", "fpsCode", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'RC123456789012', 'TXN001', '2024-01-15', 5, 2, 1, 2, 95, 'FPS001', NOW(), NOW()),
  (gen_random_uuid(), 'RC123456789012', 'TXN002', '2024-02-15', 5, 2, 1, 2, 95, 'FPS001', NOW(), NOW());

-- ============================================
-- VERIFICATION QUERY (run after seeding)
-- ============================================
-- Check all linked accounts for demo user:
-- SELECT * FROM "LinkedAccount" WHERE "phoneNumber" = '9876543210';
