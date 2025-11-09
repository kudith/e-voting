# Test Suite Documentation - SIPILIH E-Voting System

Dokumentasi lengkap untuk test suite Priority Level 1 aplikasi SIPILIH (Next.js + API Routes).

## Daftar Isi

- [Overview](#overview)
- [Test Coverage](#test-coverage)
- [Setup & Installation](#setup--installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Testing Best Practices](#testing-best-practices)

## Overview

Test suite ini dirancang untuk memastikan keamanan dan fungsionalitas modul-modul kritis aplikasi SIPILIH dengan target coverage **≥90%**.

### Priority Level 1 Modules

1. **lib/encryption.js** - Core security (hashing, encryption/decryption)
2. **app/api/vote/submitVote/route.js** - Vote submission API
3. **app/api/vote/countVotes/route.js** - Vote counting API
4. **app/api/vote/verifyVote/route.js** - Vote verification API
5. **middleware.js** - Authentication & authorization
6. **app/api/auth/succsess/route.js** - Auth success callback
7. **app/api/voter/createVoter/route.js** - Voter creation API

## Test Coverage

### Target Coverage: ≥90%

| Module                 | Lines | Functions | Branches | Statements |
| ---------------------- | ----- | --------- | -------- | ---------- |
| lib/encryption.js      | 90%+  | 90%+      | 90%+     | 90%+       |
| submitVote/route.js    | 90%+  | 90%+      | 90%+     | 90%+       |
| countVotes/route.js    | 90%+  | 90%+      | 90%+     | 90%+       |
| verifyVote/route.js    | 90%+  | 90%+      | 90%+     | 90%+       |
| middleware.js          | 90%+  | 90%+      | 90%+     | 90%+       |
| auth/succsess/route.js | 90%+  | 90%+      | 90%+     | 90%+       |
| createVoter/route.js   | 90%+  | 90%+      | 90%+     | 90%+       |

## Setup & Installation

### 1. Install Dependencies

```bash
npm install --save-dev jest @testing-library/jest-dom @testing-library/react babel-jest @babel/preset-env @babel/preset-react
```

### 2. Environment Setup

Pastikan file `.env.test` sudah dikonfigurasi:

```env
NODE_ENV=test
RSA_PASSPHRASE=test-passphrase-for-jest
DATABASE_URL=mongodb://localhost:27017/test-db
```

### 3. Verify Installation

```bash
npm test -- --version
```

## Running Tests

### Run All Tests

```bash
# Jalankan semua tests (unit + integration)
npm test

# Jalankan semua tests dengan coverage
npm run test:coverage
```

### Run Tests by Category

```bash
# Jalankan hanya unit tests (286 tests)
npm run test:unit

# Jalankan hanya integration tests (120 tests)
npm run test:integration

# Jalankan unit tests dengan coverage
npm run test:unit:coverage

# Jalankan integration tests dengan coverage
npm run test:integration:coverage

# Jalankan unit tests dalam watch mode
npm run test:unit:watch

# Jalankan integration tests dalam watch mode
npm run test:integration:watch
```

### Run Specific Test Suite

#### Unit Tests

```bash
# Unit tests untuk encryption
npm test -- __tests__/lib/encryption.test.js

# Unit tests untuk utils
npm test -- __tests__/lib/utils.test.js

# Unit tests untuk RSA key generation
npm test -- __tests__/generate-keys.test.js

# Unit tests untuk voter schema
npm test -- __tests__/validations/voterSchema.test.js

# Unit tests untuk candidate schema
npm test -- __tests__/validations/candidateSchema.test.js

# Unit tests untuk election schema
npm test -- __tests__/validations/electionSchema.test.js

# Semua validation tests sekaligus
npm test -- __tests__/validations/

# Semua lib tests sekaligus
npm test -- __tests__/lib/
```

#### Integration Tests

```bash
# Integration tests untuk submitVote
npm test -- __tests__/api/vote/submitVote.test.js

# Integration tests untuk countVotes
npm test -- __tests__/api/vote/countVotes.test.js

# Integration tests untuk verifyVote
npm test -- __tests__/api/vote/verifyVote.test.js

# Tests untuk middleware
npm test -- __tests__/middleware.test.js

# Tests untuk auth success
npm test -- __tests__/api/auth/authSuccess.test.js

# Tests untuk create voter
npm test -- __tests__/api/voter/createVoter.test.js

# Semua API tests sekaligus
npm test -- __tests__/api/
```

### Additional Test Options

```bash
# Run tests in watch mode
npm test -- --watch

# Run tests with verbose output
npm test -- --verbose

# Run specific test case by name
npm test -- -t "should encrypt data successfully"
```

## Test Scripts Reference

| Script                              | Description                                 | Tests Run |
| ----------------------------------- | ------------------------------------------- | --------- |
| `npm test`                          | Jalankan semua tests                        | 406       |
| `npm run test:coverage`             | Jalankan semua tests dengan coverage report | 406       |
| `npm run test:unit`                 | Jalankan hanya unit tests                   | 286       |
| `npm run test:integration`          | Jalankan hanya integration tests            | 120       |
| `npm run test:unit:coverage`        | Jalankan unit tests dengan coverage report  | 286       |
| `npm run test:integration:coverage` | Jalankan integration tests dengan coverage  | 120       |
| `npm run test:unit:watch`           | Jalankan unit tests dalam watch mode        | 286       |
| `npm run test:integration:watch`    | Jalankan integration tests dalam watch mode | 120       |

## Test Structure

```
__tests__/
├── lib/
│   ├── encryption.test.js        # Unit tests untuk encryption module
│   └── utils.test.js             # Unit tests untuk utility functions
├── validations/
│   ├── voterSchema.test.js       # Unit tests untuk voter schema validation
│   ├── candidateSchema.test.js   # Unit tests untuk candidate schema validation
│   └── electionSchema.test.js    # Unit tests untuk election schema validation
├── api/
│   ├── auth/
│   │   └── authSuccess.test.js   # Integration tests untuk auth success callback
│   ├── voter/
│   │   └── createVoter.test.js   # Integration tests untuk create voter API
│   └── vote/
│       ├── submitVote.test.js    # Integration tests untuk submit vote
│       ├── countVotes.test.js    # Integration tests untuk count votes
│       └── verifyVote.test.js    # Integration tests untuk verify vote
├── middleware.test.js            # Integration tests untuk authentication/authorization
├── generate-keys.test.js         # Unit tests untuk RSA key generation utility
├── setup/
│   ├── prisma-mock.js           # Mock utilities untuk Prisma
│   └── kinde-mock.js            # Mock utilities untuk Kinde Auth
└── README.md                     # Dokumentasi ini
```

## Test Summary

### Unit Testing

Ringkasan jumlah test cases untuk unit tests:

| No.          | Module                         | Test Cases    | Status |
| ------------ | ------------------------------ | ------------- | ------ |
| 1            | lib/encryption.js              | 35            | ✓      |
| 2            | lib/utils.js                   | 65            | ✓      |
| 3            | validations/voterSchema.js     | 36            | ✓      |
| 4            | validations/candidateSchema.js | 62            | ✓      |
| 5            | validations/electionSchema.js  | 46            | ✓      |
| 6            | generate-keys.js               | 42            | ✓      |
| **SUBTOTAL** | **6 Modules**                  | **286 Tests** | **✓**  |

### Integration Testing

Ringkasan jumlah test cases untuk integration tests (API routes & middleware):

| No.          | Module                             | Test Cases    | Status |
| ------------ | ---------------------------------- | ------------- | ------ |
| 1            | app/api/vote/submitVote/route.js   | 14            | ✓      |
| 2            | app/api/vote/countVotes/route.js   | 18            | ✓      |
| 3            | app/api/vote/verifyVote/route.js   | 22            | ✓      |
| 4            | middleware.js                      | 34            | ✓      |
| 5            | app/api/auth/succsess/route.js     | 11            | ✓      |
| 6            | app/api/voter/createVoter/route.js | 21            | ✓      |
| **SUBTOTAL** | **6 Modules**                      | **120 Tests** | **✓**  |

### Grand Total

| Type                | Modules | Test Cases | Status |
| ------------------- | ------- | ---------- | ------ |
| Unit Testing        | 6       | 286        | ✓      |
| Integration Testing | 6       | 120        | ✓      |
| **TOTAL**           | **12**  | **406**    | **✓**  |

## Test Categories

### A. Unit Testing

#### 1. Encryption Module (lib/encryption.js)

**Total: 35 test cases**

**Secure Hashing Functions (7 tests)**

- ✅ Hash consistency
- ✅ Hash uniqueness
- ✅ Hash format validation
- ✅ Empty string handling
- ✅ Large data handling
- ✅ Special characters
- ✅ Unicode handling

**Hash Verification (5 tests)**

- ✅ Valid hash verification
- ✅ Invalid hash rejection
- ✅ Tampered data detection
- ✅ Empty data verification
- ✅ Case sensitivity

**Hybrid Encryption (8 tests)**

- ✅ Successful encryption
- ✅ Encrypted data validation
- ✅ Nonce uniqueness
- ✅ Empty string encryption
- ✅ Large data encryption
- ✅ JSON data encryption
- ✅ Special characters
- ✅ Unicode encryption

**Hybrid Decryption (9 tests)**

- ✅ Round-trip encryption/decryption
- ✅ Complex JSON data
- ✅ Empty string round-trip
- ✅ Large data round-trip
- ✅ Invalid key detection
- ✅ Tampered data detection
- ✅ Invalid IV detection
- ✅ Invalid auth tag detection
- ✅ Missing parameters

**RSA Key Generation (3 tests)**

- ✅ Valid key pair generation
- ✅ Generated keys usability
- ✅ Key uniqueness

**Integration Tests (3 tests)**

- ✅ Complete vote encryption flow
- ✅ Tampering detection
- ✅ Multiple votes handling

#### 2. Utility Functions (lib/utils.js)

**Total: 65 test cases**

**cn() - Class Name Utility (5 tests)**

- ✅ Merge class names correctly
- ✅ Handle conditional classes
- ✅ Merge Tailwind classes correctly
- ✅ Handle empty input
- ✅ Handle undefined and null

**formatDate() - Date Formatting (8 tests)**

- ✅ Format valid Date object
- ✅ Format valid date string
- ✅ Handle null/undefined/empty date
- ✅ Handle invalid date string
- ✅ Apply custom options
- ✅ Handle different date formats

**formatDateTime() - Date Time Formatting (7 tests)**

- ✅ Format valid Date object with time
- ✅ Format valid date string with time
- ✅ Handle null/undefined/empty date
- ✅ Handle invalid date string
- ✅ Include both date and time components

**formatNumber() - Number Formatting (9 tests)**

- ✅ Format integer with thousand separator
- ✅ Format large numbers
- ✅ Handle zero, negative numbers
- ✅ Handle null/undefined
- ✅ Handle decimal numbers with custom options
- ✅ Handle very large and small numbers

**getTimeDifference() - Time Difference Calculation (11 tests)**

- ✅ Calculate days, hours, minutes difference
- ✅ Handle very short time difference
- ✅ Handle null values
- ✅ Handle invalid dates
- ✅ Handle days and hours combination
- ✅ Handle hours and minutes combination
- ✅ Handle negative time difference

**timeRemaining() - Time Remaining Calculation (9 tests)**

- ✅ Calculate days/hours remaining for future date
- ✅ Return "Selesai" for past date
- ✅ Handle null/undefined/empty string
- ✅ Handle invalid date string
- ✅ Handle date string format

**normalizeToArray() - Data Normalization (16 tests)**

- ✅ Return array as-is
- ✅ Extract array from object with specified key
- ✅ Extract from common keys (elections, candidates, voters, data, items, results)
- ✅ Return empty array for null/undefined
- ✅ Handle empty objects and arrays
- ✅ Handle nested objects
- ✅ Prioritize specified key over common keys

#### 3. Voter Schema Validation (validations/voterSchema.js)

**Total: 36 test cases**

**Valid Voter Data (4 tests)**

- ✅ Validate correct voter data
- ✅ Validate phone starting with +62
- ✅ Validate minimum/maximum length phone

**Full Name Validation (4 tests)**

- ✅ Reject empty/missing name
- ✅ Reject name exceeding 100 characters
- ✅ Accept valid name lengths
- ✅ Accept name with special characters

**Email Validation (5 tests)**

- ✅ Reject invalid email format
- ✅ Reject email without domain or @
- ✅ Accept valid email with subdomain
- ✅ Accept email with plus sign

**Faculty and Major Validation (4 tests)**

- ✅ Reject empty/missing facultyId
- ✅ Reject empty/missing majorId

**Year Validation (5 tests)**

- ✅ Reject empty year
- ✅ Reject year not 4 digits
- ✅ Reject year with non-numeric characters
- ✅ Accept valid 4-digit year

**Phone Number Validation (10 tests)**

- ✅ Reject empty phone
- ✅ Reject phone not starting with 0 or +62
- ✅ Reject phone with invalid length (< 10 or > 15 digits)
- ✅ Reject phone with non-numeric characters
- ✅ Transform phone starting with 0 to +62
- ✅ Not transform phone already starting with +62
- ✅ Accept various valid phone formats

**Status Validation (3 tests)**

- ✅ Reject empty/missing status
- ✅ Accept any non-empty status string

**Missing Required Fields (2 tests)**

- ✅ Reject data with missing fields
- ✅ List all missing fields in error

#### 4. Candidate Schema Validation (validations/candidateSchema.js)

**Total: 62 test cases**

**Valid Candidate Data (4 tests)**

- ✅ Validate complete candidate data
- ✅ Validate minimal required fields only
- ✅ Validate with empty/undefined optional fields

**Name, Photo, Vision, Mission, ShortBio Validation (25 tests)**

- ✅ Reject invalid lengths (min/max)
- ✅ Accept exact boundary lengths
- ✅ Reject empty/missing required fields
- ✅ Validate photo URL format

**Details Validation (6 tests)**

- ✅ Accept empty details (optional)
- ✅ Reject details less than 10 or more than 2000 characters
- ✅ Accept undefined details

**Social Media Validation (5 tests)**

- ✅ Accept valid social media URLs
- ✅ Reject invalid URLs
- ✅ Accept empty string for optional fields
- ✅ Accept partial social media URLs

**Education, Experience, Achievements, Programs Arrays (13 tests)**

- ✅ Accept valid arrays
- ✅ Accept empty arrays
- ✅ Reject items with missing required fields
- ✅ Validate all array item fields

**Stats Validation (6 tests)**

- ✅ Accept valid stats (0-100 range)
- ✅ Reject stats < 0 or > 100
- ✅ Use default values when not provided

**Missing Required Fields (3 tests)**

- ✅ Reject data with missing fields
- ✅ List all missing required fields

#### 5. Election Schema Validation (validations/electionSchema.js)

**Total: 46 test cases**

**Valid Election Data (5 tests)**

- ✅ Validate correct election data
- ✅ Validate all status values (ongoing, completed, upcoming)
- ✅ Validate same day start and end dates

**Title Validation (6 tests)**

- ✅ Reject empty/missing title
- ✅ Reject title exceeding 100 characters
- ✅ Accept valid title lengths (1-100 characters)
- ✅ Accept title with special characters

**Description Validation (6 tests)**

- ✅ Reject description less than 10 or more than 500 characters
- ✅ Accept exact boundary lengths (10, 500)
- ✅ Reject empty/missing description

**Start Date Validation (6 tests)**

- ✅ Reject empty/missing startDate
- ✅ Reject invalid startDate format
- ✅ Accept ISO 8601, simple date format (YYYY-MM-DD)
- ✅ Accept date with time

**End Date Validation (6 tests)**

- ✅ Reject empty/missing endDate
- ✅ Reject invalid endDate format
- ✅ Reject endDate before startDate
- ✅ Accept endDate equal to or after startDate

**Status Validation (5 tests)**

- ✅ Reject invalid status
- ✅ Reject empty/missing status
- ✅ Reject case-sensitive invalid status
- ✅ Accept all valid status values (ongoing, completed, upcoming)

**Date Range Validation (5 tests)**

- ✅ Validate endDate >= startDate
- ✅ Handle time components in date comparison
- ✅ Accept long duration elections

**Missing Required Fields (3 tests)**

- ✅ Reject data with missing fields
- ✅ List all missing fields in error

**Edge Cases (4 tests)**

- ✅ Handle very long election duration
- ✅ Handle minimal valid duration
- ✅ Handle dates in different formats
- ✅ Handle timezone differences

#### 6. RSA Key Generation Utility (generate-keys.js)

**Total: 42 test cases**

**getPassphrase() (3 tests)**

- ✅ Return passphrase from environment variable when set
- ✅ Use default passphrase when environment variable is not set
- ✅ Handle empty string passphrase from environment

**generateRSAKeysWithPassphrase() (5 tests)**

- ✅ Generate RSA key pair with passphrase
- ✅ Use 2048 bit modulus length
- ✅ Use correct key encoding for public key
- ✅ Use correct key encoding for private key with cipher
- ✅ Return object with publicKey, privateKey, and passphrase

**generateRSAKeysWithoutPassphrase() (3 tests)**

- ✅ Generate RSA key pair without passphrase
- ✅ Not include cipher in private key encoding
- ✅ Return object with only publicKey and privateKey

**formatForEnv() (6 tests)**

- ✅ Replace newlines with \n
- ✅ Handle key with multiple newlines
- ✅ Handle key with no newlines
- ✅ Handle empty string
- ✅ Handle key with only newlines
- ✅ Preserve other special characters

**verifyKeys() (8 tests)**

- ✅ Successfully verify keys with passphrase
- ✅ Include passphrase when verifying keys with passphrase
- ✅ Not include passphrase when verifying keys without passphrase
- ✅ Use correct padding and hash algorithm
- ✅ Handle encryption error
- ✅ Handle decryption error
- ✅ Verify decrypted data matches original
- ✅ Detect when decrypted data does not match original

**saveKeysToFiles() (9 tests)**

- ✅ Create keys directory if it does not exist
- ✅ Not create directory if it already exists
- ✅ Save public key with -with-passphrase suffix
- ✅ Save public key with -no-passphrase suffix
- ✅ Save private key with correct permissions (0o600)
- ✅ Save public key with readable permissions (0o644)
- ✅ Save both public and private keys
- ✅ Handle file write errors
- ✅ Use correct file paths

**Edge Cases (4 tests)**

- ✅ Handle very long passphrase
- ✅ Handle passphrase with special characters
- ✅ Handle passphrase with unicode characters
- ✅ Handle format conversion for very long keys

**Integration Scenarios (4 tests)**

- ✅ Generate different keys on each call
- ✅ Maintain key format consistency
- ✅ Handle complete key generation workflow with passphrase
- ✅ Handle complete key generation workflow without passphrase

---

### B. Integration Testing

#### 1. Vote Submission API (submitVote/route.js)

**Total: 14 test cases**

**Valid Vote Submission (3 tests)**

- ✅ Successful vote submission
- ✅ Proper encryption
- ✅ Statistics update

**Election Validation (3 tests)**

- ✅ Election not found
- ✅ Election not started
- ✅ Election ended

**Duplicate Vote Prevention (2 tests)**

- ✅ Prevent duplicate votes
- ✅ Allow different voters

**Voter Eligibility (2 tests)**

- ✅ Ineligible voter rejection
- ✅ Unregistered voter rejection

**Error Handling (3 tests)**

- ✅ Database errors
- ✅ Invalid JSON
- ✅ Transaction failures

**Hash Consistency (1 test)**

- ✅ Consistent hash generation

#### 2. Vote Counting API (countVotes/route.js)

**Total: 18 test cases**

**Successful Vote Counting (3 tests)**

- ✅ Count votes for completed election
- ✅ No uncounted votes
- ✅ Multiple votes for same candidate

**Validation Errors (4 tests)**

- ✅ Missing electionId
- ✅ Election not found
- ✅ Election not completed
- ✅ Election status upcoming

**Decryption and Data Integrity (3 tests)**

- ✅ Successful decryption
- ✅ Corrupted vote handling
- ✅ Vote details extraction

**Vote Status Update (1 test)**

- ✅ Mark votes as counted

**Candidate Vote Count Update (1 test)**

- ✅ Increment candidate counts

**Error Handling (3 tests)**

- ✅ Database errors
- ✅ Invalid JSON
- ✅ Vote query errors

**Edge Cases (3 tests)**

- ✅ Empty election ID
- ✅ Null election ID
- ✅ Large number of votes

#### 3. Vote Verification API (verifyVote/route.js)

**Total: 22 test cases**

**Successful Vote Verification (3 tests)**

- ✅ Verify with correct hash
- ✅ Verify counted vote
- ✅ Verify uncounted vote

**Missing Required Fields (3 tests)**

- ✅ Missing voteId
- ✅ Missing voteHash
- ✅ Both fields missing

**Vote Not Found (1 test)**

- ✅ Nonexistent vote ID

**Invalid Hash Detection (3 tests)**

- ✅ Incorrect hash
- ✅ Tampered data detection
- ✅ Invalid hash format

**Decryption Errors (3 tests)**

- ✅ Corrupted encrypted data
- ✅ Invalid encrypted key
- ✅ Modified auth tag

**Error Handling (2 tests)**

- ✅ Database errors
- ✅ Invalid JSON

**Complete Verification Flow (2 tests)**

- ✅ End-to-end verification
- ✅ Multiple verifications

**Edge Cases (4 tests)**

- ✅ Empty string voteId
- ✅ Empty string voteHash
- ✅ Very long voteId
- ✅ Special characters

**Hash Algorithm Verification (1 test)**

- ✅ SHA-512 usage verification

#### 4. Authentication & Authorization Middleware (middleware.js)

**Total: 34 test cases**

**Admin Route Access Control (7 tests)**

- ✅ Valid admin access
- ✅ /admin to /admin/dashboard redirect
- ✅ Unauthenticated user denial
- ✅ Non-admin user denial
- ✅ Admin without permission denial
- ✅ Partial admin denial
- ✅ Nested admin routes

**Voter Route Access Control (6 tests)**

- ✅ Valid voter access
- ✅ /voter to /voter/dashboard redirect
- ✅ Unauthenticated user denial
- ✅ Non-voter user denial
- ✅ User with no roles
- ✅ Nested voter routes

**Role Separation (3 tests)**

- ✅ Admin cannot access voter routes
- ✅ Voter cannot access admin routes
- ✅ User with both roles

**Edge Cases (6 tests)**

- ✅ Null user object
- ✅ Empty roles array
- ✅ Undefined roles
- ✅ Case sensitivity
- ✅ Trailing slash
- ✅ Very long pathname

**Permission Variations (3 tests)**

- ✅ Multiple permissions
- ✅ Empty permissions array
- ✅ Undefined permissions

**Authentication State Changes (2 tests)**

- ✅ Auth check failure
- ✅ Authentication returns false

**Multiple Role Scenarios (2 tests)**

- ✅ User with multiple roles including admin
- ✅ User with multiple non-admin roles

**Redirect Behavior (3 tests)**

- ✅ /admin to /admin/dashboard
- ✅ /voter to /voter/dashboard
- ✅ Unauthorized redirect

**Config Matcher Verification (2 tests)**

- ✅ Base paths handling
- ✅ Nested paths handling

#### 5. Auth Success Callback API (auth/succsess/route.js)

**Total: 11 test cases**

**Successful Authentication (4 tests)**

- ✅ Create new voter if user doesn't exist
- ✅ Return existing voter if user already exists
- ✅ Handle user with null given_name
- ✅ Handle user with null email

**Authentication Failures (3 tests)**

- ✅ Throw error when user is null
- ✅ Throw error when user has no id
- ✅ Throw error when user is undefined

**Database Errors (2 tests)**

- ✅ Propagate error when findUnique fails
- ✅ Propagate error when create fails

**Edge Cases (2 tests)**

- ✅ Handle empty string values in user data
- ✅ Handle concurrent calls gracefully

#### 6. Create Voter API (voter/createVoter/route.js)

**Total: 21 test cases**

**Successful Voter Creation (4 tests)**

- ✅ Create voter successfully with valid data
- ✅ Transform phone number starting with 0 to +62
- ✅ Keep phone number starting with +62
- ✅ Generate correct voter code

**Validation Errors (6 tests)**

- ✅ Return 400 for invalid email
- ✅ Return 400 for name too short
- ✅ Return 400 for invalid phone number
- ✅ Return 400 for invalid year format
- ✅ Return 400 for invalid status
- ✅ Return 400 for missing required fields

**Faculty and Major Validation (3 tests)**

- ✅ Return 400 when faculty not found
- ✅ Return 400 when major not found
- ✅ Return 400 when major does not belong to faculty

**Kinde API Integration (3 tests)**

- ✅ Handle Kinde API USER_ALREADY_EXISTS error
- ✅ Handle Kinde API generic error
- ✅ Send correct data to Kinde API

**Database Errors (2 tests)**

- ✅ Handle database connection error
- ✅ Handle voter creation error in database

**Edge Cases (3 tests)**

- ✅ Handle very long faculty and major names in voter code
- ✅ Handle inactive status
- ✅ Handle large voter count for code generation

---

## Testing Best Practices

### 1. Test Organization

Setiap test suite diorganisir dengan struktur:

```javascript
describe("Module Name", () => {
  describe("Feature/Function", () => {
    test("should do something specific", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 2. AAA Pattern (Arrange-Act-Assert)

```javascript
test("should encrypt data successfully", () => {
  // Arrange: Setup test data
  const testData = "secret-vote-data";

  // Act: Execute the function
  const encrypted = hybridEncrypt(testData);

  // Assert: Verify results
  expect(encrypted).toHaveProperty("encryptedData");
});
```

### 3. Mock Data

Gunakan mock utilities yang telah disediakan:

```javascript
import {
  createMockElection,
  createMockVoter,
} from "@/__tests__/setup/prisma-mock";

const mockElection = createMockElection({
  status: "ongoing",
});
```

### 4. Test Isolation

Setiap test harus independen:

```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 5. Descriptive Test Names

Gunakan nama test yang jelas dan deskriptif:

```javascript
// ❌ Bad
test("test hash", () => {});

// ✅ Good
test("should generate consistent hash for same data", () => {});
```

## Troubleshooting

### Issue: Tests Failing Due to RSA Keys

**Solution:** Pastikan environment variable `RSA_PASSPHRASE` sudah di-set.

```bash
export RSA_PASSPHRASE=test-passphrase-for-jest
```

### Issue: MongoDB Connection Errors

**Solution:** Mock sudah menghandle ini, tapi pastikan `DATABASE_URL` di `.env.test` tidak mengarah ke database production.

### Issue: Coverage Tidak Mencapai 90%

**Solution:** Jalankan coverage report untuk melihat bagian yang belum tercover:

```bash
npm test -- --coverage --verbose
```

## Coverage Reports

Coverage reports akan di-generate di folder `coverage/`:

```bash
coverage/
├── lcov-report/
│   └── index.html      # HTML coverage report
├── lcov.info          # LCOV format
└── coverage-final.json # JSON format
```

Buka `coverage/lcov-report/index.html` di browser untuk melihat visual coverage report.

## Testing Checklist

Sebelum commit, pastikan:

- [ ] Semua tests passing (`npm test`)
- [ ] Coverage ≥90% untuk semua Priority Level 1 modules
- [ ] Tidak ada console.error di output test
- [ ] Semua edge cases sudah di-cover
- [ ] Mock data konsisten dengan schema Prisma
- [ ] Test names deskriptif dan jelas

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://testingjavascript.com/)

## Contributing

Untuk menambah test baru:

1. Ikuti struktur folder yang ada
2. Gunakan naming convention: `*.test.js`
3. Pastikan coverage tetap ≥90%
4. Tambahkan komentar untuk test kompleks
5. Update dokumentasi ini jika perlu

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Maintained by:** SIPILIH Development Team
