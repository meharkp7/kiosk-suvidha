import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ============================================
// DATA GENERATORS
// ============================================

const firstNames = [
  "Rajesh", "Sunita", "Amit", "Priya", "Vijay", "Anjali", "Suresh", "Deepa",
  "Ramesh", "Kavita", "Mahesh", "Poonam", "Dinesh", "Rekha", "Sunil", "Sunita",
  "Anil", "Neeta", "Prakash", "Lata", "Gopal", "Radha", "Mohan", "Usha",
  "Krishna", "Sarita", "Ganesh", "Madhuri", "Ravi", "Kiran", "Arun", "Bharati",
  "Sanjay", "Geeta", "Manoj", "Indira", "Naresh", "Lakshmi", "Kishor", "Savita",
  "Dev", "Asha", "Vikas", "Rani", "Jai", "Nirmala", "Hari", "Kalpana"
]

const lastNames = [
  "Sharma", "Kumar", "Singh", "Patel", "Gupta", "Reddy", "Nair", "Iyer",
  "Joshi", "Desai", "Shah", "Mehta", "Rao", "Jain", "Malhotra", "Aggarwal",
  "Chopra", "Bhat", "Menon", "Pillai", "Verma", "Yadav", "Dubey", "Pandey",
  "Mishra", "Tiwari", "Shukla", "Srivastava", "Chatterjee", "Banerjee", "Das",
  "Roy", "Sen", "Bose", "Ghosh", "Barman", "Dasgupta", "Mukherjee", "Bhattacharya"
]

const delhiAreas = [
  "Karol Bagh", "Rajendra Nagar", "Paharganj", "Connaught Place", "Chandni Chowk",
  "Darya Ganj", "Lajpat Nagar", "South Extension", "Greater Kailash", "Defence Colony",
  "Hauz Khas", "Vasant Kunj", "Dwarka", "Rohini", "Pitampura", "Janakpuri",
  "Patel Nagar", "Tagore Garden", "Ashok Nagar", "Moti Nagar", "Kirti Nagar",
  "Ramesh Nagar", "Bali Nagar", "Rajouri Garden", "Tilak Nagar", "Subhash Nagar",
  "Uttam Nagar", "Vikaspuri", "Paschim Vihar", "Punjabi Bagh", "Ashok Vihar",
  "Model Town", "Shalimar Bagh", "Azadpur", "Civil Lines", "Kashmere Gate",
  "Dilshad Garden", "Shahdara", "Preet Vihar", "Laxmi Nagar", "Mayur Vihar",
  "Vasundhara Enclave", "Indirapuram", "Kaushambi", "Anand Vihar"
]

