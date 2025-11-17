// ***********************************************
// Custom commands untuk SiPilih E-Voting Platform
// ***********************************************

// Command untuk login menggunakan Kinde OAuth dengan username
Cypress.Commands.add('loginViaKinde', (username, password) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/');
      cy.wait(1000);
      
      // Klik tombol login - cari link atau button yang mengandung teks masuk/login
      cy.get('body').then($body => {
        if ($body.text().includes('Masuk') || $body.text().includes('Login')) {
          cy.contains('a[href*="/api/auth/login"], button', /masuk|login/i).first().click({ force: true });
        }
      });
      
      // Handle Kinde authentication popup/redirect dengan username
      cy.origin('https://adty.kinde.com', { args: { username, password } }, ({ username, password }) => {
        // Wait for login form - bisa input username atau email
        cy.get('input[type="text"], input[type="email"], input[name="username"], input[name="loginId"]', { timeout: 10000 }).first().should('be.visible');
        cy.get('input[type="text"], input[type="email"], input[name="username"], input[name="loginId"]').first().type(username);
        
        // Click continue/next button
        cy.get('button[type="submit"]').first().click();
        
        // Wait for password field
        cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible');
        cy.get('input[type="password"]').first().type(password);
        
        // Submit login
        cy.get('button[type="submit"]').first().click();
      });
      
      // Wait for redirect back to app
      cy.url({ timeout: 20000 }).should('satisfy', (url) => {
        return url.includes('/dashboard') || url.includes('/voter') || url.includes('/admin');
      });
    },
    {
      validate() {
        // Validasi session masih aktif dengan mengecek URL dashboard atau admin
        cy.url().should('satisfy', (url) => {
          return url.includes('/dashboard') || url.includes('/voter') || url.includes('/admin');
        });
      },
      cacheAcrossSpecs: true
    }
  );
});

// Command untuk login sebagai admin (menggunakan username)
Cypress.Commands.add('loginAsAdmin', () => {
  cy.loginViaKinde(
    Cypress.env('ADMIN_USERNAME') || 'admin_farid',
    Cypress.env('ADMIN_PASSWORD') || 'fredo931'
  );
});

// Command untuk login sebagai voter (menggunakan username)
Cypress.Commands.add('loginAsVoter', () => {
  cy.loginViaKinde(
    Cypress.env('VOTER_USERNAME') || 'admin_farid',
    Cypress.env('VOTER_PASSWORD') || 'fredo931'
  );
});

// Command untuk logout
Cypress.Commands.add('logout', () => {
  cy.visit('/api/auth/logout');
  cy.wait(2000);
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Command untuk API request
Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  return cy.request({
    method,
    url: `${Cypress.env('API_URL')}${endpoint}`,
    body,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

// Command untuk wait page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().its('document.readyState').should('equal', 'complete');
});

// Command untuk scroll ke section
Cypress.Commands.add('scrollToSection', (sectionId) => {
  cy.get(`#${sectionId}`).scrollIntoView({ duration: 1000 });
});

// Command untuk load fixture data
Cypress.Commands.add('loadFixture', (fixtureName) => {
  return cy.fixture(fixtureName);
});

// Command untuk intercept dan mock API responses
Cypress.Commands.add('mockElections', (elections = null) => {
  if (elections === null) {
    cy.fixture('elections').then((data) => {
      cy.intercept('GET', '/api/election/**', {
        statusCode: 200,
        body: [data.activeElection]
      }).as('getElections');
    });
  } else {
    cy.intercept('GET', '/api/election/**', {
      statusCode: 200,
      body: elections
    }).as('getElections');
  }
});

Cypress.Commands.add('mockCandidates', (candidates = null) => {
  if (candidates === null) {
    cy.fixture('candidates').then((data) => {
      cy.intercept('GET', '/api/candidate/**', {
        statusCode: 200,
        body: data.candidatesArray
      }).as('getCandidates');
    });
  } else {
    cy.intercept('GET', '/api/candidate/**', {
      statusCode: 200,
      body: candidates
    }).as('getCandidates');
  }
});

Cypress.Commands.add('mockVoteSubmission', (success = true) => {
  if (success) {
    cy.intercept('POST', '/api/vote/**', {
      statusCode: 200,
      body: { success: true, message: 'Vote submitted successfully', voteId: 'test-vote-id' }
    }).as('submitVote');
  } else {
    cy.intercept('POST', '/api/vote/**', {
      statusCode: 400,
      body: { success: false, message: 'Vote submission failed' }
    }).as('submitVote');
  }
});

// Command untuk verify encryption
Cypress.Commands.add('verifyEncryption', (data) => {
  expect(data).to.have.property('iv');
  expect(data).to.have.property('encryptedData');
  expect(data).to.have.property('tag');
});

// Command untuk wait for API response
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
  cy.wait(`@${alias}`, { timeout });
});

