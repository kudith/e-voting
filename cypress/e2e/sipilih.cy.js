describe('SIPILIH - E-Voting Flow', () => {

  // ✅ Functional test: Login
  it('should allow user to login with valid credentials', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name="username"]').type('admin_farid')
    cy.get('input[name="password"]').type('fred1212')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.contains('Selamat datang').should('be.visible')
  })

  // ✅ Functional test: Vote
  it('should allow user to vote once', () => {
    cy.visit('http://localhost:3000/dashboard')
    cy.get('[data-candidate="1"]').click()
    cy.contains('Vote berhasil').should('be.visible')
    cy.get('[data-candidate="1"]').should('be.disabled')
  })

  // ✅ System test: Admin checks results
  it('should allow admin to view voting results', () => {
    cy.visit('http://localhost:3000/admin')
    cy.get('input[name="username"]').type('admin_farid')
    cy.get('input[name="password"]').type('fredo931')
    cy.get('button[type="submit"]').click()
    cy.contains('Hasil Pemilihan').should('be.visible')
    cy.get('table').should('exist')
  })
})
