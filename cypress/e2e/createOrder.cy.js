describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080/login')
    cy.get('#username').type('user')
    cy.get('#password').type('user123{enter}')
    cy.contains('Nueva Orden').click()

    // Abre el modal
    cy.get('#nuevaOrdenModal').as('modal')
    cy.get('@modal').should('be.visible')

    // Selecciona una opción en cada selector
    cy.get('@modal').find('#choferInput').select('Agustin Sanguesa', {force: true}) // Reemplaza 'Agustin Sanguesa' con el valor de la opción que deseas seleccionar
    cy.get('@modal').find('#clienteInput').select('agus', {force: true})
    cy.get('@modal').find('#camionInput').select('BGS345', {force: true})
    cy.get('@modal').find('#productoInput').select('producto test', {force: true})

    // Ingresa un valor en el campo de preset
    cy.get('@modal').find('#presetInput').type('100')

    // Haz clic en el botón Aceptar
    cy.get('@modal').find('.btn-primary').click()

    // Verifica que el modal se haya cerrado
    cy.get('@modal').should('not.be.visible')
  })
})