// Command untuk check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Command untuk screenshot on failure
Cypress.Commands.add('screenshotOnFail', (testName) => {
  cy.screenshot(testName, { capture: 'fullPage' });
});

// Command untuk verify responsive design
Cypress.Commands.add('testResponsive', (testCallback) => {
  const viewports = [
    { device: 'mobile', width: 375, height: 667 },
    { device: 'tablet', width: 768, height: 1024 },
    { device: 'desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    testCallback(viewport.device);
  });
});

// Command untuk create test election
Cypress.Commands.add('createTestElection', (electionData) => {
  return cy.apiRequest('POST', '/admin/elections', electionData);
});

// Command untuk create test candidate
Cypress.Commands.add('createTestCandidate', (candidateData) => {
  return cy.apiRequest('POST', '/admin/candidates', candidateData);
});

// Command untuk grant voting rights
Cypress.Commands.add('grantVotingRights', (voterId, electionId) => {
  return cy.apiRequest('POST', '/admin/voting-rights', { voterId, electionId });
});

// Command untuk simulate vote
Cypress.Commands.add('castVote', (candidateId, electionId) => {
  cy.visit('/voter/vote');
  cy.wait(2000);
  
  // Select candidate
  cy.get(`input[value="${candidateId}"], [data-candidate-id="${candidateId}"]`).click({ force: true });
  cy.wait(500);
  
  // Submit vote
  cy.get('button').contains(/submit|kirim/i).click({ force: true });
  cy.wait(1000);
  
  // Confirm
  cy.get('button').contains(/confirm|ya/i).click({ force: true });
  cy.wait(2000);
});

// Command untuk verify vote receipt
Cypress.Commands.add('verifyVoteReceipt', () => {
  cy.visit('/voter/verify');
  cy.wait(2000);
  cy.get('body').should('contain', /hash|receipt|bukti/i);
});

// Command untuk check election status
Cypress.Commands.add('checkElectionStatus', (electionId) => {
  return cy.apiRequest('GET', `/election/${electionId}/status`);
});

// Command untuk get election results
Cypress.Commands.add('getElectionResults', (electionId) => {
  return cy.apiRequest('GET', `/election/${electionId}/results`);
});

// Command untuk clear test data
Cypress.Commands.add('clearTestData', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  sessionStorage.clear();
});

// Command untuk setup test environment
Cypress.Commands.add('setupTestEnvironment', () => {
  cy.clearTestData();
  cy.visit('/');
  cy.waitForPageLoad();
});

// Command untuk verify page title
Cypress.Commands.add('verifyPageTitle', (expectedTitle) => {
  cy.title().should('include', expectedTitle);
});

// Command untuk verify url contains
Cypress.Commands.add('verifyUrlContains', (expectedPath) => {
  cy.url().should('include', expectedPath);
});

// Command untuk wait and verify
Cypress.Commands.add('waitAndVerify', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

// Command untuk type with delay (untuk simulate user typing)
Cypress.Commands.add('typeSlowly', { prevSubject: 'element' }, (subject, text, delay = 100) => {
  cy.wrap(subject).type(text, { delay });
});

// Command untuk check if element exists
Cypress.Commands.add('elementExists', (selector) => {
  cy.get('body').then($body => {
    return $body.find(selector).length > 0;
  });
});

// Command untuk intercept all API calls
Cypress.Commands.add('interceptAllApis', () => {
  cy.intercept('GET', '/api/election/**').as('elections');
  cy.intercept('GET', '/api/candidate/**').as('candidates');
  cy.intercept('GET', '/api/voter/**').as('voters');
  cy.intercept('GET', '/api/voting-rights/**').as('votingRights');
  cy.intercept('POST', '/api/vote/**').as('vote');
});

// Override visit command to add error handling
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const defaultOptions = {
    failOnStatusCode: false,
    ...options
  };
  return originalFn(url, defaultOptions);
});
