# Cypress Testing Documentation - SiPilih E-Voting

## 📋 Overview

Comprehensive testing suite untuk aplikasi e-voting SiPilih yang mencakup **Functional Testing** dan **System Testing**.

## 🗂️ Test Structure

```
cypress/
├── e2e/
│   ├── 01-homepage.cy.js          # Homepage & Landing Page Tests
│   ├── 02-how-to-vote.cy.js       # How to Vote Page Tests
│   ├── 03-authentication.cy.js    # Authentication Flow Tests
│   ├── 04-api-integration.cy.js   # API Integration Tests
│   ├── 05-voter-dashboard.cy.js   # Voter Dashboard Tests
│   ├── 06-voting-process.cy.js    # Complete Voting Process Tests
│   ├── 07-admin-dashboard.cy.js   # Admin Dashboard Tests
│   ├── 08-results-display.cy.js   # Results Display Tests
│   ├── 09-security-tests.cy.js    # Security & Encryption Tests
│   └── 10-end-to-end.cy.js        # Complete E2E System Tests
├── fixtures/
│   ├── elections.json             # Test election data
│   ├── candidates.json            # Test candidate data
│   ├── voters.json                # Test voter data
│   ├── votes.json                 # Test vote data
│   ├── votingRights.json          # Test voting rights data
│   ├── results.json               # Test results data
│   └── users.json                 # Test user data
├── support/
│   ├── commands.js                # Custom Cypress commands
│   ├── helpers.js                 # Helper functions
│   └── support.js                 # Global configuration
├── cypress.config.js              # Cypress configuration
└── cypress.env.json               # Environment variables
```

## 🧪 Test Categories

### 1. Functional Testing

#### Homepage Tests (`01-homepage.cy.js`)
- ✅ Page loading and rendering
- ✅ Hero section display
- ✅ Navigation functionality
- ✅ Elections section
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Performance metrics

#### Authentication Tests (`03-authentication.cy.js`)
- ✅ Login flow with Kinde OAuth
- ✅ Protected route access
- ✅ Session management
- ✅ Logout functionality
- ✅ Role-based access control

#### Voter Dashboard Tests (`05-voter-dashboard.cy.js`)
- ✅ Dashboard access and loading
- ✅ Active elections display
- ✅ Voting rights verification
- ✅ Navigation between pages
- ✅ Performance and responsiveness

#### Voting Process Tests (`06-voting-process.cy.js`)
- ✅ Vote page access
- ✅ Candidate selection
- ✅ Vote submission
- ✅ Vote encryption
- ✅ Post-voting verification
- ✅ Double voting prevention
- ✅ Error handling

#### Admin Dashboard Tests (`07-admin-dashboard.cy.js`)
- ✅ Admin access and permissions
- ✅ Election management (CRUD)
- ✅ Candidate management
- ✅ Voter management
- ✅ Voting rights management
- ✅ Real-time monitoring
- ✅ Statistics display

#### Results Display Tests (`08-results-display.cy.js`)
- ✅ Results page access
- ✅ Vote count display
- ✅ Charts and visualizations
- ✅ Results filtering
- ✅ Export functionality
- ✅ Real-time updates

### 2. System Testing

#### API Integration Tests (`04-api-integration.cy.js`)
- ✅ API endpoint availability
- ✅ Response format validation
- ✅ Error handling
- ✅ Performance testing
- ✅ Concurrent requests

#### Security Tests (`09-security-tests.cy.js`)
- ✅ Authentication security
- ✅ Role-based access control (RBAC)
- ✅ Vote encryption (AES-256-GCM + RSA-4096)
- ✅ Data integrity (SHA-256 hashing)
- ✅ SQL injection prevention
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Session management
- ✅ Audit trail

#### End-to-End System Tests (`10-end-to-end.cy.js`)
- ✅ Complete voter journey
- ✅ Complete admin workflow
- ✅ Multi-user concurrent voting
- ✅ Full system integration
- ✅ Performance under load
- ✅ Error recovery
- ✅ Data consistency
- ✅ Regression test suite

## 🚀 Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Ensure app is running
npm run dev
```

### Run All Tests
```bash
# Open Cypress UI
npx cypress open

# Run all tests headlessly
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/01-homepage.cy.js"

# Run with specific browser
npx cypress run --browser chrome
```

### Run Test Categories
```bash
# Functional tests only
npx cypress run --spec "cypress/e2e/0[1-8]*.cy.js"

# Security tests
npx cypress run --spec "cypress/e2e/09-security-tests.cy.js"

