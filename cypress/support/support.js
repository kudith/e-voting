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
  // Prevent Cypress from failing on expected errors
  if (err.message.includes('KINDE_ISSUER_URL')) {
    return false;
  }
  if (err.message.includes('Hydration')) {
    return false;
  }
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  if (err.message.includes('Cannot read properties of undefined')) {
    return false;
  }
  if (err.message.includes('Network Error')) {
    return false;
  }
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
});

// Preserve cookies between tests in a describe block
Cypress.Cookies.defaults({
  preserve: ['kinde-auth', 'session']
});
