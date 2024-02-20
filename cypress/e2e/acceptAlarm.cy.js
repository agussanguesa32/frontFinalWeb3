describe('template spec', () => {
    it('passes', () => {
      cy.visit('http://localhost:8080/login')
      cy.get('#username').type('user')
      cy.get('#password').type('user123{enter}')
      cy.wait(1000)
      cy.contains('Nueva Orden').click()
  
      // Abre el modal
      cy.get('#nuevaOrdenModal').as('modal')
      cy.get('@modal').should('be.visible')
  
      // Selecciona una opción en cada selector
      cy.get('@modal').find('#choferInput').select('Agustin Sanguesa', {force: true}) // Reemplaza 'Agustin Sanguesa' con el valor de la opción que deseas seleccionar
      cy.get('@modal').find('#clienteInput').select('agus', {force: true})
      cy.get('@modal').find('#camionInput').select('ZOH987', {force: true})
      cy.get('@modal').find('#productoInput').select('producto test', {force: true})
  
      // Ingresa un valor en el campo de preset
      cy.get('@modal').find('#presetInput').type('100')
  
      // Haz clic en el botón Aceptar
      cy.get('@modal').find('.btn-primary').click()
  
      // Verifica que el modal se haya cerrado
      cy.get('@modal').should('not.be.visible')
      cy.wait(1000)
      // Busca la fila con la patente 'ZOH987' y hace clic en ella
      cy.get('table tbody tr').filter((index, row) => {
        const cells = Cypress.$(row).find('td');
        const patenteCamion = cells.eq(2).text(); // Asume que la columna 'Camión' es la tercera columna
        const estado = cells.eq(1).text(); // Asume que la columna 'Estado' es la segunda columna
        return patenteCamion.includes('ZOH987') && estado.includes('1');
      }).first().click();
      cy.get('.fixed-right > .btn:nth-child(1)').click();
      cy.get('#pesarCamionModal #pesoInput').click();
      cy.get('#pesarCamionModal #pesoInput').type('90');
      cy.get('#pesarCamionModal .btn-primary').click();
      cy.wait(1000)
      cy.get('table tbody tr').filter((index, row) => {
        const cells = Cypress.$(row).find('td');
        const patenteCamion = cells.eq(2).text(); // Asume que la columna 'Camión' es la tercera columna
        const estado = cells.eq(1).text(); // Asume que la columna 'Estado' es la segunda columna
        return patenteCamion.includes('ZOH987') && estado.includes('2');
      }).first().click();
      cy.get('.mb-2:nth-child(2)').click();
      cy.get('#masaAcumuladaInput').click();
      cy.get('#masaAcumuladaInput').type('100');
      cy.get('#densidadProductoInput').click();
      cy.get('#densidadProductoInput').type('{backspace}');
      cy.get('#densidadProductoInput').type('90');
      cy.get('.form-group:nth-child(4)').click();
      cy.get('#temperaturaProductoInput').click();
      cy.get('#temperaturaProductoInput').type('100');
      cy.get('#caudalInput').click();
      cy.get('#caudalInput').type('50');
      cy.get('#agregarDetalleModal .btn-primary').click();
      cy.wait(1000)
      cy.get('table tbody tr').filter((index, row) => {
        const cells = Cypress.$(row).find('td');
        const patenteCamion = cells.eq(2).text(); // Asume que la columna 'Camión' es la tercera columna
        const estado = cells.eq(1).text(); // Asume que la columna 'Estado' es la segunda columna
        return patenteCamion.includes('ZOH987') && estado.includes('2');
      }).first().click();
    cy.get('.selected-row > td:nth-child(5)').click();
    cy.get('.selected-row .fas').click();
    cy.get('.modal-body > input').click();
    cy.get('.modal-body > input').type('test');
    cy.wait(1000)
    cy.get('#alertModal .btn').click();
  
    })
  })