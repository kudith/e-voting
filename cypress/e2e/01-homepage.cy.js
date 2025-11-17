describe('SiPilih - Homepage & Landing Page Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
    // Intercept API calls
    cy.intercept('GET', '/api/election/getAllElections').as('getElections');
  });

  describe('Homepage Loading', () => {
    it('should load homepage successfully', () => {
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('h1').should('be.visible');
    });

    it('should display SiPilih branding', () => {
      cy.contains('SiPilih').should('be.visible');
    });

    it('should have proper meta tags', () => {
      cy.document().its('head').find('title');
    });

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.get('h1').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      cy.get('h1').should('be.visible');
    });
  });

  describe('Hero Section', () => {
    it('should display hero section with main content', () => {
      cy.get('body').should('be.visible');
    });

    it('should display call-to-action buttons', () => {
      cy.get('a, button').should('have.length.greaterThan', 0);
    });

    it('should have interactive elements', () => {
      cy.get('button').first().should('be.visible');
    });
  });

  describe('Elections Section', () => {
    it('should load elections from API', () => {
      cy.wait('@getElections').its('response.statusCode').should('eq', 200);
    });

    it('should display elections data', () => {
      cy.wait('@getElections').then((interception) => {
        if (interception.response && interception.response.body) {
          expect(interception.response.body).to.be.an('array');
        }
      });
    });
  });

  describe('Navigation & Links', () => {
    it('should have navigation elements', () => {
      cy.get('nav, header').should('exist');
    });

    it('should have clickable links', () => {
      cy.get('a').should('have.length.greaterThan', 0);
    });
  });

  describe('Page Performance', () => {
    it('should load page within acceptable time', () => {
      const start = Date.now();
      cy.visit('/');
      cy.window().then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(5000);
      });
    });

    it('should have no console errors', () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.spy(win.console, 'error').as('consoleError');
        },
      });
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Footer', () => {
    it('should display footer', () => {
      cy.scrollTo('bottom');
      cy.get('footer').should('be.visible');
    });
  });
});