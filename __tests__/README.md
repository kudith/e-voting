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
# Jalankan hanya unit tests (20 tests)
npm run test:unit

# Jalankan hanya integration tests (15 tests)
npm run test:integration

# Jalankan unit tests dengan coverage (20 tests)
npm run test:unit:coverage

# Jalankan integration tests dengan coverage
npm run test:integration:coverage

# Jalankan unit tests dalam watch mode (20 tests)
npm run test:unit:watch

# Jalankan integration tests dalam watch mode (15 tests)
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
| `npm test`                          | Jalankan semua tests                        | 35        |
| `npm run test:coverage`             | Jalankan semua tests dengan coverage report | 35        |
| `npm run test:unit`                 | Jalankan hanya unit tests                   | 20        |
| `npm run test:integration`          | Jalankan hanya integration tests            | 15        |
| `npm run test:unit:coverage`        | Jalankan unit tests dengan coverage report  | 20        |
| `npm run test:integration:coverage` | Jalankan integration tests dengan coverage  | 15        |
| `npm run test:unit:watch`           | Jalankan unit tests dalam watch mode        | 20        |
| `npm run test:integration:watch`    | Jalankan integration tests dalam watch mode | 15        |

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

| No.          | Module                         | Test Cases   | Status |
| ------------ | ------------------------------ | ------------ | ------ |
| 1            | lib/encryption.js              | 6            | ✓      |
| 2            | lib/utils.js                   | 7            | ✓      |
| 3            | validations/voterSchema.js     | 2            | ✓      |
| 4            | validations/candidateSchema.js | 2            | ✓      |
| 5            | validations/electionSchema.js  | 2            | ✓      |
| 6            | generate-keys.js               | 1            | ✓      |
| **SUBTOTAL** | **6 Modules**                  | **20 Tests** | **✓**  |

### Integration Testing

Ringkasan jumlah test cases untuk integration tests (API routes & middleware):

| No.          | Module                             | Test Cases   | Status |
| ------------ | ---------------------------------- | ------------ | ------ |
| 1            | app/api/vote/submitVote/route.js   | 3            | ✓      |
| 2            | app/api/vote/countVotes/route.js   | 3            | ✓      |
| 3            | app/api/vote/verifyVote/route.js   | 2            | ✓      |
| 4            | middleware.js                      | 2            | ✓      |
| 5            | app/api/auth/succsess/route.js     | 3            | ✓      |
| 6            | app/api/voter/createVoter/route.js | 2            | ✓      |
| **SUBTOTAL** | **6 Modules**                      | **15 Tests** | **✓**  |

### Grand Total

| Type                | Modules | Test Cases | Status |
| ------------------- | ------- | ---------- | ------ |
| Unit Testing        | 6       | 20         | ✓      |
| Integration Testing | 6       | 15         | ✓      |
| **TOTAL**           | **12**  | **35**     | **✓**  |

## Test Categories

### A. Unit Testing

#### 1. Encryption Module (lib/encryption.js)

**Total: 6 test cases**

- ✅ `generateSecureHash()` produces deterministic SHA-512 hashes and validates formatting
- ✅ `verifyHash()` distinguishes genuine, tampered, and case-altered payloads
- ✅ `hybridEncrypt()` returns base64-encoded metadata (ciphertext, key, IV, auth tag)
- ✅ Round-trip encryption/decryption works for empty, JSON, and large payloads
- ✅ `hybridDecrypt()` throws when authentication data is tampered
- ✅ `generateAndReturnRSAKeys()` yields usable PEM key pairs for encryption workflows

#### 2. Utility Functions (lib/utils.js)

**Total: 7 test cases**

- ✅ `cn()` merges class names while ignoring falsy values
- ✅ `formatDate()` normalises Date objects and ISO strings with fallback handling
- ✅ `formatDateTime()` renders combined date and time strings
- ✅ `formatNumber()` applies Indonesian locale formatting with optional decimals
- ✅ `getTimeDifference()` returns readable ranges for days, hours, and minutes
- ✅ `timeRemaining()` reports future intervals or "Selesai" when expired
- ✅ `normalizeToArray()` extracts arrays from various API response shapes

#### 3. Voter Schema Validation (validations/voterSchema.js)

**Total: 2 test cases**

- ✅ Accepts valid voter payload and normalises phone numbers
- ✅ Rejects invalid submissions with detailed error messages

#### 4. Candidate Schema Validation (validations/candidateSchema.js)

**Total: 2 test cases**

- ✅ Accepts complete candidate payloads with nested collections
- ✅ Rejects submissions that violate constraints or URL formats

#### 5. Election Schema Validation (validations/electionSchema.js)

**Total: 2 test cases**

- ✅ Accepts valid election schedule and metadata
- ✅ Rejects invalid dates, unsupported statuses, and reversed time ranges

#### 6. RSA Key Generation Utility (generate-keys.js)

**Total: 1 test case**

- ✅ Generates and verifies RSA key pairs both with and without passphrase protection

---

### B. Integration Testing

#### 1. Vote Submission API (submitVote/route.js)

**Total: 3 test cases**

- ✅ Rejects incomplete payloads with detailed 400 responses
- ✅ Returns 404 when the referenced election cannot be found
- ✅ Accepts a valid submission, encrypts the vote, and updates statistics successfully

#### 2. Vote Counting API (countVotes/route.js)

**Total: 3 test cases**

- ✅ Validates missing `electionId` requests and responds with 400
- ✅ Handles unknown elections with a 404 response
- ✅ Processes uncounted votes end-to-end, including decryption and candidate tally updates

#### 3. Vote Verification API (verifyVote/route.js)

**Total: 2 test cases**

- ✅ Rejects verification attempts that omit `voteId` or `voteHash`
- ✅ Confirms a vote when the decrypted payload and provided hash match

#### 4. Authentication & Authorization Middleware (middleware.js)

**Total: 2 test cases**

- ✅ Allows admin users with the proper permission to access protected routes
- ✅ Redirects unauthenticated or unauthorized requests to `/unauthorized`

#### 5. Auth Success Callback API (auth/succsess/route.js)

**Total: 3 test cases**

- ✅ Redirects existing voters straight to the dashboard
- ✅ Creates a voter record when first-time users authenticate successfully
- ✅ Throws an error when the Kinde session does not return a valid user

#### 6. Create Voter API (voter/createVoter/route.js)

**Total: 2 test cases**

- ✅ Creates a voter, integrates with Kinde, and persists database records for valid payloads
- ✅ Surfaces Zod validation errors for malformed submissions

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