const streets = [
  "Main Road", "Cross Road", "Lane 1", "Lane 2", "Block A", "Block B",
  "Sector 4", "Sector 7", "Market Road", "Station Road", "Gandhi Marg",
  "Nehru Street", "Patel Road", "Tagore Lane", "Azad Road", "Lajpat Road"
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateName(): string {
  return `${randomItem(firstNames)} ${randomItem(lastNames)}`
}

function generateAddress(): string {
  const houseNumber = Math.floor(Math.random() * 999) + 1
  const area = randomItem(delhiAreas)
  const street = randomItem(streets)
  return `${houseNumber}, ${street}, ${area}, Delhi - ${Math.floor(Math.random() * 900) + 100}`
}

function generatePhoneNumber(): string {
  return `9${Math.floor(Math.random() * 9000000000) + 1000000000}`
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.rateLimit.deleteMany()
  await prisma.rationGrievance.deleteMany()
  await prisma.rationTransaction.deleteMany()
  await prisma.rationEntitlement.deleteMany()
  await prisma.rationCardAccount.deleteMany()
  await prisma.rtoApplication.deleteMany()
  await prisma.challan.deleteMany()
  await prisma.vehicleAccount.deleteMany()
  await prisma.certificateRequest.deleteMany()
  await prisma.civicComplaint.deleteMany()
  await prisma.propertyTaxBill.deleteMany()
  await prisma.propertyAccount.deleteMany()
  await prisma.gasTransferRequest.deleteMany()
  await prisma.gasComplaint.deleteMany()
  await prisma.gasBooking.deleteMany()
  await prisma.gasAccount.deleteMany()
  await prisma.waterTransferRequest.deleteMany()
  await prisma.waterComplaint.deleteMany()
  await prisma.waterPayment.deleteMany()
  await prisma.waterBill.deleteMany()
  await prisma.waterAccount.deleteMany()
  await prisma.electricityTransferRequest.deleteMany()
  await prisma.electricityComplaint.deleteMany()
  await prisma.electricityPayment.deleteMany()
  await prisma.electricityBill.deleteMany()
  await prisma.electricityAccount.deleteMany()
  await prisma.linkedAccount.deleteMany()
  await prisma.service.deleteMany()
  await prisma.department.deleteMany()

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { code: 'electricity', name: 'Electricity Department' }
    }),
    prisma.department.create({
      data: { code: 'water', name: 'Water Supply Board' }
    }),
    prisma.department.create({
      data: { code: 'gas', name: 'Gas Utility (LPG)' }
    }),
    prisma.department.create({
      data: { code: 'municipal', name: 'Municipal Corporation' }
    }),
    prisma.department.create({
      data: { code: 'transport', name: 'Transport Department (RTO)' }
    }),
    prisma.department.create({
      data: { code: 'pds', name: 'Public Distribution System' }
    })
  ])

  // Create Services
  const electricityDept = departments.find(d => d.code === 'electricity')!
  const waterDept = departments.find(d => d.code === 'water')!
  const gasDept = departments.find(d => d.code === 'gas')!
  const municipalDept = departments.find(d => d.code === 'municipal')!
  const transportDept = departments.find(d => d.code === 'transport')!
  const pdsDept = departments.find(d => d.code === 'pds')!

  await Promise.all([
    // Electricity Services
    prisma.service.create({ data: { key: 'current-bill', label: 'View Current Bill', departmentId: electricityDept.id } }),
    prisma.service.create({ data: { key: 'pay-bill', label: 'Pay Bill', departmentId: electricityDept.id } }),
    prisma.service.create({ data: { key: 'bill-history', label: 'Bill History', departmentId: electricityDept.id } }),
    prisma.service.create({ data: { key: 'raise-complaint', label: 'Raise Complaint', departmentId: electricityDept.id } }),
    prisma.service.create({ data: { key: 'complaint-status', label: 'Complaint Status', departmentId: electricityDept.id } }),
    prisma.service.create({ data: { key: 'transfer', label: 'Transfer Connection', departmentId: electricityDept.id } }),

    // Water Services
    prisma.service.create({ data: { key: 'current-bill', label: 'View Current Bill', departmentId: waterDept.id } }),
    prisma.service.create({ data: { key: 'pay-bill', label: 'Pay Bill', departmentId: waterDept.id } }),
    prisma.service.create({ data: { key: 'history', label: 'Bill History', departmentId: waterDept.id } }),
    prisma.service.create({ data: { key: 'raise-complaint', label: 'Raise Complaint', departmentId: waterDept.id } }),

    // Gas Services
    prisma.service.create({ data: { key: 'book-cylinder', label: 'Book Cylinder', departmentId: gasDept.id } }),
    prisma.service.create({ data: { key: 'booking-status', label: 'Booking Status', departmentId: gasDept.id } }),

    // Municipal Services
    prisma.service.create({ data: { key: 'pay-tax', label: 'Pay Property Tax', departmentId: municipalDept.id } }),
    prisma.service.create({ data: { key: 'property-details', label: 'Property Details', departmentId: municipalDept.id } }),
    prisma.service.create({ data: { key: 'raise-complaint', label: 'Raise Complaint', departmentId: municipalDept.id } }),

    // Transport Services
    prisma.service.create({ data: { key: 'challan-history', label: 'Challan History', departmentId: transportDept.id } }),
    prisma.service.create({ data: { key: 'vehicle-details', label: 'Vehicle Details', departmentId: transportDept.id } }),

    // PDS Services
    prisma.service.create({ data: { key: 'view-ration-card', label: 'View Ration Card', departmentId: pdsDept.id } }),
    prisma.service.create({ data: { key: 'view-transactions', label: 'View Transactions', departmentId: pdsDept.id } }),
    prisma.service.create({ data: { key: 'view-entitlement', label: 'View Entitlement', departmentId: pdsDept.id } }),
    prisma.service.create({ data: { key: 'raise-grievance', label: 'Raise Grievance', departmentId: pdsDept.id } })
  ])

  // Create Demo User Account (9876543210)
  const demoPhoneNumber = '9876543210'
  const demoName = 'Rahul Sharma'
  const demoAddress = '123, MG Road, Bangalore - 560001'

  // Electricity Account
  const electricityAccount = await prisma.electricityAccount.create({
    data: {
      accountNumber: 'EL123456789',
      consumerName: demoName,
      address: demoAddress,
      meterNumber: 'MTR001234567',
      connectionType: 'DOMESTIC',
      sanctionedLoad: 3.0
    }
  })

  // Water Account
  const waterAccount = await prisma.waterAccount.create({
    data: {
      accountNumber: 'WA987654321',
      consumerName: demoName,
      address: demoAddress,
      meterNumber: 'WTR001234567',
      connectionType: 'DOMESTIC',
      category: 'RESIDENTIAL'
    }
  })

  // Gas Account
  const gasAccount = await prisma.gasAccount.create({
    data: {
      consumerNumber: 'GS123456789',
      lpgId: 'LPGID123456789',
      consumerName: demoName,
      address: demoAddress,
      distributorName: 'Bharat Gas',
      distributorCode: 'BG001',
      subsidyStatus: 'ACTIVE'
    }
  })

  // Property Account
  const propertyAccount = await prisma.propertyAccount.create({
    data: {
      propertyId: 'PROP123456',
      ownerName: demoName,
      address: demoAddress,
      wardNumber: '45',
      propertyType: 'RESIDENTIAL',
      builtUpArea: 1200,
      annualValue: 50000
    }
  })

  // Vehicle Account
  const vehicleAccount = await prisma.vehicleAccount.create({
    data: {
      registrationNumber: 'KA01AB1234',
      ownerName: demoName,
      vehicleClass: 'LMV',
      fuelType: 'PETROL',
      chassisNumber: 'MAT12345678901234',
      engineNumber: 'ENG12345678901234',
      registrationDate: new Date('2020-01-15'),
      fitnessValidUpto: new Date('2025-01-15'),
      insuranceValidUpto: new Date('2024-12-31'),
      pucValidUpto: new Date('2024-06-30')
    }
  })

  // Ration Card Account
  const rationAccount = await prisma.rationCardAccount.create({
    data: {
      cardNumber: 'RC123456789012',
      cardType: 'PHH',
      headOfFamily: demoName,
      address: demoAddress,
      fpsCode: 'FPS001',
      fpsName: 'Anna Ration Shop',
      totalMembers: 4
    }
  })

  // Link all accounts to the demo phone number
  await Promise.all([
    prisma.linkedAccount.create({
      data: { phoneNumber: demoPhoneNumber, department: 'electricity', accountNumber: electricityAccount.accountNumber }
    }),
    prisma.linkedAccount.create({
      data: { phoneNumber: demoPhoneNumber, department: 'water', accountNumber: waterAccount.accountNumber }
    }),
    prisma.linkedAccount.create({
      data: { phoneNumber: demoPhoneNumber, department: 'gas', accountNumber: gasAccount.consumerNumber }
    }),
    prisma.linkedAccount.create({
      data: { phoneNumber: demoPhoneNumber, department: 'municipal', accountNumber: propertyAccount.propertyId }
    }),
    prisma.linkedAccount.create({
      data: { phoneNumber: demoPhoneNumber, department: 'transport', accountNumber: vehicleAccount.registrationNumber }
    }),
    prisma.linkedAccount.create({
      data: { phoneNumber: demoPhoneNumber, department: 'pds', accountNumber: rationAccount.cardNumber }
    })
  ])

  // Create sample data for each department

  // Electricity Bills
  const electricityBills = [
    {
      accountNumber: electricityAccount.accountNumber,
      billingMonth: '2024-01',
      billingDate: new Date('2024-01-10'),
      unitsConsumed: 150,
      fixedCharge: 30,
      energyCharge: 750,
      tax: 78,
      lateFee: 0,
      totalAmount: 858,
      dueDate: new Date('2024-01-25'),
      status: 'PAID',
      paidDate: new Date('2024-01-20'),
      tariffSlab: 'DOMESTIC-1'
    },
    {
      accountNumber: electricityAccount.accountNumber,
      billingMonth: '2024-02',
      billingDate: new Date('2024-02-10'),
      unitsConsumed: 180,
      fixedCharge: 30,
      energyCharge: 900,
      tax: 93,
      lateFee: 0,
      totalAmount: 1023,
      dueDate: new Date('2024-02-25'),
      status: 'PAID',
      paidDate: new Date('2024-02-22'),
      tariffSlab: 'DOMESTIC-1'
    },
    {
      accountNumber: electricityAccount.accountNumber,
      billingMonth: '2024-03',
      billingDate: new Date('2024-03-10'),
      unitsConsumed: 165,
      fixedCharge: 30,
      energyCharge: 825,
      tax: 85.5,
      lateFee: 50,
      totalAmount: 990.5,
      dueDate: new Date('2024-03-25'),
      status: 'UNPAID',
      tariffSlab: 'DOMESTIC-1'
    }
  ]

  await Promise.all(
    electricityBills.map(bill => prisma.electricityBill.create({ data: bill }))
  )

  // Water Bills
  const waterBills = [
    {
      accountNumber: waterAccount.accountNumber,
      billingMonth: '2024-01',
      billingDate: new Date('2024-01-05'),
      meterReading: 12345,
      unitsConsumed: 25,
      waterCharge: 125,
      sewerageCharge: 62.5,
      tax: 18.75,
      totalAmount: 206.25,
      dueDate: new Date('2024-01-20'),
      status: 'PAID',
      paidDate: new Date('2024-01-18')
    },
    {
      accountNumber: waterAccount.accountNumber,
      billingMonth: '2024-02',
      billingDate: new Date('2024-02-05'),
      meterReading: 12370,
      unitsConsumed: 30,
      waterCharge: 150,
      sewerageCharge: 75,
      tax: 22.5,
      totalAmount: 247.5,
      dueDate: new Date('2024-02-20'),
      status: 'UNPAID'
    }
  ]

  await Promise.all(
    waterBills.map(bill => prisma.waterBill.create({ data: bill }))
  )

  // Gas Bookings
  const gasBookings = [
    {
      consumerNumber: gasAccount.consumerNumber,
      bookingId: 'BK1709123456789',
      bookingDate: new Date('2024-01-15'),
      deliveryDate: new Date('2024-01-18'),
      cylinderType: '14.2KG',
      quantity: 1,
      amount: 1100,
      subsidyAmount: 200,
      netAmount: 900,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      deliveredAt: new Date('2024-01-18')
    },
    {
      consumerNumber: gasAccount.consumerNumber,
      bookingId: 'BK1709123456790',
      bookingDate: new Date('2024-02-10'),
      deliveryDate: new Date('2024-02-13'),
      cylinderType: '5KG',
      quantity: 2,
      amount: 800,
      subsidyAmount: 100,
      netAmount: 700,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      deliveredAt: new Date('2024-02-13')
    },
    {
      consumerNumber: gasAccount.consumerNumber,
      bookingId: 'BK1709123456791',
      bookingDate: new Date('2024-03-05'),
      cylinderType: '14.2KG',
      quantity: 1,
      amount: 1100,
      subsidyAmount: 200,
      netAmount: 900,
      status: 'PROCESSING',
      paymentStatus: 'PAID'
    }
  ]

  await Promise.all(
    gasBookings.map(booking => prisma.gasBooking.create({ data: booking }))
  )

  // Property Tax Bills
  const propertyTaxBills = [
    {
      propertyId: propertyAccount.propertyId,
      financialYear: '2023-24',
      taxAmount: 5000,
      rebateAmount: 500,
      penaltyAmount: 0,
      totalAmount: 4500,
      dueDate: new Date('2024-03-31'),
      status: 'PAID',
      paidDate: new Date('2024-03-25')
    },
    {
      propertyId: propertyAccount.propertyId,
      financialYear: '2024-25',
      taxAmount: 5200,
      rebateAmount: 0,
      penaltyAmount: 0,
      totalAmount: 5200,
      dueDate: new Date('2025-03-31'),
      status: 'UNPAID'
    }
  ]

  await Promise.all(
    propertyTaxBills.map(bill => prisma.propertyTaxBill.create({ data: bill }))
  )

  // Traffic Challans
  const challans = [
    {
      registrationNumber: vehicleAccount.registrationNumber,
      challanNumber: 'CH202401001',
      violationDate: new Date('2024-01-15'),
      violationType: 'Speeding',
      violationLocation: 'MG Road, Bangalore',
      fineAmount: 1000,
      status: 'PAID',
      paidDate: new Date('2024-01-20'),
      paymentReference: 'PAY001'
    },
    {
      registrationNumber: vehicleAccount.registrationNumber,
      challanNumber: 'CH202402002',
      violationDate: new Date('2024-02-10'),
      violationType: 'No Helmet',
      violationLocation: 'Indiranagar, Bangalore',
      fineAmount: 500,
      status: 'UNPAID'
    },
    {
      registrationNumber: vehicleAccount.registrationNumber,
      challanNumber: 'CH202403003',
      violationDate: new Date('2024-03-05'),
      violationType: 'Wrong Parking',
      violationLocation: 'Koramangala, Bangalore',
      fineAmount: 300,
      status: 'PAID',
      paidDate: new Date('2024-03-08'),
      paymentReference: 'PAY002'
    }
  ]

  await Promise.all(
    challans.map(challan => prisma.challan.create({ data: challan }))
  )

  // Ration Entitlement
  await prisma.rationEntitlement.create({
    data: {
      cardType: 'PHH',
      riceKg: 5,
      wheatKg: 2,
      sugarKg: 1,
      keroseneL: 2,
      validFrom: new Date('2024-01-01'),
      validUpto: new Date('2024-12-31')
    }
  })

  // Ration Transactions
  const rationTransactions = [
    {
      cardNumber: rationAccount.cardNumber,
      transactionId: 'TXN001',
      transactionDate: new Date('2024-01-15'),
      riceTaken: 5,
      wheatTaken: 2,
      sugarTaken: 1,
      keroseneTaken: 2,
      totalAmount: 95,
      fpsCode: rationAccount.fpsCode
    },
    {
      cardNumber: rationAccount.cardNumber,
      transactionId: 'TXN002',
      transactionDate: new Date('2024-02-15'),
      riceTaken: 5,
      wheatTaken: 2,
      sugarTaken: 1,
      keroseneTaken: 2,
      totalAmount: 95,
      fpsCode: rationAccount.fpsCode
    }
  ]

  await Promise.all(
    rationTransactions.map(txn => prisma.rationTransaction.create({ data: txn }))
  )

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Created sample data for phone number: 9876543210')
  console.log('\n📋 Account Details:')
  console.log(`  Electricity: ${electricityAccount.accountNumber}`)
  console.log(`  Water: ${waterAccount.accountNumber}`)
  console.log(`  Gas: ${gasAccount.consumerNumber}`)
  console.log(`  Property: ${propertyAccount.propertyId}`)
  console.log(`  Vehicle: ${vehicleAccount.registrationNumber}`)
  console.log(`  Ration: ${rationAccount.cardNumber}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
