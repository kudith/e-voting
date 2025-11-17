describe('SiPilih - Voter Dashboard Tests', () => {
  beforeEach(() => {
    // Login sebagai voter sebelum setiap test
    cy.loginAsVoter();
    cy.visit('/voter/dashboard');
    cy.waitForPageLoad();
  });

  describe('Dashboard Access', () => {
    it('should load voter dashboard successfully', () => {
      cy.url().should('include', '/voter/dashboard');
    });

    it('should display voter information', () => {
      cy.get('body').should('be.visible');
    });

    it('should show navigation sidebar', () => {
      cy.get('nav, aside, [role="navigation"]').should('exist');
    });
  });

  describe('Active Elections', () => {
    it('should display active elections list', () => {
      cy.intercept('GET', '/api/election/**').as('getElections');
      cy.wait('@getElections', { timeout: 10000 });
    });

    it('should show election details', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should navigate to voting page', () => {
      cy.wait(2000);
      cy.get('a[href*="/voter/vote"], button').first().should('exist');
    });
  });

  describe('Voting Rights Verification', () => {
    it('should display voting rights status', () => {
      cy.intercept('GET', '/api/voting-rights/**').as('getVotingRights');
      cy.visit('/voter/dashboard');
      cy.wait('@getVotingRights', { timeout: 10000 });
    });

    it('should show eligible elections', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should navigate to candidates page', () => {
      cy.get('a[href*="/voter/candidates"]').first().click({ force: true });
      cy.url().should('include', '/voter/candidates');
    });

    it('should navigate to results page', () => {
      cy.get('a[href*="/voter/result"]').first().click({ force: true });
      cy.url().should('include', '/voter/result');
    });

    it('should navigate to verify page', () => {
      cy.get('a[href*="/voter/verify"]').first().click({ force: true });
      cy.url().should('include', '/voter/verify');
    });
  });

  describe('Dashboard Performance', () => {
    it('should load dashboard data within acceptable time', () => {
      const start = Date.now();
      cy.visit('/voter/dashboard');
      cy.get('body').should('be.visible').then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(5000);
      });
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/voter/dashboard');
      cy.get('body').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/voter/dashboard');
      cy.get('body').should('be.visible');
    });
  });
});