# E2E system tests
npx cypress run --spec "cypress/e2e/10-end-to-end.cy.js"
```

## 🔧 Configuration

### Environment Variables (`cypress.env.json`)
**Penting**: Sistem menggunakan **username dan password**, bukan email!

```json
{
  "ADMIN_USERNAME": "admin_farid",
  "ADMIN_PASSWORD": "fredo931",
  "VOTER_USERNAME": "admin_farid",
  "VOTER_PASSWORD": "fredo931",
  "TEST_USER_USERNAME": "testuser",
  "TEST_USER_PASSWORD": "TestPassword123!"
}
```

### Cypress Configuration (`cypress.config.js`)
- Base URL: `http://localhost:3000`
- Viewport: 1280x720
- Video recording: Enabled
- Screenshots on failure: Enabled
- Request timeout: 10000ms

## 📝 Custom Commands

### Authentication
```javascript
cy.loginAsVoter()           // Login sebagai voter
cy.loginAsAdmin()           // Login sebagai admin
cy.logout()                 // Logout
```

### API Testing
```javascript
cy.apiRequest('GET', '/election/getAllElections')
cy.mockElections()          // Mock election data
cy.mockCandidates()         // Mock candidate data
cy.mockVoteSubmission()     // Mock vote submission
```

### Voting
```javascript
cy.castVote(candidateId, electionId)
cy.verifyVoteReceipt()
cy.checkElectionStatus(electionId)
cy.getElectionResults(electionId)
```

### Utilities
```javascript
cy.waitForPageLoad()
cy.setupTestEnvironment()
cy.clearTestData()
cy.interceptAllApis()
cy.testResponsive(callback)
```

## 📊 Test Coverage

### Functional Coverage
- ✅ User Interface (UI)
- ✅ Navigation
- ✅ Forms & Validation
- ✅ User Workflows
- ✅ CRUD Operations

### System Coverage
- ✅ API Endpoints
- ✅ Database Operations
- ✅ Authentication & Authorization
- ✅ Security Measures
- ✅ Performance
- ✅ Error Handling
- ✅ Integration Points

### Security Coverage
- ✅ Encryption (AES-256-GCM + RSA-4096)
- ✅ Hashing (SHA-256)
- ✅ Input Validation
- ✅ SQL Injection Protection
- ✅ XSS Protection
- ✅ CSRF Protection
- ✅ Session Security
- ✅ Access Control

## 🎯 Test Scenarios

### Voter Flow
1. Visit homepage
2. Login as voter
3. Access dashboard
4. View available elections
5. Navigate to voting page
6. Select candidate
7. Submit vote (with encryption)
8. Verify vote receipt
9. View results

### Admin Flow
1. Login as admin
2. Access admin dashboard
3. Create/manage elections
4. Add/manage candidates
5. Manage voter list
6. Assign voting rights
7. Monitor real-time votes
8. View statistics

## 📈 Performance Metrics

Tests include performance monitoring for:
- Page load time (< 5 seconds)
- API response time (< 3 seconds)
- Vote submission time (< 15 seconds)
- Results loading time

## 🐛 Debugging

### View Test Results
```bash
# Open Cypress with interactive mode
npx cypress open

# Generate video on failure
npx cypress run --config video=true

# Keep browser open on failure
npx cypress run --headed --no-exit
```

### Common Issues
1. **Kinde OAuth**: Ensure `KINDE_ISSUER_URL` is correct
2. **Database**: Ensure database is seeded with test data
3. **Session**: Clear cookies if tests fail unexpectedly

## 🔐 Security Testing Notes

- Vote encryption is verified in each submission
- SHA-256 hashes are checked for integrity
- Role-based access is tested comprehensively
- SQL injection and XSS attacks are simulated

## 📋 Test Reports

After running tests, view reports:
- Videos: `cypress/videos/`
- Screenshots: `cypress/screenshots/`
- HTML Report: Install `cypress-mochawesome-reporter`

## 🚦 CI/CD Integration

Add to your CI pipeline:
```yaml
# Example GitHub Actions
- name: Run Cypress Tests
  run: npx cypress run
  env:
    ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
    ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

## 📚 Best Practices

1. ✅ Clear test data before each test
2. ✅ Use fixtures for consistent test data
3. ✅ Mock external dependencies
4. ✅ Test both success and failure scenarios
5. ✅ Verify security measures
6. ✅ Test responsive design
7. ✅ Monitor performance
8. ✅ Use descriptive test names

## 🎓 Learning Resources

- [Cypress Documentation](https://docs.cypress.io)
- [E-Voting Security Best Practices](https://www.example.com)
- [Testing Encrypted Systems](https://www.example.com)

## 📞 Support

Untuk pertanyaan atau issues:
- Create GitHub issue
- Contact development team
- Check documentation

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Maintained by**: SiPilih Development Team
