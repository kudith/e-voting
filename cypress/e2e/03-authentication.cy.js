describe('SIPILIH - Authentication Flow', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should redirect to login when accessing protected routes', () => {
    cy.visit('/voter/dashboard', { failOnStatusCode: false });
    cy.url({ timeout: 10000 }).should('include', '/api/auth/login');
  });

  it('should show login button on homepage', () => {
    cy.visit('/');
    cy.contains('Masuk').should('be.visible');
  });

  it('should redirect to Kinde login page when clicking login', () => {
    cy.visit('/');
    cy.contains('Masuk').click();
    cy.url({ timeout: 10000 }).should('include', 'adty.kinde.com');
  });

  // Note: Actual login test requires valid credentials
  it('should successfully login with valid credentials', () => {
    cy.loginViaKinde(Cypress.env('VOTER_EMAIL'), Cypress.env('VOTER_PASSWORD'));
    cy.visit('/voter/dashboard');
    cy.url().should('include', '/dashboard');
  });

  it('should maintain session across page reloads', () => {
    cy.loginViaKinde(Cypress.env('VOTER_EMAIL'), Cypress.env('VOTER_PASSWORD'));
    cy.visit('/voter/dashboard');
    cy.reload();
    cy.url().should('include', '/dashboard');
  });

  it('should successfully logout', () => {
    cy.loginViaKinde(Cypress.env('VOTER_EMAIL'), Cypress.env('VOTER_PASSWORD'));
    cy.logout();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});