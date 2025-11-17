// ***********************************************
// SiPilih E-Voting - Cypress Support File
// ***********************************************

import './commands';
import './helpers';

// Setup interceptors untuk API calls
beforeEach(() => {
  // Intercept API calls
  cy.intercept('GET', '/api/candidate/**').as('getCandidates');
  cy.intercept('GET', '/api/election/**').as('getElections');
  cy.intercept('POST', '/api/vote/**').as('castVote');
  cy.intercept('GET', '/api/voter/**').as('getVoter');
  cy.intercept('GET', '/api/voting-rights/**').as('getVotingRights');
  cy.intercept('GET', '/api/stats/**').as('getStats');
  cy.intercept('GET', '/api/admin/**').as('getAdmin');
  cy.intercept('POST', '/api/admin/**').as('postAdmin');
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on expected errors coming from external libs or dev HMR
  const msg = err && err.message ? err.message : '';

  // Ignore known benign messages (Kinde, hydration, ResizeObserver, network issues,
  // and Turbopack / HMR chunk loading failures)
  const ignorePatterns = [
    'KINDE_ISSUER_URL',
    'Hydration',
    'ResizeObserver',
    'Cannot read properties of undefined',
    'Network Error',
    'Failed to load chunk',
    'hmr-client',
    'NetworkError when attempting to fetch resource'
  ];

  for (const p of ignorePatterns) {
    if (msg.includes(p)) {
      return false;
    }
  }

  // By default, let Cypress fail the test for other uncaught exceptions
  return true;
});

// Add custom assertion for API responses
chai.Assertion.addMethod('validApiResponse', function() {
  const obj = this._obj;
  
  new chai.Assertion(obj).to.have.property('status');
  new chai.Assertion(obj.status).to.be.oneOf([200, 201, 204]);
  
  if (obj.body) {
    new chai.Assertion(obj.body).to.exist;
  }
});

// Add custom assertion for election status
chai.Assertion.addMethod('activeElection', function() {
  const election = this._obj;
  const now = new Date();
  const start = new Date(election.startDate);
  const end = new Date(election.endDate);
  
  new chai.Assertion(now >= start && now <= end).to.be.true;
});

// Global test hooks
before(() => {
  cy.log('🚀 Starting SiPilih E-Voting Test Suite');
  cy.clearCookies();
  cy.clearLocalStorage();
});

after(() => {
  cy.log('✅ Test Suite Completed');
});

// Clear state between tests
afterEach(() => {
  // Capture screenshot on failure
  cy.on('fail', (error) => {
    cy.screenshot('failure');
    throw error;
  });
});

// Add viewport presets
Cypress.Commands.add('setMobile', () => {
  cy.viewport('iphone-x');
});

Cypress.Commands.add('setTablet', () => {
  cy.viewport('ipad-2');
});

Cypress.Commands.add('setDesktop', () => {
  cy.viewport(1920, 1080);
});

// Performance monitoring
Cypress.on('window:before:load', (win) => {
  win.performance.mark('app-start');

  // Prevent app-driven unhandled promise rejections (like HMR chunk load failures)
  // from surfacing to Cypress as uncaught exceptions. Only suppress known benign
  // messages so real app errors still fail the tests.
  win.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason && event.reason.message ? event.reason.message : String(event.reason || '');
      if (/Failed to load chunk|hmr-client|NetworkError when attempting to fetch resource|KINDE_ISSUER_URL|Hydration/.test(reason)) {
        event.preventDefault();
      }
    } catch (e) {
      // ignore handler errors
    }
  });
});
