describe('Remove Operation Request Page Tests', () => {
    beforeEach(() => {
      cy.visit('/auth');
      cy.intercept('POST', 'http://localhost:5174/api/Staff/authenticate').as('loginRequest'); // Intercept login request
      cy.get('#login').click();
    });
  
    it('should load the remove operation request form with operation requests', () => {
      cy.get('#burger', { timeout: 10000 }).should('be.visible').click();
      cy.contains('.sidebar-menu li', 'Manage Operation Requests').click();
      cy.contains('.sidebar-menu li', 'Remove Operation Request').click();
  
      // Ensure the operation request dropdown is visible and populated with requests
      cy.get('#operationRequestId').should('be.visible');
      cy.get('#operationRequestId option').should('have.length.greaterThan', 0); // Check that the list has requests
    });
  
   
  });
  