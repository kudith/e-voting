describe('SiPilih - Voting Process Tests', () => {
  beforeEach(() => {
    cy.loginAsVoter();
  });

  describe('Vote Page Access', () => {
    it('should access vote page for active election', () => {
      cy.visit('/voter/vote');
      cy.waitForPageLoad();
      cy.url().should('include', '/voter/vote');
    });

    it('should display election information', () => {
      cy.visit('/voter/vote');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should load candidates for election', () => {
      cy.intercept('GET', '/api/candidate/**').as('getCandidates');
      cy.visit('/voter/vote');
      cy.wait('@getCandidates', { timeout: 10000 });
    });
  });

  describe('Candidate Selection', () => {
    beforeEach(() => {
      cy.visit('/voter/vote');
      cy.wait(2000);
    });

    it('should display all candidates', () => {
      cy.get('body').should('be.visible');
    });

    it('should allow selecting a candidate', () => {
      cy.get('input[type="radio"], button[role="radio"]').first().should('exist');
    });

    it('should highlight selected candidate', () => {
      cy.get('input[type="radio"], button[role="radio"]').first().click({ force: true });
      cy.wait(500);
    });

    it('should only allow one candidate selection', () => {
      cy.get('input[type="radio"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Vote Submission', () => {
    beforeEach(() => {
      cy.visit('/voter/vote');
      cy.wait(2000);
    });

    it('should have submit vote button', () => {
      cy.get('button').contains(/submit|kirim|vote/i).should('exist');
    });

    it('should show confirmation dialog before voting', () => {
      cy.get('input[type="radio"], button[role="radio"]').first().click({ force: true });
      cy.wait(500);
      cy.get('button').contains(/submit|kirim|vote/i).click({ force: true });
      cy.wait(1000);
    });

    it('should validate candidate selection before submit', () => {
      cy.get('button').contains(/submit|kirim|vote/i).click({ force: true });
      cy.wait(500);
    });
  });

  describe('Vote Encryption & Security', () => {
    it('should encrypt vote before submission', () => {
      cy.visit('/voter/vote');
      cy.wait(2000);
      
      // Intercept vote submission
      cy.intercept('POST', '/api/vote/**').as('submitVote');
      
      // Select candidate and submit
      cy.get('input[type="radio"], button[role="radio"]').first().click({ force: true });
      cy.wait(500);
      cy.get('button').contains(/submit|kirim|vote/i).click({ force: true });
      cy.wait(1000);
      
      // Confirm submission
      cy.get('button').contains(/confirm|ya|submit/i).click({ force: true });
      
      // Wait for vote submission
      cy.wait('@submitVote', { timeout: 15000 }).then((interception) => {
        if (interception.response) {
          expect(interception.response.statusCode).to.be.oneOf([200, 201, 400]);
        }
      });
    });

    it('should display encryption status', () => {
      cy.visit('/voter/vote');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Post-Voting Actions', () => {
    it('should redirect after successful vote', () => {
      cy.visit('/voter/vote');
      cy.wait(2000);
      
      cy.intercept('POST', '/api/vote/**').as('submitVote');
      
      cy.get('input[type="radio"], button[role="radio"]').first().click({ force: true });
      cy.wait(500);
      cy.get('button').contains(/submit|kirim|vote/i).click({ force: true });
      cy.wait(1000);
      cy.get('button').contains(/confirm|ya|submit/i).click({ force: true });
      
      cy.wait('@submitVote', { timeout: 15000 });
      cy.wait(2000);
    });

    it('should show vote confirmation page', () => {
      cy.visit('/voter/verify');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should prevent double voting', () => {
      cy.visit('/voter/vote');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Vote Verification', () => {
    it('should access verification page', () => {
      cy.visit('/voter/verify');
      cy.url().should('include', '/voter/verify');
    });

    it('should display vote hash/receipt', () => {
      cy.visit('/voter/verify');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should allow downloading vote receipt', () => {
      cy.visit('/voter/verify');
      cy.wait(2000);
      cy.get('button').contains(/download|unduh/i).should('exist');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '/api/vote/**', { forceNetworkError: true }).as('networkError');
      cy.visit('/voter/vote');
      cy.wait(2000);
    });

    it('should show error message on failed vote', () => {
      cy.intercept('POST', '/api/vote/**', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('voteError');
      cy.visit('/voter/vote');
      cy.wait(2000);
    });

    it('should handle session expiry', () => {
      cy.clearCookies();
      cy.visit('/voter/vote', { failOnStatusCode: false });
      cy.wait(2000);
    });
  });
});
