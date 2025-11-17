describe('SIPILIH - How to Vote Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('a[href*="howtovote"]').first().click();
    cy.waitForPageLoad();
  });

  it('should display how to vote section', () => {
    cy.get('section#howtovote').should('be.visible');
    cy.contains('Langkah-Langkah Voting').should('be.visible');
  });

  it('should display all 6 voting steps', () => {
    const steps = [
      'Login & Verifikasi Identitas',
      'Akses Dashboard Pemilih',
      'Melakukan Pemungutan Suara',
      'Pencatatan & Enkripsi Suara',
      'Verifikasi Manual oleh Pemilih',
      'Melihat Hasil Voting'
    ];

    steps.forEach((step) => {
      cy.contains(step).should('be.visible');
    });
  });

  it('should display step numbers 1 to 6', () => {
    for (let i = 1; i <= 6; i++) {
      cy.contains(i.toString()).should('be.visible');
    }
  });

  it('should display voting path SVG animation', () => {
    cy.get('svg path').should('be.visible');
  });

  it('should display "Mulai Voting" button', () => {
    cy.contains('Mulai Voting').should('be.visible');
  });

  it('should redirect to login when clicking "Mulai Voting" (unauthenticated)', () => {
    cy.contains('Mulai Voting').click();
    cy.url({ timeout: 10000 }).should('include', '/api/auth/login');
  });
});