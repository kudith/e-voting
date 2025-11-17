// ***********************************************
// Helper functions untuk Cypress tests
// ***********************************************

/**
 * Generate random test data
 */
export const generateTestData = {
  email: () => `test${Date.now()}@example.com`,
  nim: () => Math.floor(1000000000 + Math.random() * 9000000000).toString(),
  name: () => `Test User ${Date.now()}`,
  electionTitle: () => `Test Election ${Date.now()}`,
  
  election: () => ({
    title: generateTestData.electionTitle(),
    description: 'Test election description',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
    facultyId: 1
  }),
  
  candidate: (electionId) => ({
    name: generateTestData.name(),
    number: Math.floor(Math.random() * 10) + 1,
    visionMission: 'Test vision and mission',
    electionId: electionId || 1
  }),
  
  voter: () => ({
    email: generateTestData.email(),
    name: generateTestData.name(),
    nim: generateTestData.nim(),
    facultyId: 1,
    majorId: 1
  })
};

/**
 * Date helpers
 */
export const dateHelpers = {
  isActive: (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  },
  
  isPast: (endDate) => {
    return new Date() > new Date(endDate);
  },
  
  isFuture: (startDate) => {
    return new Date() < new Date(startDate);
  },
  
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('id-ID');
  },
  
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString();
  }
};

/**
 * Validation helpers
 */
export const validators = {
  isValidEmail: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  isValidNIM: (nim) => {
    return /^\d{10}$/.test(nim);
  },
  
  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  isValidDate: (date) => {
    return !isNaN(Date.parse(date));
  }
};

/**
 * Wait helpers
 */
export const waitHelpers = {
  forElement: (selector, timeout = 10000) => {
    cy.get(selector, { timeout }).should('exist');
  },
  
  forApiResponse: (alias, timeout = 10000) => {
    cy.wait(`@${alias}`, { timeout });
  },
  
  forPageTransition: (expectedUrl, timeout = 5000) => {
    cy.url({ timeout }).should('include', expectedUrl);
  },
  
  short: () => cy.wait(500),
  medium: () => cy.wait(1000),
  long: () => cy.wait(2000)
};

/**
 * Assertion helpers
 */
export const assertHelpers = {
  electionIsActive: (election) => {
    expect(dateHelpers.isActive(election.startDate, election.endDate)).to.be.true;
  },
  
  hasRequiredFields: (obj, fields) => {
    fields.forEach(field => {
      expect(obj).to.have.property(field);
    });
  },
  
  arrayNotEmpty: (arr) => {
    expect(arr).to.be.an('array').and.not.be.empty;
  },
  
  successResponse: (response) => {
    expect(response.status).to.be.oneOf([200, 201]);
    expect(response.body).to.exist;
  },
  
  errorResponse: (response, expectedStatus) => {
    expect(response.status).to.eq(expectedStatus);
    expect(response.body).to.have.property('error');
  }
};

/**
 * Mock data generators
 */
export const mockData = {
  elections: (count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Election ${i + 1}`,
      description: `Description for election ${i + 1}`,
      startDate: new Date(Date.now() - 86400000).toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'active'
    }));
  },
  
  candidates: (electionId, count = 3) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Candidate ${i + 1}`,
      number: i + 1,
      visionMission: `Vision and mission for candidate ${i + 1}`,
      electionId: electionId,
      votes: Math.floor(Math.random() * 100)
    }));
  },
  
  voters: (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      email: `voter${i + 1}@test.com`,
      name: `Voter ${i + 1}`,
      nim: `${1000000000 + i}`,
      hasVoted: i % 2 === 0
    }));
  },
  
  results: (candidates) => {
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    return {
      totalVotes,
      candidates: candidates.map(c => ({
        ...c,
        percentage: ((c.votes / totalVotes) * 100).toFixed(2)
      })),
      winner: candidates.reduce((max, c) => c.votes > max.votes ? c : max)
    };
  }
};

/**
 * Test state management
 */
export const testState = {
  storage: {},
  
  set: (key, value) => {
    testState.storage[key] = value;
  },
  
  get: (key) => {
    return testState.storage[key];
  },
  
  clear: () => {
    testState.storage = {};
  },
  
  has: (key) => {
    return testState.storage.hasOwnProperty(key);
  }
};

/**
 * URL helpers
 */
export const urlHelpers = {
  voter: {
    dashboard: '/voter/dashboard',
    vote: '/voter/vote',
    candidates: '/voter/candidates',
    results: '/voter/result',
    verify: '/voter/verify'
  },
  
  admin: {
    dashboard: '/admin/dashboard',
    elections: '/admin/elections',
    candidates: '/admin/candidates',
    voters: '/admin/voters',
    votingRights: '/admin/voting-rights'
  },
  
  api: {
    elections: '/api/election/getAllElections',
    candidates: '/api/candidate/getAllCandidates',
    vote: '/api/vote',
    results: '/api/election/results'
  }
};

/**
 * Performance monitoring
 */
export const performanceMonitor = {
  startTimer: (label) => {
    const start = Date.now();
    testState.set(`timer_${label}`, start);
    return start;
  },
  
  endTimer: (label) => {
    const start = testState.get(`timer_${label}`);
    const end = Date.now();
    const duration = end - start;
    cy.log(`⏱️ ${label}: ${duration}ms`);
    return duration;
  },
  
  measurePageLoad: (url) => {
    const start = performanceMonitor.startTimer('pageLoad');
    cy.visit(url);
    cy.window().then(() => {
      performanceMonitor.endTimer('pageLoad');
    });
  },
  
  measureApiCall: (alias, timeout = 10000) => {
    const start = performanceMonitor.startTimer('apiCall');
    cy.wait(`@${alias}`, { timeout }).then(() => {
      performanceMonitor.endTimer('apiCall');
    });
  }
};

/**
 * Console log helpers
 */
export const logger = {
  success: (message) => cy.log(`✅ ${message}`),
  error: (message) => cy.log(`❌ ${message}`),
  info: (message) => cy.log(`ℹ️ ${message}`),
  warning: (message) => cy.log(`⚠️ ${message}`),
  step: (message) => cy.log(`📍 ${message}`)
};

/**
 * Screenshot helpers
 */
export const screenshotHelper = {
  capture: (name) => {
    cy.screenshot(name, { capture: 'fullPage' });
  },
  
  captureOnError: (testName) => {
    cy.on('fail', (error) => {
      cy.screenshot(`FAILED_${testName}`, { capture: 'fullPage' });
      throw error;
    });
  }
};

/**
 * Network helpers
 */
export const networkHelpers = {
  simulateSlowNetwork: (delay = 2000) => {
    cy.intercept('**', (req) => {
      req.on('response', (res) => {
        res.setDelay(delay);
      });
    });
  },
  
  simulateOffline: () => {
    cy.intercept('**', { forceNetworkError: true });
  },
  
  mockSuccessResponse: (url, data) => {
    cy.intercept('GET', url, {
      statusCode: 200,
      body: data
    });
  },
  
  mockErrorResponse: (url, statusCode = 500) => {
    cy.intercept('GET', url, {
      statusCode,
      body: { error: 'Server error' }
    });
  }
};
