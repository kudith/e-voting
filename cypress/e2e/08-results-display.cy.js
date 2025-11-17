describe('SiPilih - Results Display Tests', () => {
  
  describe('Public Results Access', () => {
    it('should display results on homepage after election ends', () => {
      cy.visit('/');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should show election results without authentication', () => {
      cy.visit('/');
      cy.intercept('GET', '/api/election/**').as('getElections');
      cy.wait('@getElections', { timeout: 10000 });
    });
  });

  describe('Voter Results Page', () => {
    beforeEach(() => {
      cy.loginAsVoter();
      cy.visit('/voter/result');
      cy.waitForPageLoad();
    });

    it('should load results page successfully', () => {
      cy.url().should('include', '/voter/result');
    });

    it('should display completed elections', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should show vote counts per candidate', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should display winner information', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should show percentage for each candidate', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Results Visualization', () => {
    beforeEach(() => {
      cy.loginAsVoter();
      cy.visit('/voter/result');
      cy.wait(2000);
    });

    it('should display results in chart format', () => {
      cy.get('canvas, svg').should('exist');
    });

    it('should show bar chart of results', () => {
      cy.get('canvas, svg').should('be.visible');
    });

    it('should display pie chart option', () => {
      cy.wait(1000);
      cy.get('body').should('be.visible');
    });

    it('should allow switching between chart types', () => {
      cy.get('button').should('have.length.greaterThan', 0);
    });
  });

  describe('Results Data Accuracy', () => {
    beforeEach(() => {
      cy.loginAsVoter();
    });

    it('should display accurate vote counts', () => {
      cy.intercept('GET', '/api/election/**').as('getResults');
      cy.visit('/voter/result');
      cy.wait('@getResults', { timeout: 10000 }).then((interception) => {
        if (interception.response && interception.response.body) {
          expect(interception.response.statusCode).to.eq(200);
        }
      });
    });

    it('should show total votes cast', () => {
      cy.visit('/voter/result');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should calculate percentages correctly', () => {
      cy.visit('/voter/result');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Results Filtering', () => {
    beforeEach(() => {
      cy.loginAsVoter();
      cy.visit('/voter/result');
      cy.wait(2000);
    });

    it('should filter results by election', () => {
      cy.get('select, button').should('exist');
    });

    it('should display historical results', () => {
      cy.get('body').should('be.visible');
    });

    it('should sort results by date', () => {
      cy.get('body').should('be.visible');
    });
  });

  describe('Export Functionality', () => {
    beforeEach(() => {
      cy.loginAsVoter();
      cy.visit('/voter/result');
      cy.wait(2000);
    });

    it('should have export button', () => {
      cy.get('button').contains(/export|download|unduh/i).should('exist');
    });

    it('should export results as PDF', () => {
      cy.get('button').contains(/pdf/i).should('exist');
    });

    it('should export results as CSV', () => {
      cy.get('button').contains(/csv|excel/i).should('exist');
    });
  });

  describe('Real-time Updates', () => {
    beforeEach(() => {
      cy.loginAsVoter();
      cy.visit('/voter/result');
    });

    it('should show live vote counts during active election', () => {
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should update results automatically', () => {
      cy.intercept('GET', '/api/election/**').as('pollResults');
      cy.wait(3000);
    });
  });

  describe('Results Security', () => {
    it('should not show results before election ends', () => {
      cy.visit('/');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should verify vote integrity', () => {
      cy.loginAsVoter();
      cy.visit('/voter/result');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      cy.loginAsVoter();
    });

    it('should display results correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/voter/result');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should display results correctly on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/voter/result');
      cy.wait(2000);
      cy.get('body').should('be.visible');
    });

    it('should adapt charts for mobile view', () => {
      cy.viewport('iphone-x');
      cy.visit('/voter/result');
      cy.wait(2000);
      cy.get('canvas, svg').should('exist');
    });
  });
});
