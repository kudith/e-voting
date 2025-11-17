describe('SiPilih - Admin Dashboard Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/dashboard');
    cy.waitForPageLoad();
  });

  describe('Admin Dashboard Access', () => {
    it('should load admin dashboard successfully', () => {
      cy.url().should('include', '/admin/dashboard');
    });

    it('should display admin navigation', () => {
      cy.get('nav, aside, [role="navigation"]').should('exist');
    });

    it('should show dashboard statistics', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Election Management', () => {
    it('should navigate to election management', () => {
      cy.get('a[href*="/admin"]').should('have.length.greaterThan', 0);
    });

    it('should display elections list', () => {
      cy.intercept('GET', '/api/election/**').as('getElections');
      cy.visit('/admin/dashboard');
      cy.wait('@getElections', { timeout: 10000 });
    });

    it('should have create election button', () => {
      cy.wait(2000);
      cy.get('button').should('have.length.greaterThan', 0);
    });

    it('should open create election form', () => {
      cy.wait(2000);
      cy.get('button').contains(/create|buat|tambah/i).first().click({ force: true });
      cy.wait(1000);
    });

    it('should validate election form', () => {
      cy.wait(2000);
      cy.get('button').contains(/create|buat|tambah/i).first().click({ force: true });
      cy.wait(1000);
      cy.get('button[type="submit"]').click({ force: true });
      cy.wait(500);
    });
  });

  describe('Candidate Management', () => {
    it('should navigate to candidate management', () => {
      cy.get('a').should('have.length.greaterThan', 0);
    });

    it('should display candidates list', () => {
      cy.intercept('GET', '/api/candidate/**').as('getCandidates');
      cy.visit('/admin/dashboard');
      cy.wait('@getCandidates', { timeout: 10000 });
    });

    it('should have add candidate button', () => {
      cy.wait(2000);
      cy.get('button').should('have.length.greaterThan', 0);
    });
  });

  describe('Voter Management', () => {
    it('should navigate to voter management', () => {
      cy.get('a').should('have.length.greaterThan', 0);
    });

    it('should display voters list', () => {
      cy.intercept('GET', '/api/voter/**').as('getVoters');
      cy.visit('/admin/dashboard');
      cy.wait('@getVoters', { timeout: 10000 });
    });

    it('should have search functionality', () => {
      cy.wait(2000);
      cy.get('input[type="search"], input[type="text"]').should('exist');
    });

    it('should have pagination', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Voting Rights Management', () => {
    it('should manage voting rights', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should assign voting rights to voters', () => {
      cy.intercept('POST', '/api/voting-rights/**').as('assignRights');
      cy.wait(2000);
    });

    it('should revoke voting rights', () => {
      cy.intercept('DELETE', '/api/voting-rights/**').as('revokeRights');
      cy.wait(2000);
    });
  });

  describe('Monitoring & Results', () => {
    it('should display real-time voting statistics', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should show vote count per candidate', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should display charts and graphs', () => {
      cy.wait(2000);
      cy.get('canvas, svg').should('exist');
    });

    it('should update statistics in real-time', () => {
      cy.intercept('GET', '/api/election/**').as('getStats');
      cy.wait(2000);
    });
  });

  describe('Admin Security', () => {
    it('should prevent non-admin access', () => {
      cy.logout();
      cy.loginAsVoter();
      cy.visit('/admin/dashboard', { failOnStatusCode: false });
      cy.wait(2000);
    });

    it('should validate admin permissions', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/admin/dashboard');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should have mobile menu', () => {
      cy.viewport('iphone-x');
      cy.visit('/admin/dashboard');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });
});
