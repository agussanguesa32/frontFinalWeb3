describe('Login Test', () => {
  it('logs in with correct credentials', () => {
    cy.visit('http://localhost:8080/login')

    cy.get('#username').type('user')
    cy.get('#password').type('user123{enter}')
  })
})