# Feature Audit - Missing Backend Integrations

## Pages with Simulated/Fake APIs (Need Real Backend Connection):

### Electricity Department:
1. ✅ **View Current Bill** - `/electricity/current-bill` - HAS API (GET /electricity/bill/:accountNumber)
2. ✅ **Pay Bill** - `/electricity/pay-bill` - HAS API (POST /payments/create-order)
3. ✅ **Bill History** - `/electricity/bill-history` - HAS API (GET /electricity/history/:accountNumber)
4. ✅ **Raise Complaint** - `/electricity/raise-complaint` - HAS API (POST /electricity/complaint)
5. ✅ **Track Complaint** - `/electricity/complaint-status` - HAS API (GET /electricity/complaints/:accountNumber)
6. ❌ **Submit Meter Reading** - `/electricity/meter-reading` - NEEDS API
7. ❌ **Name Change** - `/electricity/name-change` - NEEDS API
8. ❌ **Load Change** - `/electricity/load-change` - NEEDS API
9. ❌ **New Connection** - `/electricity/new-connection` - NEEDS API
10. ❌ **Transfer Connection** - `/electricity/transfer-connection` - NEEDS API (partial - has create, needs status tracking)
11. ❌ **Billing Issues** - `/electricity/billing-issues` - NEEDS API

### Water Department:
1. ✅ **View Current Bill** - HAS API
2. ✅ **Pay Bill** - HAS API
3. ✅ **Bill History** - HAS API
4. ✅ **Raise Complaint** - HAS API
5. ✅ **Track Complaint** - NEEDS API (only has single complaint status)
6. ✅ **Submit Meter Reading** - `/water/meter-reading` - HAS API (just added)
7. ❌ **Name Change** - NEEDS API
8. ❌ **New Connection** - NEEDS API
9. ❌ **Sewerage Connection** - NEEDS API

### Gas Department:
1. ❌ **Book Cylinder** - NEEDS API
2. ❌ **Booking Status** - NEEDS API
3. ❌ **Subsidy Info** - NEEDS API
4. ❌ **New Connection** - NEEDS API
5. ❌ **Transfer Connection** - NEEDS API
6. ❌ **Surrender Connection** - NEEDS API
7. ❌ **Damaged Cylinder** - NEEDS API
8. ❌ **Regulator Issue** - NEEDS API
9. ❌ **Double Bottle** - NEEDS API

### Municipal Department:
1. ❌ **Pay Property Tax** - NEEDS API
2. ❌ **Tax Receipt** - NEEDS API
3. ❌ **Property Details** - NEEDS API
4. ❌ **Apply Certificate** (Birth/Death/Marriage) - NEEDS APIs
5. ❌ **Raise Complaint** - NEEDS API
6. ❌ **Complaint Status** - NEEDS API
7. ❌ **Street Light** - NEEDS API
8. ❌ **Garbage** - NEEDS API
9. ❌ **Drainage** - NEEDS API
10. ❌ **Roads** - NEEDS API

### Transport Department:
1. ❌ **Vehicle Details** - NEEDS API
2. ❌ **Pay Challan** - NEEDS API
3. ❌ **Challan History** - NEEDS API
4. ❌ **DL Status** - NEEDS API
5. ❌ **Renew License** - NEEDS API
6. ❌ **Learner License** - NEEDS API
7. ❌ **Vehicle Registration** - NEEDS API

### PDS Department:
1. ✅ **Card Details** - HAS API
2. ✅ **Entitlement** - HAS API
3. ✅ **Transactions** - HAS API
4. ❌ **Raise Grievance** - NEEDS API
5. ❌ **Grievance Status** - NEEDS API
6. ❌ **Add/Remove Member** - NEEDS API
7. ❌ **Address Change** - NEEDS API
8. ❌ **FPS Change** - NEEDS API

## Critical Fixes Needed:

### High Priority (Core Features):
1. Electricity Meter Reading API + Frontend Integration
2. Water Complaint Status (List All) API
3. All Gas Department APIs
4. Municipal Property Tax APIs
5. Transport Challan APIs

### Medium Priority:
6. Name Change APIs (Electricity/Water)
7. New Connection APIs
8. Transfer Connection APIs with Status Tracking
9. Municipal Certificate APIs
10. PDS Grievance APIs

## Implementation Strategy:
- Add in-memory storage for features that need it (no DB migration required)
- Use consistent response format: `{ success: true, data: ..., message: ... }`
- All endpoints should be protected with JWT AuthGuard
